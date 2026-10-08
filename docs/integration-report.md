# Admin panel integration report

Status as of 8 October 2026. Written for the backend owner and whoever works on the panel next.

## What is live

All five screens run on the deployed API. Verified in a headless Chromium browser against https://kinvo-admin-panel-six.vercel.app: sign-in, every screen and tab, pagination, detail views, deep-link reload and sign-out, with no CORS or console errors.

| Screen | Endpoints used |
| --- | --- |
| Shell | `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/admin/me`, `/admin/guardrails` |
| User management | `/admin/users` (+ `/{id}`, `/membership`, `/activity`, `/suspend`, `/reinstate`, `/role`), `/admin/users/snapshot`, `/admin/audit-log`, `/admin/roles` (+ `/{id}/permissions`), `PATCH /admin/guardrails/{key}` |
| Content moderation | `/admin/moderation/queue`, `/escalations`, `/insights`, `/flags/{id}/assignee`; resolving via `PATCH /reports/{id}`, `PATCH /moderation/flags/{id}`; `/verification/review`, `POST /verification/{id}/review` |
| Date suggestions | `/admin/venues` (GET, POST, PATCH) |
| Subscriptions | `/admin/subscription-products` (GET, PATCH), `/{id}/prices` (GET, POST) |
| Analytics | `/admin/analytics` |

Token handling was tested in the browser: an expired access token refreshes once and continues; an invalid one signs out without refreshing; two requests expiring together share one refresh.

**Not exercised against live data:** the mutating actions (suspend, reinstate, role change, permission matrix, guardrail toggle, resolve, claim, verification decision, venue create/edit, product edit, price version). They are wired to the documented endpoints and show the server's messages, but were not run, to avoid changing production records. Read-only mode's banner was likewise not seen live (turning the guardrail on would freeze every operator).

## What the API could not supply, and what the panel does instead

| Mock feature | Why | Now |
| --- | --- | --- |
| Add user | No endpoint creates users | Removed |
| Billing actions (mark paid, cancel, change plan) | Not a billing system | Removed |
| Cross-user membership and activity tables | Only per-user endpoints exist | Shown per user in the detail view; the freed tab shows the audit log |
| Acquisition "channels" (referrals, ads, partners), upsell conversion | Not recorded anywhere | Removed; sign-in method shown under its own name |
| Moderation playbook checklist | Invented policy, no endpoint | Tab now holds the verification review queue |
| Topbar notifications | No admin notification feed | Bell shows live work-waiting counts from moderation |
| Sidebar badge counts, "96% response SLA" | No source | Removed |

## Issues for the backend owner

1. **Moderation queue omits flags.** `GET /admin/moderation/queue` is documented as reports and flags merged, but returns only the 2 open reports while `GET /moderation/flags` lists 16 open flags. Queue health ("Open: 2") agrees with the queue, so flags are missing from both. The panel does not merge them client-side.
2. **OpenAPI has no response schemas or GET query parameters.** Every response `data` is typed `any`, and filters such as `status`, `tier`, `severity` are undocumented. Shapes in this panel were taken from live responses.
3. **`PATCH /admin/guardrails/{key}` declares `key` as a UUID**, but keys are strings like `admin.read_only`.
4. **Flagged count disagrees.** The snapshot reports "Flagged accounts: 1"; `GET /admin/users?flagged=true` returns nobody.
5. **Venue `status` label is misleading.** Reviewed venues (`is_reviewed: true`) are labelled "Pending review"; the label appears to track only `is_featured`. The panel shows the three booleans beside it.
6. **High-value members' `value` has no currency** and is not in minor units, unlike every other money field.
7. **No report detail endpoint.** The queue omits descriptions by design and says detail belongs on the case view, but there is no `GET /reports/{id}`. Descriptions are available only for High/Medium cases, via escalations.
8. **Brief vs API:** the 9 `/admin/roles/*` endpoints are not in the brief's tables (they back the Roles & rights tab); severity filters use `High`/`Medium`/`Low`, not lowercase; catalogue prices are USD, not GBP as the brief's examples assume.
9. **`/admin/me` returns no name or email**, so the profile chip shows the role only.

## Open items

- **Production is not access-protected.** Preview deployments sit behind Vercel Authentication, but the production domain is public (the panel shows nothing without an admin login). The team is on the Hobby plan; password protection of the production domain needs Pro.
- **Seed data.** About 30 `@kinvo.test` accounts skew the user list and analytics. Purge them before any demo.
