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

  Map<String, dynamic> toJson() => {
    'userId': userId,
    'lessonId': lessonId,
    'completed': completed,
    'score': score,
    'completedDate': completedDate.toIso8601String(),
  };

  factory LessonProgress.fromJson(Map<String, dynamic> json) => LessonProgress(
    userId: json['userId'] as String,
    lessonId: json['lessonId'] as String,
    completed: json['completed'] as bool,
    score: json['score'] as int,
    completedDate: DateTime.parse(json['completedDate'] as String),
  );
}



