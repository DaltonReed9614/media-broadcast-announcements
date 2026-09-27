import assert from "node:assert/strict";
import { deliverAnnouncement, type AnnouncementInput } from "../src/broadcast_service.js";

const sample: AnnouncementInput = { channel: "media-members", assetId: "asset-1", title: "Update", body: "Ready", accountId: "acct-1", memberCount: 0 };
const calls: string[] = [];
const fake = { createChannel: async () => { calls.push("create"); }, publish: async () => { calls.push("publish"); } } as never;
const empty = await deliverAnnouncement(sample, fake);
assert.deepEqual(empty, { delivered: false, reason: "no-members" });
assert.deepEqual(calls, []);

const delivered = await deliverAnnouncement({ ...sample, memberCount: 2 }, fake);
assert.deepEqual(delivered, { delivered: true, recipients: 2 });
assert.deepEqual(calls, ["create", "publish"]);
console.log("broadcast decision test passed");
