# Kooka Sing (Flutter)

A Duolingo-style singing learning app guided by Kooka the Kookaburra.

## Run

1. Install Flutter SDK (https://docs.flutter.dev/get-started/install).
2. From repo root:
```
flutter pub get
flutter run
```

## Project Structure

- lib/
  - main.dart – entry point, routing
  - theme/ – app theme
  - models/ – user.dart, lesson.dart, progress.dart
  - data/ – seed lesson data and units
  - pages/ – onboarding, skill tree, lesson view, practice, progress
  - widgets/ – reusable UI

## Roadmap

- Unit-based skill tree with prerequisite gating
- On-device audio recording and pitch feedback
- Offline-first progress storage
- Kooka mascot animations (Lottie/Rive)

The original web app is archived under archive/web/.

