# Kooka Sing - Flutter Plan (Duolingo-style)

## Phase 1: Scaffold & Core
- Create Flutter app (done)
- Theme (colors, spacing, typography) matching Kooka palette
- Routing shell (home, onboarding, skill tree, lesson, practice, progress)
- Models: UserProfile, Lesson, LessonProgress
- Seed data: units, lessons, prerequisites

## Phase 2: UX Flow
- Onboarding with Kooka (name, ageGroup)
- Skill tree UI with unit/lesson cards, lock/unlock states
- Linear progression (prerequisite gating)
- Progress: points, streaks, achievements

## Phase 3: Audio MVP
- Recording: start/stop, playback
- Basic pitch detection (match higher/lower/correct)
- Feedback messages and simple visuals

## Phase 4: Polish
- Kooka animations (Lottie/Rive) for moods
- Offline storage (Hive)
- Export/share progress

## Packages (to add later)
- State: flutter_riverpod
- Routing: go_router
- Audio: flutter_sound, just_audio
- Pitch: flutter_fft or pitch_detector_dart
- Storage: hive, hive_flutter
- Animations: lottie or rive

## Milestones
- M1: Skill tree working with unlocks (no audio)
- M2: Audio record + simple pitch feedback
- M3: Achievements + streaks + polish

Original web app archived at `archive/web/`.

