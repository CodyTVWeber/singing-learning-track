import 'package:hive/hive.dart';

part 'progress.g.dart';

@HiveType(typeId: 2)
class LessonProgress extends HiveObject {
  @HiveField(0)
  final String userId;
  
  @HiveField(1)
  final String lessonId;
  
  @HiveField(2)
  final bool completed;
  
  @HiveField(3)
  final int score;
  
  @HiveField(4)
  final DateTime completedDate;

  LessonProgress({
    required this.userId,
    required this.lessonId,
    required this.completed,
    required this.score,
    required this.completedDate,
  });

  LessonProgress copyWith({
    String? userId,
    String? lessonId,
    bool? completed,
    int? score,
    DateTime? completedDate,
  }) {
    return LessonProgress(
      userId: userId ?? this.userId,
      lessonId: lessonId ?? this.lessonId,
      completed: completed ?? this.completed,
      score: score ?? this.score,
      completedDate: completedDate ?? this.completedDate,
    );
  }
}



