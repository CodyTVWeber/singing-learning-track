import 'package:hive_flutter/hive_flutter.dart';
import '../models/progress.dart';

class ProgressStore {
  static const String _boxName = 'progressBox';
  
  late Box<Map> _box;
  
  Future<void> init() async {
    _box = await Hive.openBox<Map>(_boxName);
  }
  
  Future<List<LessonProgress>> getProgress(String userId) async {
    final allProgress = <LessonProgress>[];
    
    for (final key in _box.keys) {
      final data = _box.get(key);
      if (data != null) {
        final progress = LessonProgress.fromJson(Map<String, dynamic>.from(data));
        if (progress.userId == userId) {
          allProgress.add(progress);
        }
      }
    }
    
    return allProgress;
  }
  
  Future<void> saveProgress(LessonProgress progress) async {
    final key = '${progress.userId}_${progress.lessonId}';
    await _box.put(key, progress.toJson());
  }
  
  Future<List<String>> getCompletedLessonIds(String userId) async {
    final progress = await getProgress(userId);
    return progress
        .where((p) => p.completed)
        .map((p) => p.lessonId)
        .toList();
  }
  
  Future<void> deleteAllProgress(String userId) async {
    final keysToDelete = <dynamic>[];
    
    for (final key in _box.keys) {
      final data = _box.get(key);
      if (data != null) {
        final progress = LessonProgress.fromJson(Map<String, dynamic>.from(data));
        if (progress.userId == userId) {
          keysToDelete.add(key);
        }
      }
    }
    
    await _box.deleteAll(keysToDelete);
  }
  
  Future<void> close() async {
    await _box.close();
  }
}