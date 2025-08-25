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

## Epic G: Kooka Experience & Polish
- Lottie/Rive mascot with moods: happy, excited, thinking, singing, cheering
- Micro-animations for unlocks and completions
- Accessibility: large tap targets, readable contrast

Acceptance criteria:
- Kooka appears on onboarding and guides the skill tree
- Micro-animations fire on unlock and completion

## Packages (planned)
- State: `flutter_riverpod`
- Routing: `go_router`
- Storage: `hive`, `hive_flutter`
- Audio: `flutter_sound`, `just_audio`
- Pitch: `flutter_fft` or `pitch_detector_dart`
- Animations: `lottie` or `rive`

## Milestones & Timeline (indicative)
- M1 (Week 1): Foundation (theme, models, seed data) + Skill tree display
- M2 (Week 2): Onboarding + persistence + gating logic
- M3 (Week 3): Lesson flow + completion + points/streaks
- M4 (Week 4): Audio MVP (record/play + simple pitch feedback)
- M5 (Week 5): Kooka animations + UX polish + accessibility

## Acceptance Demo Path
1) Fresh install → Onboarding → Skill tree shows Unit 1
2) Start first lesson → practice (no audio yet) → complete → points awarded
3) Next lesson unlocks → complete Unit 1 → Unit 2 unlocks
4) Record sample in practice → hear playback → basic pitch cue works

Original web app archived at `archive/web/`.

