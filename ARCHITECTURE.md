# Lexi — English learning assistant

Single-file HTML/CSS/JS app for spaced-repetition English vocabulary learning,
published as a private Claude Artifact. No build step, no framework, no backend
of its own. This doc exists so a future AI (or human) can pick up the codebase
without re-deriving the architecture from scratch.

Live URL: https://claude.ai/code/artifact/372321b7-4b2b-4109-b87d-f9f6a0fbcfd5
Source of truth: `app.html` (the published file *is* this file — republishing
means editing `app.html` and re-running the Artifact publish step, see
"Deploying changes" below).

## What this is, in one paragraph

`app.html` is one ~625 KB file containing `<style>`, then empty container
`<div>`s, then one big `<script>` with an embedded ~2500-word dictionary and
all app logic. There is no npm, no bundler, no React/Vue — plain DOM
manipulation via `innerHTML`. It is hosted by pasting it into the `Artifact`
tool, which wraps it in a minimal `<head>` (charset/viewport) and serves it
at a claude.ai URL. Editing the app means editing `app.html` directly and
republishing the same file path/URL.

## File layout

```
english-assistant/
  app.html            <- the entire app (THE file that gets published)
  ARCHITECTURE.md      <- this file
  data/
    batch1.json .. batch6.json   <- raw LLM-generated vocab batches (source material)
    words.final.json             <- deduped/renumbered merge of all batches
                                     (this JSON was injected into app.html's
                                     BASE_WORDS array — kept here for reference
                                     if you need to regenerate or audit words)
```

`data/*.json` are **not** loaded at runtime — they were a one-time build
input. The live word list lives only inside `app.html` as `BASE_WORDS`.

## Runtime architecture (inside app.html)

### 1. Data model

Each word is a flat object:
```js
{ id, word, pos, level, topic, ru, ipa, example_en, example_ru }
```
- `pos`: one of `n v adj adv prep pron conj det num interj phr`
- `level`: CEFR-ish `A1 A2 B1 B2 C1`
- `topic`: a free-text category key (`core`, `travel`, `phrasal-verb`, `custom`, ...) — labels for display live in `TOPIC_LABELS`
- `ru`: Russian translation(s), multiple senses joined by `; `
- ids are sequential integers assigned at merge time (not stable across regenerations)

`BASE_WORDS` = the embedded 2544-word dictionary (hardcoded array, search for
`/*WORDS_START*/` / `/*WORDS_END*/` markers in the script to find/replace it).
`CUSTOM_WORDS` = words the user imported at runtime via Settings → "Импорт
своей колоды" (CSV/TSV upload), persisted in `localStorage` under
`ea.customWords.v1`.

`WORDS = BASE_WORDS.concat(CUSTOM_WORDS)` is the array actually used
everywhere. `WORDS_BY_ID` and `TOPICS_PRESENT` are derived indexes rebuilt by
`rebuildWordIndex()` whenever `CUSTOM_WORDS` changes.

**Known gap:** the dictionary is 2544 words, not the originally-targeted
3000 — six parallel generation batches of 500 words each overlapped by ~450
words (common vocabulary like "important" showed up in multiple topic
batches) and were deduped by lowercase word match, keeping the first
occurrence. This was a deliberate stop, not a bug — the user asked to stop
topping it up. If you want to reach 3000, add more words via the Settings
import feature, or generate another batch of unique words and merge it into
`BASE_WORDS` (a merge script pattern is described in "Adding more words"
below).

### 2. Persistence (`Store` object)

Two storage layers:

**Primary — `localStorage`** (always available, synchronous, per-browser):
- `ea.progress.v1` — map of `wordId -> SRS progress object` (see below)
- `ea.stats.v1` — `{ days: { 'YYYY-MM-DD': {reviews,correct,wrong,newWords} } }`
- `ea.settings.v1` — `{ dailyNewLimit, levels, topics, ttsRate }`
- `ea.starred.v1` — array of starred word ids
- `ea.customWords.v1` — array of imported word objects (see Data model)

