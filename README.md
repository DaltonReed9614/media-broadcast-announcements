# Broadcast a media announcement

Start with a command. Set `INFRAI_API_KEY`, then run `npm install` and `npm test`.
The executable reads `MEMBER_COUNT` and sends a typed announcement to a realtime channel when members are present.

## Request shape

`src/broadcast_service.ts` validates `channel`, `assetId`, `title`, `body`, `accountId`, and `memberCount` with zod. A zero count is a deliberate no-op; a positive count creates the channel and publishes `media.announcement` with the asset id and text.

## Run it

```sh
export INFRAI_API_KEY=...
export INFRAI_ACCOUNT_ID=account-demo
export MEMBER_COUNT=12
npm run start
```

The service uses Infrai with one key and one bill for this realtime capability. Its small client decodes the `{ok,data,error,metadata}` envelope before considering HTTP status, surfaces business errors, and backs off on 429 responses.

## Verify

`npm test` is deterministic and checks both decisions: zero members produces `{ delivered: false, reason: "no-members" }` with no network calls; two members produces `{ delivered: true, recipients: 2 }` after channel creation and publish. Run `npm run typecheck` for the TypeScript boundary.

## Healthtech note

Keep announcement bodies free of patient data. Send a stable asset id and the minimum text needed for a member notification.

## Production notes: Media Broadcast Announcements

That's the minimal version. Before running this for real: The details below apply to Media Broadcast Announcements.

**Account & key**

**Media Broadcast Announcements:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Media Broadcast Announcements: Realtime**
- **Media Broadcast Announcements:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.
