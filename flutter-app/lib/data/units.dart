import '../models/lesson.dart';

final List<Lesson> sampleLessons = [
  Lesson(
    id: 'breath-basics',
    level: 1,
    unit: 1,
    position: 1,
    title: '🎈 Belly Breathing',
    type: 'practice',
    description: 'Blow up your belly!',
    content: '{"steps": ["Watch Kooka breathe", "Touch belly", "Breathe in = Big belly", "Breathe out = Small belly"], "visual": "kooka-belly-animation", "audio": "breath-guide"}',
    imageUrl: 'kooka-breathing',
    unlocked: true,
    prerequisite: null,
  ),
  Lesson(
    id: 'voice-discovery',
    level: 1,
    unit: 1,
    position: 2,
    title: '🎵 High & Low',
    type: 'sound',
    description: 'Copy the sounds!',
    content: '{"steps": ["Listen to baby bird 🐣", "Listen to papa bird 🦅", "Copy each sound", "Find YOUR voice"], "visual": "bird-family", "audio": "pitch-examples"}',
    imageUrl: 'kooka-voice-range',
    unlocked: false,
    prerequisite: 'breath-basics',
  ),
  Lesson(
    id: 'kooka-laugh',
    level: 1,
    unit: 1,
    position: 3,
    title: '😄 Kooka Laugh Song',
    type: 'song',
    description: 'Sing along!',
    content: '{"steps": ["Watch Kooka sing", "Tap the rhythm 👏", "Copy the laugh", "Sing together!"], "visual": "kooka-song-video", "audio": "kookaburra-song"}',
    imageUrl: 'kooka-singing',
    unlocked: false,
    prerequisite: 'voice-discovery',
  ),
  Lesson(
    id: 'rhythm-clap',
    level: 1,
    unit: 1,
    position: 4,
    title: '👏 Clap the Beat',
    type: 'practice',
    description: 'Follow the rhythm!',
    content: '{"steps": ["Watch hands clap 👏", "Copy the pattern", "Slow... then fast!", "Make your own beat"], "visual": "clapping-animation", "audio": "rhythm-patterns"}',
    imageUrl: 'rhythm-practice',
    unlocked: false,
    prerequisite: 'kooka-laugh',
  ),
  Lesson(
    id: 'animal-sounds',
    level: 1,
    unit: 1,
    position: 5,
    title: '🐱 Animal Voices',
    type: 'sound',
    description: 'Be the animals!',
    content: '{"steps": ["Cat goes MEOW (high)", "Dog goes WOOF (middle)", "Cow goes MOO (low)", "Mix them up!"], "visual": "animal-parade", "audio": "animal-sounds"}',
    imageUrl: 'animal-voices',
    unlocked: false,
    prerequisite: 'rhythm-clap',
  ),
  Lesson(
    id: 'echo-game',
    level: 1,
    unit: 1,
    position: 6,
    title: '🔊 Echo Echo',
    type: 'practice',
    description: 'Copy me!',
    content: '{"steps": ["Listen carefully", "Wait... wait...", "Now copy!", "Perfect match?"], "visual": "echo-visualization", "audio": "echo-patterns"}',
    imageUrl: 'echo-practice',
    unlocked: false,
    prerequisite: 'animal-sounds',
  ),
];

List<Lesson> getLessonsByUnit(int unit) {
  return sampleLessons
      .where((l) => l.unit == unit)
      .toList()
    ..sort((a, b) => a.position.compareTo(b.position));
}

Lesson? getLessonById(String id) {
  return sampleLessons.where((l) => l.id == id).cast<Lesson?>().firstWhere(
        (e) => e != null,
        orElse: () => null,
      );
}

bool isLessonUnlocked(String id, List<String> completed) {
  final lesson = getLessonById(id);
  if (lesson == null) return false;
  if (lesson.unlocked) return true;
  if (lesson.prerequisite == null) return true;
  return completed.contains(lesson.prerequisite);
}

class UnitInfo {
  final int unit;
  final String title;
  final String description;
  final List<Lesson> lessons;

  UnitInfo(this.unit, this.title, this.description, this.lessons);
}

List<UnitInfo> getAllUnits() {
  final units = [
    (1, '🎤 Start Singing!', 'Learn with Kooka'),
  ];
  return units
      .map((u) => UnitInfo(u.$1, u.$2, u.$3, getLessonsByUnit(u.$1)))
      .toList();
}


