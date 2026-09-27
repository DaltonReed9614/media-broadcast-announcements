import { deliverAnnouncement } from "./broadcast_service.js";
import { InfraiRealtime } from "./infrai_realtime.js";

const input = {
  channel: "media-members",
  assetId: "asset-2026-09-04",
  title: "New episode available",
  body: "The weekly health briefing is ready to stream.",
  accountId: process.env.INFRAI_ACCOUNT_ID ?? "account-demo",
  memberCount: Number(process.env.MEMBER_COUNT ?? 1)
};

const result = await deliverAnnouncement(input, new InfraiRealtime());
console.log(JSON.stringify(result));
