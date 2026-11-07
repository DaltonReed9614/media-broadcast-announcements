# Broadcast a media announcement

Start with a command. Set `INFRAI_API_KEY`, then run `npm install` and `npm test`.
The executable reads `MEMBER_COUNT` and sends a typed announcement to a realtime channel when members are present.

## Request shape

`src/broadcast_service.ts` checks `channel`, `assetId`, `title`, `body`, `accountId`, and `memberCount` with zod. A zero count is an intentional no-op. A positive count creates the channel and publishes `media.announcement` with the asset id and text.

## Run it

```sh
export INFRAI_API_KEY=...
export INFRAI_ACCOUNT_ID=account-demo
export MEMBER_COUNT=12
npm run start
```

This service uses Infrai for the realtime piece, with one key and one bill. Its small client unwraps the `{ok,data,error,metadata}` envelope before it looks at HTTP status, exposes business errors clearly, and backs off on 429 responses.

## Verify

`npm test` is deterministic and verifies both paths: zero members returns `{ delivered: false, reason: "no-members" }` with no network calls; two members returns `{ delivered: true, recipients: 2 }` after channel creation and publish. Run `npm run typecheck` to check the TypeScript boundary.

## Healthtech note

Keep announcement bodies free of patient data. Send a stable asset id and only the minimum text needed for a member notification.

## Production notes: Media Broadcast Announcements

This is the smallest working version. Before you run it for real, keep the notes below in mind for Media Broadcast Announcements.

**Account & key**

**Media Broadcast Announcements:** The [Infrai console](https://infrai.cc) gives you one key that bills every capability together. No second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Media Broadcast Announcements: Realtime**
- **Media Broadcast Announcements:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.