**Secondary — Claude Artifact `db` capability** (optional, cloud, best-effort):
Only works when the page runs inside the Claude Artifacts runtime (i.e. the
published URL, not a raw local file). `initSync()` on load calls
`window.claude.use('db')`; if available, it pulls a snapshot doc
(`backup/progress`) and — **only if localStorage is empty** (first run on a
new device) — hydrates local state from it. Every subsequent progress change
calls `queueSync()`, which debounces 2.5s then pushes the *entire* progress
map + stats + starred list as one JSON-stringified blob into that single
`db` document (`doc.set(...)`, full overwrite, last-writer-wins — no merge
logic, no conflict resolution). This is a deliberately simple "poor man's
sync", not a real multi-device CRDT — if you use two devices at once you can
clobber each other's recent progress.

If `db` is unavailable (`window.claude` missing, or `use('db')` resolves
`null`), the app silently runs localStorage-only — check `syncState` /
`dbNs` in the code, and the sidebar/settings "sync pill" reflects this to
the user (`Локально` vs `Синхронизировано`).

**`downloads` capability** (optional): used only by "Скачать" backup button
in Settings (`exportBackup()`). If unavailable, the button shows a toast and
does nothing — there is deliberately no `<a download>` fallback, because the
Claude Artifact viewer sandbox blocks script-driven downloads outright (see
comments in `exportBackup`).

Manual backup files: `exportBackup()` / `importBackup()` round-trip a plain
JSON `{progress, stats, starred, settings}` blob through the `downloads`
capability and a `<input type=file>` + `FileReader`, respectively — this
works regardless of the `db` capability and is the reliable way to move
progress between browsers/devices by hand.

### 3. SRS (spaced repetition) engine

Pure function `reviewWord(prog, grade)` in the script — takes the existing
progress object (or `null` for a brand-new word) and a grade
(`'again' | 'hard' | 'good' | 'easy'`), returns a **new** progress object
(does not mutate the input, so it's safe to call twice for UI previews).

Model: SM-2-derived with a short "learning" phase before graduating to
day-scale spaced review.
- New word → `stage: 'learning'`, two learning steps at `LEARN_STEPS_MIN = [1, 10]` minutes.
- `'again'` at any stage resets to learning step 0, increments `lapses`, drops `ef` by 0.2 (floor 1.3), reschedules ~1 minute out — this reinserts the card into the *current session* (see `gradeCard()` splicing it back into `state.sessionQueue`).
- Passing both learning steps graduates to `stage: 'review'` with `ivl` (interval, in days) = 1 (hard/good) or 4 (easy).
- In `'review'` stage: `hard` → `ivl *= 1.2`, ef -0.15; `good` → `ivl *= ef`; `easy` → `ivl *= ef*1.3`, ef +0.15. `ef` floor is 1.3.
- `statusOf(id)`: `new` (no progress) / `learning` / `review` / `mastered` (`ivl >= 21` days).

Progress object shape: `{ ef, ivl, reps, stage, step, due, last, correct, wrong, lapses }` (`due` and `last` are epoch ms).

### 4. Views / routing

Hash-based, no router library. `route()` reads `location.hash`
(`currentViewId()` / `currentViewArg()`, e.g. `#practice/mc` → view=`practice`,
arg=`mc`) and calls the matching `render*(el)` function, replacing
`#view`'s `innerHTML` wholesale each navigation. `renderShell()` redraws the
sidebar/tabbar nav (with due-count badge) on every route change.

Views: `home`, `session` (flashcards — arg selects `mixed|review|learn`
queue), `bank` (searchable/filterable word table + modal detail), `practice`
(mode picker + 5 exercise types), `stats`, `settings`.

State lives in one plain object, `state = {...}` (session queue/position,
bank filters/pagination, practice pool/score, etc.) — not reactive, every
mutation is followed by an explicit `route()` or targeted DOM update call.

**Practice modes** (`PRACTICE_MODES`, dispatched in `renderPracticeItem`):
`mc` (multiple choice on translation), `type-en` (type the English word from
its translation), `fill` (fill the blank in the example sentence), `listen`
(dictation via TTS), `speak` (pronunciation via `SpeechRecognition`, feature-
detected, hidden if unsupported). None of these touch the SRS engine — they
only bump daily stats (`Store.bumpDay`) for streak/accuracy tracking. Only
the `session` flow (Learn/Review) calls `reviewWord()`.

### 5. UI / theming

CSS custom properties define the full light palette on bare `:root`, redefined under
`@media (prefers-color-scheme: dark)` (guarded `:root:not([data-theme="light"])`)
and again under `:root[data-theme="dark"]` — this is required by the Claude
Artifact platform's theming contract (the page has no `<html>`/`<head>` of its
own; the platform stamps `data-theme` on the real root element). Fonts:
Fraunces (display/serif), Manrope (body/UI), IBM Plex Mono (numbers/IPA) —
loaded from Google Fonts via a `<link>` at the top of the file.

