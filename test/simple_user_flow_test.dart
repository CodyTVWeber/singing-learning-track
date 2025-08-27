import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/models/user.dart';
import 'package:kooka_sing/models/lesson.dart';
import 'package:kooka_sing/models/progress.dart';
import 'package:kooka_sing/data/units.dart';

void main() {
  group('User Flow Unit Tests', () {
    test('Create new user profile', () {
      final user = UserProfile(
        id: 'test-123',
        name: 'Test User',
        ageGroup: 'kid',
        currentLevel: 1,
        totalPoints: 0,
        streak: 0,
      );

      expect(user.name, 'Test User');
      expect(user.ageGroup, 'kid');
      expect(user.totalPoints, 0);
    });

    test('User can complete a lesson', () {
      final progress = LessonProgress(
        userId: 'test-123',
        lessonId: 'breath-basics',
        completed: true,
        score: 95,
        completedDate: DateTime.now(),
      );

      expect(progress.completed, true);
      expect(progress.score, 95);
    });

    test('Lesson prerequisites work correctly', () {
      final completed = <String>[];
      
      // First lesson should be unlocked
      expect(isLessonUnlocked('breath-basics', completed), true);
      
      // Second lesson should be locked
      expect(isLessonUnlocked('voice-discovery', completed), false);
      
      // Complete first lesson
      completed.add('breath-basics');
      
      // Now second lesson should be unlocked
      expect(isLessonUnlocked('voice-discovery', completed), true);
    });

    test('Get lessons by unit', () {
      final unit1Lessons = getLessonsByUnit(1);
      
      expect(unit1Lessons.length, 3);
      expect(unit1Lessons[0].id, 'breath-basics');
      expect(unit1Lessons[1].id, 'voice-discovery');
      expect(unit1Lessons[2].id, 'kooka-laugh');
    });

    test('User progression flow', () {
      // Start with new user
      var user = UserProfile(
        id: 'test-123',
        name: 'Journey User',
        ageGroup: 'teen',
        currentLevel: 1,
        totalPoints: 0,
        streak: 0,
      );
      
      expect(user.totalPoints, 0);
      expect(user.streak, 0);
      
      // Complete a lesson
      user = user.copyWith(
        totalPoints: user.totalPoints + 100,
        streak: user.streak + 1,
      );
      
      expect(user.totalPoints, 100);
      expect(user.streak, 1);
      
      // Complete another lesson
      user = user.copyWith(
        totalPoints: user.totalPoints + 100,
      );
      
      expect(user.totalPoints, 200);
    });

    test('Age group selection', () {
      final ageGroups = ['kid', 'teen', 'adult'];
      
      for (final ageGroup in ageGroups) {
        final user = UserProfile(
          id: 'test',
          name: 'Test',
          ageGroup: ageGroup,
          currentLevel: 1,
          totalPoints: 0,
          streak: 0,
        );
        
        expect(ageGroups.contains(user.ageGroup), true);
      }
    });

    test('Lesson data structure', () {
      final lesson = getLessonById('breath-basics');
      
      expect(lesson, isNotNull);
      expect(lesson!.title, 'Breathing with Kooka');
      expect(lesson.type, 'practice');
      expect(lesson.unit, 1);
      expect(lesson.unlocked, true);
    });

    test('Calculate user progress percentage', () {
      final totalLessons = sampleLessons.length;
      final completedLessons = ['breath-basics', 'voice-discovery'];
      final progressPercentage = (completedLessons.length / totalLessons * 100).round();
      
      expect(progressPercentage, 67); // 2 out of 3 lessons
    });
  });
}