# 🎵 SingLoop — Mobile‑First SPA Task Outline (Concurrency & Shippable Increments)

## Product Frame
- **Form**: Mobile‑first Single Page Web App that feels like a native phone app (Duolingo‑style navigation, full‑screen touch UI, snappy transitions, offline‑first where feasible).
- **Theme**: Playful vocal journey. Not Duolingo’s brand, but similar progression loops, streaks, and micro‑celebrations—tailored to singing.
- **Delivery**: Work in small, parallelizable slices. Every 1–2 weeks yields a potentially shippable product increment.

## Operating Principles
- **Concurrency over phases**: Design streams run in parallel with engineering and content.
- **Vertical slices**: Ship end‑to‑end features that a real user can touch each increment.
- **Mobile‑first**: Touch targets, gesture nav, performance budgets, installable PWA feel.
- **Instrumentation**: Each slice includes analytics, basic QA, and performance checks.
- **Graceful degradation**: Audio features detect capability and fall back cleanly.

## Status Snapshot (Checked = done)
- **Increment 0 — App Shell**
  - [x] Routing, theming, layout primitives, navigation header
  - [x] Full‑screen mobile viewport meta
  - [x] PWA install prompt and service worker/offline landing
  - [x] Error boundary wired into app shell
  - [x] Web‑vitals/TTI telemetry
- **Increment 1 — First Playable Loop**
  - [x] Core UX: Home → Lesson → Echo → Result
  - [x] Audio: record up to 10s + playback
  - [x] Content: 1 mini‑lesson
  - [x] Progress: award points, mark lesson complete locally
  - [x] Show streak = 1 on first completion
  - [x] Observability: event funnel; manual test script
- **Increment 2 — Map + Streaks (early)**
  - [x] Map UI with progress states/unlock rules
  - [x] Points balance on header
  - [ ] Streak carryover and daily reminder toast
  - [ ] Audio latency improvements; waveform preview; cancel/retake
  - [ ] Localization scaffold (en base)
  - [x] Map interaction analytics

## Next Commitment — Finish Increment 1 (Streak v1)
- Implement minimal daily streaks (local‑first): update on lesson completion per day.
- Display streak chip in header and show “streak = 1” after first completion.
- Add analytics events: `streak_started`, `streak_incremented`.
- Update manual test script with streak scenarios.
- Out of scope: full PWA install, localization, pitch detection (tracked in later increments).

## Parallel Track — Curriculum Expansion (Beginner → Early Intermediate)
- Content: Convert lesson plan sections into Units 1–4 with progressive unlocks.
- UX: Type badges on lesson cards (Practice, Sound, Song, Echo).
- Audio: Reuse echo flow for beginner echo lessons; add new prompts.
- Progression: Strict prerequisite chain across units; points scale by performance where applicable.

Work Items (parallelizable)
- Unit authoring: Add Unit 2 (Breath & Dynamics) lessons.
- Unit authoring: Add Unit 3 (Pitch & Articulation) lessons.
- Unit authoring: Add Unit 4 (Echo & Performance) lessons.
- Map metadata: Titles/descriptions for Units 1–4.
- Visual polish: Echo badge on lesson cards.
- QA: Manual script updates for new units; unlock/complete loops.

## Increment 0 — Bootstrap the App Shell (1 week)
Goal: A usable, installable shell that feels like a phone app.
- Routing, theming, layout primitives, and navigation header/tab bar.
- Full‑screen mobile viewport, gesture transitions, haptics/sound stubs.
- PWA install prompt, offline landing, error boundary, loading skeletons.
- Telemetry: page views, TTI, web‑vitals.

Definition of Done
- Loads in <2s on mid‑range mobile; navigates without full reloads; installable PWA.

## Concurrency Streams
Run these streams continuously; each increment pulls a thin slice from each.
1) **Core UX**: navigation, session, animations, accessibility.
2) **Audio**: mic permission UX, recording, playback, pitch prototype.
3) **Content**: lesson JSON, copy, art direction, celebration assets.
4) **Progress & Rewards**: profile stub, local progress, streak logic.
5) **Observability & QA**: analytics, feature flags, smoke tests.

