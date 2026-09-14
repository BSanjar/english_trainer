# Lexi — English learning backend + app

ASP.NET Core 8 Web API + EF Core (Npgsql) + Postgres 16, serving a static
vanilla-JS frontend from `wwwroot`. Single Docker image, same shape as the
user's other project (`secore/01 WebApplication1`): build → Docker Hub →
SSH-deploy onto a VPS where the app container joins a shared Docker network
to reach `app_postgres`.

This supersedes the original version of Lexi, which was a single static
`index.html` published as a Claude Artifact with `localStorage`-only
progress and no accounts. That file's design (SM-2 grading, card layout,
dark/light palette) is the direct ancestor of what's here — see git history
(`Initial version of Lexi`) if you need to compare.

## Stack & layout

```
Lexi.csproj, Program.cs        <- entry point, DI wiring, migration+seed on startup
Data/
  LexiDbContext.cs
  Migrations/                   <- EF Core code-first migrations
data/words.final.json           <- seed source (2544 words), copied to output dir
Models/                         <- AdminUser, OneTimeCode, Client, Word,
                                    ClientWordProgress, ClientStar, DailyBlockActivity
Services/
  SrsService.cs                 <- grading logic (server-authoritative)
  Seeder.cs                     <- one-time word + admin seeding
Middleware/ClientAuthMiddleware.cs   <- Bearer device-token -> HttpContext.Items["Client"]
Controllers/                    <- Auth, Admin, Client, Words, Session, Stats
wwwroot/
  index.html, app.js, styles.css      <- client app (onboarding, home, sessions, bank, stats, settings)
  admin.html, admin.js                <- admin code-generation screen
Dockerfile, docker-compose.local.yml, docker/init-lexi-db.sh
```

No frontend build step — `app.js`/`admin.js` are plain scripts, edit and
refresh. No client-side framework.

## Auth model

Two completely separate schemes, both in the same app:

