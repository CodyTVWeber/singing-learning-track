import 'package:hive_flutter/hive_flutter.dart';
import '../models/progress.dart';

class ProgressStore {
  static const String _boxName = 'lesson_progress';
  
  static Box<LessonProgress>? _box;

  static Future<void> init() async {
    if (!Hive.isAdapterRegistered(2)) {
      Hive.registerAdapter(LessonProgressAdapter());
    }
    
    _box = await Hive.openBox<LessonProgress>(_boxName);
  }

  static Box<LessonProgress> get _progressBox {
    if (_box == null || !_box!.isOpen) {
      throw StateError('ProgressStore not initialized. Call ProgressStore.init() first.');
    }
    return _box!;
  }

  /// Get all progress for a specific user
  static Future<List<LessonProgress>> getProgress(String userId) async {
    try {
      return _progressBox.values
          .where((progress) => progress.userId == userId)
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Save lesson progress
  static Future<void> saveProgress(LessonProgress progress) async {
    // Use userId + lessonId as unique key
    final key = '${progress.userId}_${progress.lessonId}';
    await _progressBox.put(key, progress);
  }

  /// Get progress for a specific lesson
  static Future<LessonProgress?> getLessonProgress(String userId, String lessonId) async {
    final key = '${userId}_$lessonId';
    return _progressBox.get(key);
  }

  /// Get list of completed lesson IDs for a user
  static Future<List<String>> getCompletedLessonIds(String userId) async {
    try {
      final allProgress = await getProgress(userId);
      return allProgress
          .where((progress) => progress.completed)
          .map((progress) => progress.lessonId)
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Check if a specific lesson is completed
  static Future<bool> isLessonCompleted(String userId, String lessonId) async {
    final progress = await getLessonProgress(userId, lessonId);
    return progress?.completed ?? false;
  }

  /// Mark a lesson as completed
  static Future<void> completeLesson({
    required String userId,
    required String lessonId,
    required int score,
  }) async {
    final progress = LessonProgress(
      userId: userId,
      lessonId: lessonId,
      completed: true,
      score: score,
      completedDate: DateTime.now(),
    );
    
    await saveProgress(progress);
  }

  /// Get user's total score across all lessons
  static Future<int> getTotalScore(String userId) async {
    try {
      final allProgress = await getProgress(userId);
      return allProgress
          .where((progress) => progress.completed)
          .fold<int>(0, (int sum, progress) => sum + progress.score);
    } catch (e) {
      return 0;
    }
  }

  /// Clear all progress data
  static Future<void> clearAll() async {
    await _progressBox.clear();
  }

  /// Clear progress for a specific user
  static Future<void> clearUserProgress(String userId) async {
    final keysToDelete = _progressBox.keys
        .where((key) => key.toString().startsWith('${userId}_'))
        .toList();
    
    for (final key in keysToDelete) {
      await _progressBox.delete(key);
    }
  }
}