import 'package:kooka_sing/models/user.dart';
import 'package:kooka_sing/models/progress.dart';
import 'package:uuid/uuid.dart';

class TestData {
  static const uuid = Uuid();

  // Test users
  static UserProfile createTestUser({
    String? id,
    String name = 'Test User',
    String ageGroup = 'kid',
    int currentLevel = 1,
    int totalPoints = 0,
    int streak = 0,
  }) {
    return UserProfile(
      id: id ?? uuid.v4(),
      name: name,
      ageGroup: ageGroup,
      currentLevel: currentLevel,
      totalPoints: totalPoints,
      streak: streak,
    );
  }

  // Test progress
  static LessonProgress createTestProgress({
    required String userId,
    required String lessonId,
    bool completed = true,
    int score = 100,
    DateTime? completedDate,
  }) {
    return LessonProgress(
      userId: userId,
      lessonId: lessonId,
      completed: completed,
      score: score,
      completedDate: completedDate ?? DateTime.now(),
    );
  }

  // Common test scenarios
  static UserProfile get newUser => createTestUser(name: 'New User');
  
  static UserProfile get returningUser => createTestUser(
    name: 'Returning User',
    currentLevel: 2,
    totalPoints: 150,
    streak: 3,
  );

  static List<LessonProgress> createProgressForUser(String userId, List<String> completedLessonIds) {
    return completedLessonIds.map((lessonId) => 
      createTestProgress(userId: userId, lessonId: lessonId)
    ).toList();
  }
}