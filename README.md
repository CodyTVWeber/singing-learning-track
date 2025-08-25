# Kooka Sing (Flutter)

A beautiful, Duolingo-style singing learning app guided by Kooka the Kookaburra. Designed for all ages with a delightful Kookaburra bird theme.

**100% On-Device**: All features run locally on your device. No servers, no internet required after download!

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

## Features

- 🎵 **Progressive Learning Path**: Unit-based skill tree with prerequisite gating
- 🎤 **Audio Practice**: On-device audio recording and pitch feedback (coming in v0.4.0)
- 💾 **Local Storage**: All progress saved locally using Hive - your data stays on your device
- 🦜 **Kooka Mascot**: Friendly Kookaburra guide with beautiful illustrations
- 🌟 **Gamification**: Points, streaks, and achievements to keep learners motivated
- 👨‍👩‍👧‍👦 **All Ages**: Adaptive content for kids, teens, and adults

## Technical Highlights

- **Privacy First**: No user data leaves your device
- **Offline Ready**: Works without internet connection
- **Fast & Responsive**: Native Flutter performance
- **Beautiful UI**: Kookaburra-themed design with nature-inspired colors

The original web app is archived under archive/web/.

