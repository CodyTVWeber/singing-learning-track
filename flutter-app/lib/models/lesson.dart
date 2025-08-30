import 'package:hive/hive.dart';

part 'lesson.g.dart';

@HiveType(typeId: 0)
class Lesson extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final int level;
  
  @HiveField(2)
  final String title;
  
  @HiveField(3)
  final String type; // 'sound' | 'song' | 'practice'
  
  @HiveField(4)
  final String content;
  
  @HiveField(5)
  final String description;
  
  @HiveField(6)
  final String? imageUrl;
  
  @HiveField(7)
  final bool unlocked;
  
  @HiveField(8)
  final String? prerequisite;
  
  @HiveField(9)
  final int unit;
  
  @HiveField(10)
  final int position;

  Lesson({
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



