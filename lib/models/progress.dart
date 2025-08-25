class LessonProgress {
  final String userId;
  final String lessonId;
  final bool completed;
  final int score;
  final DateTime completedDate;

  const LessonProgress({
    required this.userId,
    required this.lessonId,
    required this.completed,
    required this.score,
    required this.completedDate,
  });
}



