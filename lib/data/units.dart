import '../models/lesson.dart';

final List<Lesson> sampleLessons = [
  Lesson(
    id: 'breath-basics',
    level: 1,
    unit: 1,
    position: 1,
    title: 'Breathing with Kooka',
    type: 'practice',
    description: 'Learn the foundation of singing with Kooka',
    content: 'Kooka\'s belly breathing and eucalyptus leaf float.',
    imageUrl: 'kooka-breathing',
    unlocked: true,
    prerequisite: null,
  ),
  Lesson(
    id: 'voice-discovery',
    level: 1,
    unit: 1,
    position: 2,
    title: 'Finding Your Voice',
    type: 'sound',
    description: 'Discover high, low and middle voice.',
    content: 'High like baby kookaburra, low like papa, middle like mama.',
    imageUrl: 'kooka-voice-range',
    unlocked: false,
    prerequisite: 'breath-basics',
  ),
  Lesson(
    id: 'kooka-laugh',
    level: 1,
    unit: 1,
    position: 3,
    title: 'The Kookaburra Laugh',
    type: 'song',
    description: 'Your first full song with Kooka! ',
    content: 'Kookaburra sits in the old gum tree... tips and rhythm.',
    imageUrl: 'kooka-singing',
    unlocked: false,
    prerequisite: 'voice-discovery',
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
    (1, 'Vocal Foundations', 'Building blocks of singing'),
  ];
  return units
      .map((u) => UnitInfo(u.$1, u.$2, u.$3, getLessonsByUnit(u.$1)))
      .toList();
}