- **Admin** — a single seeded row in `admin_users` (username/password via
  `BCrypt`, seeded from `Admin:Username`/`Admin:Password` config or
  `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars on first run — see
  `Services/Seeder.cs`). Logs in at `/admin.html` → `POST /api/admin/login`
  → ASP.NET cookie auth (`AddCookie("AdminCookie")`, 30-day sliding
  expiry). `POST /api/admin/codes` mints a 6-digit single-use code, 30 min
  expiry, stored in `one_time_codes`.
- **Client** — no password at all. First visit: no `lexi_device_token` in
  `localStorage` → code-entry screen → `POST /api/auth/redeem` validates
  the code (unused, unexpired), creates a `clients` row with a fresh random
  `DeviceToken` (guid), marks the code used, returns the token. The
  frontend stores it and sends `Authorization: Bearer <token>` on every API
  call afterward; `Middleware/ClientAuthMiddleware.cs` resolves that header
  to a `Client` row on every request (no ASP.NET auth scheme involved —
  it's a plain lookup, see the middleware for why: simpler than a custom
  `AuthenticationHandler` for a single header-shaped credential). "Same
  device" is therefore "same browser profile with that `localStorage`
  entry intact" — clearing site data or switching browsers means entering
  a new code.

First login with `client.Level == null` shows a one-time level picker
(`PUT /api/client/level`) before anything else loads.

## Data model

- `words` — the static dictionary (2544 rows, seeded once from
  `data/words.final.json` when the table is empty; re-seeding is a
  deliberate manual step, not automatic on every boot).
- `client_word_progress` — per-client SRS state per word (`Ef`, `Ivl`,
  `Reps`, `Stage`, `Due`, `Last`, `Correct`, `Wrong`). `SrsService.StatusOf`
  derives `new` / `review` / `mastered` (`Ivl >= 21` days) from this — there
  is no separate `learning` stage anymore (see grading below).
- `client_daily_block_activity` — one row per `(client, date, block)`,
  `CompletedCount`/`TargetCount`/`LastWordId`. This is what drives the six
  per-block progress bars and the overall daily bar on the "Занятие на
  сегодня" screen, and what the month/streak stats aggregate over.
- `client_word_stars`, `one_time_codes`, `admin_users`, `clients` — as the
  names say.

**Materials are filtered by exact level match** (`client.Level == word.Level`),
not cumulative (a B1 client does not see A1/A2 words). This was a
deliberate simplification, flagged as easy to change — see
`WordsController.GetWords` / `SessionController.GetQueue`, both take
`client.Level` as a hard equality filter.

**Daily goal is one number per client** (`Client.DailyGoal`, default 20),
applied uniformly as the `TargetCount` for all six blocks — there's no
per-block target setting. Changeable via `PUT /api/client/goal` (Settings
page slider).

## Grading (SRS) — the swipe redesign

`Services/SrsService.cs` is the *only* place grading math happens; the
client-side `previewIvl()` in `app.js` is a rough approximation used purely
to label the Hard/Good buttons before the server call resolves — never
treat it as authoritative.

Exactly three outcomes, no "again"/forgot path at all (by product decision —
see the commit that introduced this):
- **Swipe the card, either direction** (pointer drag past ~90px, see
  `attachSwipeHandlers` in `app.js`) → graded `easy`, translation never
  shown. New word: `Ivl = 4`. Existing: `Ivl = round(Ivl * Ef * 1.3)`, `Ef += 0.15`.
- **Tap the card** → flips to reveal translation + example, then two
  buttons only: **Трудно** (`hard`) and **Запомнил** (`good`).
  - `hard`: new word `Ivl = 1`; existing `Ivl = round(Ivl * 1.2)`, `Ef -= 0.15` (floor 1.3).
  - `good`: new word `Ivl = 2`; existing `Ivl = round(Ivl * Ef)`.
- Every grade is forward-progressing — nothing ever resets `Reps` or sends a
  word back into a short-interval relearning loop. `POST /api/session/review`
  is the only endpoint that touches `client_word_progress`; it also bumps
  the `learn` block's daily activity row.

The other five blocks (`mc`, `type_en`, `fill`, `listen`, `speak`) are
plain drilling — pool built client-side from already-fetched `state.words`
(prefer non-`new` words), correctness computed client-side exactly like the
original Artifact version did (`normalizeAnswer`, `mcOptions`,
`SpeechRecognition` for pronunciation). They do **not** touch
`client_word_progress`; each answered item just calls
`POST /api/session/progress {block, wordId}` to bump that block's daily
counter. Repeating a finished block is unlimited (`buildPracticePool()`
reshuffles a fresh 20-word pool on "Ещё раунд").

## Local development

`docker-compose.local.yml` runs `app_postgres` (postgres:16-alpine) with
`docker/init-lexi-db.sh` creating the `lexi_english` database and
`lexi_user` role (full rights on `public`) under a superuser named
`appuser`, matching the VPS convention described by the user. Copy
`appsettings.Development.json.example` → `appsettings.Development.json`
(gitignored) and fill in real local values before running `dotnet run` or
`dotnet ef database update`.

**Port note (read this before reusing 5432/5433 locally):** this dev
machine already has a native PostgreSQL service bound to `0.0.0.0:5432`
(unrelated to this project). It also has (at least on this machine, set up
outside this project) an `ssh.exe` tunnel bound to `127.0.0.1:5433` that
reaches the **real production `app_postgres` on the server** — that's the
one this project actually seeded and migrated (see "Production database"
above). Both of these silently intercept "localhost" connections ahead of
a Docker Desktop port mapping on the same number, which looks like a
wrong-password error, not a port-conflict error, and wastes time
double-checking credentials that were already correct. `docker-compose.local.yml`
therefore exposes its disposable local Postgres on **5544**, deliberately
clear of both. If you're on a machine with that same SSH tunnel available,
pointing `appsettings.Development.json` at `Host=127.0.0.1;Port=5433;...`
talks to the real server data directly — convenient, but treat it with the
same care as prod (it *is* prod). If you don't have that tunnel, use the
5544 fallback instead and expect an empty database until you seed it.

Migrations: `dotnet ef migrations add <Name> -o Data/Migrations`, apply
with `dotnet ef database update` (needs `dotnet tool install --global
dotnet-ef` once). Both commands need `ASPNETCORE_ENVIRONMENT=Development`
set so they pick up `appsettings.Development.json`.

## Deploying

`.github/workflows/deploy.yml` triggers on push to `test`/`prod`. It does
**not** use a registry (no Docker Hub push) — it builds once on the runner
as a compile sanity-check, then SSHes into the server, `git pull`s this
repo in `/root/english_trainer`, and does the real `docker build` +
`docker run` there directly. This mirrors the simpler of the user's two
existing patterns (their `secore` repo root workflow), not the
registry-based one in `secore/01 WebApplication1`. The deploy script also
creates/joins a project-specific network (`english_trainer_net`) and
attaches the shared `app_postgres` container to it, since — unlike
whatever the `secore` root app does — this app needs to actually reach
Postgres by hostname.

External port is **8086** → container's internal 80. Required GitHub repo
secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY` (SSH deploy target,
same as `secore`), `DB_CONNECTION_STRING` (full Npgsql string, e.g.
`Host=app_postgres;Port=5432;Database=lexi_english;Username=lexi_user;Password=lexi_user`),
`ADMIN_USERNAME`, `ADMIN_PASSWORD` (seeds the one admin row on first boot
against a fresh database — irrelevant once `admin_users` already has a
row, since seeding is a one-time "if empty" check). None of these are
committed; `appsettings.json` ships with an empty connection string on
purpose.

The server must have this repo cloned once at `/root/english_trainer`
(`git clone` before the first deploy) — the workflow only `git pull`s, it
doesn't clone.

## Production database

Per explicit instruction, this project uses the **real, shared
`app_postgres` on the server** as its actual database — not a disposable
local container. As of this write-up its `lexi_english` schema (8 tables)
and the 2544-word seed were already applied by running this app once with
its connection string pointed at that server (over an SSH tunnel from a
dev machine; see below). A stray `newtable` that pre-existed there (not
created by this project) was dropped.

`docker-compose.local.yml` + `docker/init-lexi-db.sh` still exist as a
**fully disposable fallback** for anyone who wants an isolated local
Postgres (e.g. to test a schema change before touching the shared
database) — see the port note below for why it defaults to 5544. They are
not the source of truth and don't need to be kept in sync with the real
server beyond "same migrations apply cleanly to both."

## Verification performed

Full manual walkthrough against the local Postgres (port 5544), both via
`curl` and in a real browser tab: admin login → generate code → client
redeem (and confirmed a second redeem of the same code correctly rejects)
→ level picker → `GET /api/words` returns only that level → swipe-graded a
card via synthetic pointer events end-to-end (confirmed `Ivl = 4` "easy"
result actually landed in Postgres) → tap-graded a card via "Запомнил" →
block picker progress bars updated → word bank search/status filters →
month stats/streak/heatmap → settings level switch and daily-goal slider.
Migrations and seeding were then separately confirmed against the real
server `app_postgres` (via the SSH tunnel above): schema matched, stray
`newtable` dropped, 2544 words + the admin row seeded successfully.
No automated test suite exists yet, and the full app flow (not just DB
connectivity) has not yet been exercised against the deployed container
on the VPS itself.
