import 'package:kooka_sing/models/user.dart';
import 'package:kooka_sing/models/progress.dart';

class MockUserStore {
  static UserProfile? _mockUser;
  static bool _initialized = false;

  static Future<void> init() async {
    _initialized = true;
  }

  static Future<UserProfile?> getUser() async {
    if (!_initialized) throw Exception('MockUserStore not initialized');
    return _mockUser;
  }

  static Future<void> saveUser(UserProfile user) async {
    if (!_initialized) throw Exception('MockUserStore not initialized');
    _mockUser = user;
  }

  static Future<void> clearAll() async {
    if (!_initialized) throw Exception('MockUserStore not initialized');
    _mockUser = null;
  }

  static void reset() {
    _mockUser = null;
    _initialized = false;
  }
}

class MockProgressStore {
  static final Map<String, LessonProgress> _mockProgress = {};
  static bool _initialized = false;

  static Future<void> init() async {
    _initialized = true;
  }

  static Future<List<LessonProgress>> getProgress(String userId) async {
    if (!_initialized) throw Exception('MockProgressStore not initialized');
    return _mockProgress.values
        .where((p) => p.userId == userId)
        .toList();
  }

  static Future<void> saveProgress(LessonProgress progress) async {
    if (!_initialized) throw Exception('MockProgressStore not initialized');
    final key = '${progress.userId}_${progress.lessonId}';
    _mockProgress[key] = progress;
  }

  static Future<List<String>> getCompletedLessonIds(String userId) async {
    if (!_initialized) throw Exception('MockProgressStore not initialized');
    return _mockProgress.values
        .where((p) => p.userId == userId && p.completed)
        .map((p) => p.lessonId)
        .toList();
  }

  static Future<LessonProgress?> getLessonProgress(String userId, String lessonId) async {
    if (!_initialized) throw Exception('MockProgressStore not initialized');
    final key = '${userId}_$lessonId';
    return _mockProgress[key];
  }

  static void reset() {
    _mockProgress.clear();
    _initialized = false;
  }
}