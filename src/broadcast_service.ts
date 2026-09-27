import { z } from "zod";
import { InfraiRealtime } from "./infrai_realtime.js";

export const Announcement = z.object({
  channel: z.string().min(1),
  assetId: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  accountId: z.string().min(1),
  memberCount: z.number().int().nonnegative()
});
export type AnnouncementInput = z.infer<typeof Announcement>;

export async function deliverAnnouncement(input: AnnouncementInput, client: InfraiRealtime) {
  const announcement = Announcement.parse(input);
  if (announcement.memberCount === 0) return { delivered: false, reason: "no-members" as const };
  await client.createChannel(announcement.channel);
  await client.publish(announcement.channel, "media.announcement", {
    asset_id: announcement.assetId,
    title: announcement.title,
    body: announcement.body
  }, announcement.accountId);
  return { delivered: true, recipients: announcement.memberCount };
}
