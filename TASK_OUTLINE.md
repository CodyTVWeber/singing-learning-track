# Kooka Sing - Detailed Flutter Plan (Duolingo-style)

## Epic A: Foundation & Architecture
- App scaffold (done): Flutter multi-platform, Material 3
- Theme system: colors, spacing, typography in `lib/theme/app_theme.dart`
- Models: `UserProfile`, `Lesson`, `LessonProgress`
- Data: seed units/lessons/prerequisites in `lib/data/units.dart`
- Navigation: simple routes; later migrate to `go_router`

Acceptance criteria:
- App compiles on macOS and Android/iOS once SDKs are configured
- Sample lessons load and display in skill tree

## Epic B: Onboarding & User State
- Onboarding page: name, age group, quick tutorial
- Local persistence: save user profile and progress (Hive)
- Kooka guidance: friendly messages based on progress

Acceptance criteria:
- First run shows onboarding; subsequent runs bypass
- User profile persists across app restarts

## Epic C: Skill Tree & Progression
- Unit cards with title/description and completion state
- Lesson nodes with locked/unlocked/completed states
- Prerequisite gating across units and lessons
- Points, streak, achievements scaffolding

Acceptance criteria:
- Completing lesson X unlocks lesson X+1 within a unit
- Completing all lessons in unit N unlocks unit N+1
- Progress reflects completed lessons, points increment

## Epic D: Lesson Flow
- Lesson intro -> activity -> record/practice -> completion
- Reusable lesson widgets for text prompts, tips, and UI
- Completion screen with points and next-step CTA

Acceptance criteria:
- A demo lesson can be started, practiced, and completed
- On completion, user earns points and the next lesson unlocks

## Epic E: Audio MVP
- Recording (flutter_sound)
- Playback (just_audio)
- Simple pitch cue (higher/lower/correct) via `flutter_fft` or `pitch_detector_dart`

Acceptance criteria:
- User can record and play back
- App provides a basic “match higher/lower/correct” prompt in one lesson

## Epic F: Persistence & Analytics
- Hive boxes: user, progress, achievements
- Simple logging of lesson starts/completions

Acceptance criteria:
- All progress persists locally and is restored on launch

## Epic G: Kooka Experience & Polish (Later Iteration)
- Defer Lottie/Rive animations to future sprints (placeholder static visuals now)
- Focus now: accessibility (tap targets, contrast), copy, and responsiveness

Acceptance criteria (current):
- No runtime dependency on animation packages
- All flows usable without animations

## Packages (planned)
- State: `flutter_riverpod`
- Routing: `go_router`
- Storage: `hive`, `hive_flutter`
- Audio: `flutter_sound`, `just_audio`
- Pitch: `flutter_fft` or `pitch_detector_dart`
- Animations: `lottie` or `rive`

## Milestones & Timeline (shippable increments)
- M1 (Ship 0.1.0): Foundation + Skill tree read-only (no audio) – shippable
- M2 (Ship 0.2.0): Onboarding + persistence + gating – shippable
- M3 (Ship 0.3.0): Lesson flow + completion + points/streaks – shippable
- M4 (Ship 0.4.0): Audio MVP (record/play + basic pitch cue) – shippable
- M5 (Ship 0.5.0+): Accessibility polish, copy, later add animations

## Parallel Workstreams (can run concurrently)
- WS1: Data & Models
  - Owner: Platform-agnostic dev
  - Contract: `Lesson`, `UserProfile`, `LessonProgress` shapes are stable

- WS2: Skill Tree UI
  - Owner: Flutter UI dev
  - Contract: consumes `getAllUnits()` and `isLessonUnlocked()` only

- WS3: Onboarding & Persistence
  - Owner: State/storage dev
  - Contract: exposes `getUser()`, `saveUser()`, `getProgress()`, `saveProgress()`

- WS4: Lesson Flow
  - Owner: UX/logic dev
  - Contract: given a `Lesson`, can run view/practice/complete and emit `LessonProgress`

- WS5: Audio MVP
  - Owner: Audio dev
  - Contract: provides `record()`, `stop()`, `play()`, `analyzePitch()` abstractions

- WS6: QA & Release
  - Owner: QA/Release engineer
  - Contract: semantic versioning, build pipelines, release notes

Each workstream adheres to contracts; designs are stable to avoid conflicts.

## Acceptance Demo Path
1) Fresh install → Onboarding → Skill tree shows Unit 1
2) Start first lesson → practice (no audio yet) → complete → points awarded
3) Next lesson unlocks → complete Unit 1 → Unit 2 unlocks
4) Record sample in practice → hear playback → basic pitch cue works

Original web app archived at `archive/web/`.