No icon library — all icons are small hand-written inline SVGs in the
`ICONS` object.

## Adding more words

1. Generate/collect new entries matching the schema in "Data model" above.
2. Easiest for a user: Settings → "Импорт своей колоды" — upload a `.csv`/`.tsv`/`.txt`
   file, columns in order `word, ru, example_en, example_ru, ipa, pos, level`
   (only the first two are required; delimiter auto-detected as tab/semicolon/comma;
   HTML tags are stripped so raw Anki exports work). Parsed by `parseImportText()`,
   stored in `CUSTOM_WORDS`/`localStorage`, tagged `topic: 'custom'`, ids continue
   from `max(existing id) + 1`. Case-insensitive de-dupe against existing words.
3. To bake more words into the shipped `BASE_WORDS` (rather than relying on
   per-user import), edit the JSON array between the `/*WORDS_START*/` and
   `/*WORDS_END*/` comment markers in `app.html` directly, or reproduce the
   original build: generate batches → merge/dedupe/renumber with a small
   Node script → `JSON.stringify` the result in place of `BASE_WORDS`'s value.
   Keep ids sequential starting at 1 if you regenerate from scratch (existing
   users' `localStorage` progress is keyed by id, so **renumbering ids after
   users have real progress will silently detach their progress from the
   wrong words** — only safe to renumber before this app has real usage, or
   when appending new ids after the current max).

## Deploying changes

This is not a git repo / CI pipeline — "deploying" = calling the `Artifact`
tool again with `file_path: app.html` and `url:` set to the existing artifact
URL above, so it republishes in place rather than creating a new one. Any
edit to `app.html` needs a republish to reach the live URL. Capabilities
(`db`, `downloads`) persist across republishes if the `capabilities` param is
omitted; pass `{}` explicitly to clear them.

## Known limitations / things a future change might want to address

- 2544 words, not the original 3000 target (see "Data model" above for why).
- Cloud sync is last-writer-wins on a single JSON blob — no real conflict
  resolution; using the app simultaneously on two devices can lose progress
  from whichever device wrote second-to-last.
- No automated tests. Verification so far has been manual browser testing
  (local `python -m http.server` with a UTF-8 `Content-Type` override, since
  Cyrillic text mis-renders without an explicit charset when served without
  the Claude Artifact platform's own `<head>`).
- `SpeechRecognition` (pronunciation practice mode) is Chrome/Chromium-only;
  the UI feature-detects and hides the mode gracefully elsewhere, but there's
  no alternative pronunciation-check method for other browsers.
- IPA transcriptions and Russian translations are LLM-generated, not sourced
  from a verified dictionary — spot-check before treating them as
  authoritative for anything beyond casual learning.