## Increment 1 — First Playable Loop: "Call‑and‑Echo" (1–2 weeks)
Goal: A learner can open the app, take one mini‑lesson, record a line, see feedback, earn points.
- Core UX: Home -> Lesson -> Echo screen -> Result -> Reward modal.
- Audio: Record up to 10s, playback, simple loud/quiet threshold; basic pitch presence.
- Content: 1 mini‑lesson (intro card, prompt, artwork, success copy).
- Progress & Rewards: award 10 points, mark lesson complete locally, show streak=1.
- Observability & QA: event funnel (open, start, record, complete), manual test script.

DoD
- Works on recent mobile Chrome/Safari/Firefox; no dead ends; can repeat loop.

## Increment 2 — Duolingo‑like Map and Streaks (1–2 weeks)
Goal: A tappable lesson map with 3 nodes and persistent streaks.
- Core UX: vertical lesson path with progress states and confetti micro‑celebrations.
- Audio: latency reduction; waveform preview; cancel/retake.
- Content: 3 themed lessons; localized copy scaffold (en base).
- Progress & Rewards: streak carryover, daily reminder toast, points balance on header.
- Observability & QA: retention cohort tags; map interaction analytics.

## Increment 3 — Basic Pitch Matching (1–2 weeks)
Goal: Visual “hit the note” meter with friendly hints.
- Audio: lightweight pitch detection (YIN/ACF‑style or autocorrelation), note binning.
- Core UX: live pitch bar; color feedback; pass threshold configurable via flag.
- Content: 3 pitch targets; short backing tones.
- Progress & Rewards: score per attempt; show best score; earn sticker on >= target.
- QA: audio capability checks; fallback to echo mode if unsupported.

## Increment 4 — Lesson Packs and Daily Quest (1–2 weeks)
Goal: Small pack (5 lessons), daily quest card, basic locker for stickers.
- Core UX: pack screen; quest card on home; sticker locker screen.
- Audio: noise gate; input device picker if multiple.
- Content: pack config JSON; sticker assets; quest copy.
- Progress & Rewards: quest completion grants unique sticker; locker grid.
- Observability: quest engagement, pack completion rate.

## Increment 5 — Social‑Lite and Offline (1–2 weeks)
Goal: Share a completion image; cache lessons for flaky networks.
- Core UX: generate share card image; share sheet; offline badge.
- Audio: record/play offline; defer upload.
- Content: lightweight share templates; offline‑friendly lesson payloads.
- Progress & Rewards: sync queue; conflict‑free local‑first strategy.
- QA: offline smoke tests; throttled network profiles.

## Cross‑Cutting Backlog (pull into increments as needed)
- Accessibility: screen reader labels, focus order, captions for prompts.
- Performance: code‑split routes, image lazy‑loading, audio worklet isolation.
- Theming: seasonal reskins, colorblind‑safe palettes, reduced‑motion mode.
- Monetization‑ready hooks: non‑blocking upsell surfaces behind flags.
- Security & Privacy: mic permission copy, local‑only by default, clear exports.

## Architecture Notes
- SPA with client‑side routing; PWA with service worker for shell caching.
- Shared design tokens; motion primitives; tactile sound/haptic cues.
- State: local‑first (IndexedDB/LocalStorage) with optional sync layer later.
- Audio: Web Audio API + MediaRecorder; feature detect; off‑main‑thread where possible.
- Analytics: event bus, debug overlay, privacy‑respecting opt‑out.

## Definition of Done (per slice)
- User‑touchable, demoable, and reversible behind a feature flag.
- Mobile performance budget met; core accessibility checks pass.
- Telemetry added; basic manual test checklist updated.

## Success Metrics
- D1 activation: complete first loop >= 60% of new users.
- 7‑day streak: >= 20% of activated users maintain a 3‑day streak.
- Median TTI on 4G: < 2.5s; interaction latency < 100ms on core flows.

## Working Practices
- Parallel work with weekly integration demo; trunk‑based with flags.
- Small PRs; visual diffs for UI; audio goldens for regression.
- Always ship something shippable.

