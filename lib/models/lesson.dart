class Lesson {
  final String id;
  final int level;
  final String title;
  final String type; // 'sound' | 'song' | 'practice'
  final String content;
  final String description;
  final String? imageUrl;
  final bool unlocked;
  final String? prerequisite;
  final int unit;
  final int position;

  const Lesson({
    required this.id,
    required this.level,
    required this.title,
    required this.type,
    required this.content,
    required this.description,
    this.imageUrl,
    this.unlocked = false,
    this.prerequisite,
    required this.unit,
    required this.position,
  });
}



