# Kooka Sing – ROO Code Boomerang Tasks (Flutter)

This outline follows ROO (Requirements → Output → Outcome) and is structured for autonomous, concurrent execution by multiple agents with stable contracts and shippable increments.

## Global
- Repo: root Flutter project; archived web app under `archive/web/`
- Platforms: macOS (dev), iOS/Android (after SDKs installed), Web (later)
- Tooling: Flutter stable, Dart, `flutter_lints`

## Milestones (Shippable Increments)
- 0.1.0 (M1): Foundation + Skill tree read-only (no audio)
- 0.2.0 (M2): Onboarding + persistence + gating
- 0.3.0 (M3): Lesson flow + completion + points/streaks
- 0.4.0 (M4): Audio MVP (record/play + basic pitch cue)
- 0.5.0+ (M5): Accessibility polish and copy; animations deferred

---

## Workstream WS1: Data & Models (Concurrent)
ID: WS1-A
- Requirements: Define core types and sample data
- Output: `lib/models/{lesson.dart,user.dart,progress.dart}`, `lib/data/units.dart`
- Outcome: Other streams consume stable APIs for lessons and progress
- Contracts:
  - Types
    - `class Lesson { String id; int level; String title; String type; String content; String description; String? imageUrl; bool unlocked; String? prerequisite; int unit; int position; }`
    - `class UserProfile { String id; String name; String ageGroup; int currentLevel; int totalPoints; int streak; }`
    - `class LessonProgress { String userId; String lessonId; bool completed; int score; DateTime completedDate; }`
  - Functions
    - `List<Lesson> getLessonsByUnit(int unit)`
    - `Lesson? getLessonById(String id)`
    - `bool isLessonUnlocked(String id, List<String> completed)`
- Acceptance: Types compile; `sampleLessons` renders in skill tree

## Workstream WS2: Skill Tree UI (Concurrent)
ID: WS2-A
- Requirements: Display units/lessons, lock/unlock states
- Output: `lib/pages/skill_tree_page.dart`
- Outcome: Users see current path and what unlocks next
- Consumes: WS1 functions only; no user state required yet (placeholder completed = [])
- Acceptance: Unit and lesson cards render; locked vs unlocked vs completed styles

## Workstream WS3: Onboarding & Persistence (Concurrent)
ID: WS3-A
- Requirements: Onboarding (name, age), local storage via Hive
- Output: `lib/pages/onboarding_page.dart`, `lib/storage/{user_store.dart,progress_store.dart}`
- Outcome: Returning users skip onboarding; state persists
- Contracts exposed:
  - `Future<UserProfile?> getUser()`
  - `Future<void> saveUser(UserProfile user)`
  - `Future<List<LessonProgress>> getProgress(String userId)`
  - `Future<void> saveProgress(LessonProgress p)`
- Acceptance: Restart app → user and progress restored; gating uses persisted completions

## Workstream WS4: Lesson Flow (Concurrent)
ID: WS4-A
- Requirements: Intro → practice → completion; unlock next lesson
- Output: `lib/pages/lesson_page.dart`, reusable lesson widgets
- Outcome: Completing a lesson updates points/streak and unlocks next
- Consumes: WS1 types, WS3 stores
- Emits: `LessonProgress`
- Acceptance: Completing `breath-basics` unlocks `voice-discovery`; points increase

## Workstream WS5: Audio MVP (Concurrent)
ID: WS5-A
- Requirements: Record/stop/play; basic pitch cue
- Output: `lib/audio/{recorder.dart,player.dart,pitch.dart}` (adapters)
- Outcome: Practice can record, playback, suggest higher/lower/correct
- Contracts:
  - `Future<void> startRecording()` / `Future<String> stopRecording()`
  - `Future<void> play(String path)` / `Future<void> stop()`
  - `Stream<double> pitchHz()` (or `Future<PitchHint> analyze(sample)`) 
- Acceptance: One lesson integrates recording and shows a simple pitch hint

## Workstream WS6: QA & Release (Concurrent)
ID: WS6-A
- Requirements: Versioning, CI (later), manual QA scripts
- Output: Changelogs, tagged releases; smoke-test checklist
- Outcome: Each milestone is shippable with notes
- Acceptance: Tag created; build successful on macOS; checklist passed

---

## ROO Snapshot per Milestone

M1 (0.1.0)
- Requirements: Foundation, theme, models, skill tree read-only
- Output: Compiling app, skill tree rendering from sample data
- Outcome: Users can browse the plan; no onboarding, no audio
Acceptance: `flutter run -d macos` succeeds; basic navigation works

M2 (0.2.0)
- Requirements: Onboarding, Hive persistence, gating
- Output: Onboarding UI, Hive boxes, gating wired to stored progress
- Outcome: Users start a profile, progress persists, locks behave correctly
Acceptance: Restart retains user; unlocking logic reflects stored completions

M3 (0.3.0)
- Requirements: Lesson flow, completion, points/streaks
- Output: Lesson page(s), completion screen, user stats update
- Outcome: Users can complete lessons end-to-end
Acceptance: Completing a lesson increments points; next lesson unlocks

M4 (0.4.0)
- Requirements: Audio MVP (record/play, pitch cue)
- Output: Audio adapters and a practice step using them
- Outcome: Users can record and get basic pitch guidance
Acceptance: Record/play works; pitch hint appears in at least one lesson

M5 (0.5.0+)
- Requirements: Accessibility, copy polish; animations later
- Output: Improved readability, larger tap targets; no Lottie/Rive yet
- Outcome: Usable and quality experience without animations
Acceptance: Manual a11y checklist passes; no animation deps

---

## Autonomy Execution Protocol
- Branching: `feat/wsX-*`, `fix/*`, `docs/*`; PRs merge to `main`
- Commits: Conventional (`feat:`, `fix:`, `docs:`)
- Lint: `flutter analyze` must pass; format with `dart format .`
- Build: `flutter run -d macos` during dev; mobile when SDKs ready
- Testing: Add widget/unit tests as features stabilize

## Risks & Mitigations
- Mobile SDKs not installed → target macOS first; add CI jobs later
- Audio plugin differences per platform → abstract with adapters in WS5
- Scope creep (animations) → explicitly deferred to M5+

## Acceptance Demo Path
1) Fresh install → Onboarding (M2+) → Skill tree shows Unit 1
2) Start first lesson → practice (M3) → complete → points awarded
3) Next lesson unlocks via gating (M2) → unit completion visible in tree
4) Practice uses audio record/play + pitch cue (M4)

Original web app archived at `archive/web/`.

