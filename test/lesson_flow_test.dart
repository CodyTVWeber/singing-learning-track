import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/main.dart';
import 'package:kooka_sing/pages/skill_tree_page.dart';
import 'package:kooka_sing/pages/lesson_page.dart';
import 'package:kooka_sing/storage/user_store.dart';
import 'package:kooka_sing/storage/progress_store.dart';

void main() {
  group('Lesson Flow Integration Tests', () {
    setUp(() async {
      // Clear any existing data
      await UserStore.clearUser();
      await ProgressStore.clearAllProgress();
    });

    testWidgets('Complete lesson flow from skill tree to completion', (WidgetTester tester) async {
      // Create a test user first
      await UserStore.saveUser(
        'test-user',
        'Test User',
        'kid',
      );

      // Start app at skill tree
      await tester.pumpWidget(
        const MaterialApp(
          home: SkillTreePage(),
        ),
      );
      await tester.pumpAndSettle();

      // Find and tap the first lesson (Belly Breathing)
      final firstLesson = find.text('🎈 Belly Breathing');
      expect(firstLesson, findsOneWidget);
      
      await tester.tap(firstLesson);
      await tester.pumpAndSettle();

      // Verify we're on the lesson page
      expect(find.byType(LessonPage), findsOneWidget);
      expect(find.text('Watch Kooka breathe'), findsOneWidget);

      // Progress through all steps
      // Step 1 -> Step 2
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();
      expect(find.text('Touch belly'), findsOneWidget);

      // Step 2 -> Step 3
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();
      expect(find.text('Breathe in = Big belly'), findsOneWidget);

      // Step 3 -> Step 4
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();
      expect(find.text('Breathe out = Small belly'), findsOneWidget);

      // Complete the lesson
      await tester.tap(find.byIcon(Icons.check_circle));
      await tester.pumpAndSettle();

      // Should show celebration dialog
      expect(find.text('🎉'), findsOneWidget);
      expect(find.text('Great Job!'), findsOneWidget);
      expect(find.text('Next Lesson'), findsOneWidget);

      // Tap next lesson to go back to skill tree
      await tester.tap(find.text('Next Lesson'));
      await tester.pumpAndSettle();

      // Should be back at skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);
      
      // The first lesson should now show as completed
      // The second lesson should now be unlocked
      final secondLesson = find.text('🎵 High & Low');
      expect(secondLesson, findsOneWidget);
    });

    testWidgets('Navigate back from lesson maintains progress', (WidgetTester tester) async {
      // Create a test user
      await UserStore.saveUser('test-user', 'Test User', 'kid');

      // Start at skill tree
      await tester.pumpWidget(
        const MaterialApp(
          home: SkillTreePage(),
        ),
      );
      await tester.pumpAndSettle();

      // Open first lesson
      await tester.tap(find.text('🎈 Belly Breathing'));
      await tester.pumpAndSettle();

      // Progress to step 3
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();

      // Go back using app bar
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();

      // Should be back at skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);

      // Re-open the same lesson
      await tester.tap(find.text('🎈 Belly Breathing'));
      await tester.pumpAndSettle();

      // Should start from beginning (no persistence of partial progress)
      expect(find.text('Watch Kooka breathe'), findsOneWidget);
    });

    testWidgets('Locked lessons cannot be accessed', (WidgetTester tester) async {
      // Create a test user
      await UserStore.saveUser('test-user', 'Test User', 'kid');

      // Start at skill tree
      await tester.pumpWidget(
        const MaterialApp(
          home: SkillTreePage(),
        ),
      );
      await tester.pumpAndSettle();

      // Try to tap a locked lesson (second lesson)
      final lockedLesson = find.text('🎵 High & Low');
      expect(lockedLesson, findsOneWidget);

      // Get the opacity widget
      final opacityWidget = find.ancestor(
        of: lockedLesson,
        matching: find.byType(Opacity),
      );
      
      final opacity = tester.widget<Opacity>(opacityWidget);
      expect(opacity.opacity, 0.5); // Locked lessons have 0.5 opacity

      // Tap should not navigate
      await tester.tap(lockedLesson);
      await tester.pumpAndSettle();

      // Should still be on skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);
      expect(find.byType(LessonPage), findsNothing);
    });

    testWidgets('Lesson unlocks after prerequisite completion', (WidgetTester tester) async {
      // Create a test user
      await UserStore.saveUser('test-user', 'Test User', 'kid');

      // Mark first lesson as complete
      await ProgressStore.markLessonComplete('breath-basics');

      // Start at skill tree
      await tester.pumpWidget(
        const MaterialApp(
          home: SkillTreePage(),
        ),
      );
      await tester.pumpAndSettle();

      // Second lesson should now be unlocked and tappable
      final secondLesson = find.text('🎵 High & Low');
      expect(secondLesson, findsOneWidget);

      // Check opacity is 1.0 (unlocked)
      final opacityWidget = find.ancestor(
        of: secondLesson,
        matching: find.byType(Opacity),
      );
      
      final opacity = tester.widget<Opacity>(opacityWidget);
      expect(opacity.opacity, 1.0); // Unlocked lessons have full opacity

      // Should be able to tap and navigate
      await tester.tap(secondLesson);
      await tester.pumpAndSettle();

      // Should be on lesson page
      expect(find.byType(LessonPage), findsOneWidget);
      expect(find.text('Listen to baby bird 🐣'), findsOneWidget);
    });

    testWidgets('Different lesson types show appropriate controls', (WidgetTester tester) async {
      // Create a test user and unlock all lessons
      await UserStore.saveUser('test-user', 'Test User', 'kid');
      await ProgressStore.markLessonComplete('breath-basics');
      await ProgressStore.markLessonComplete('voice-discovery');

      // Start at skill tree
      await tester.pumpWidget(
        const MaterialApp(
          home: SkillTreePage(),
        ),
      );
      await tester.pumpAndSettle();

      // Test practice lesson (already tested above)

      // Test sound lesson
      await tester.tap(find.text('🎵 High & Low'));
      await tester.pumpAndSettle();
      
      expect(find.text('Listen'), findsOneWidget);
      expect(find.text('Record'), findsOneWidget);
      
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();

      // Test song lesson
      await tester.tap(find.text('😄 Kooka Laugh Song'));
      await tester.pumpAndSettle();
      
      expect(find.text('Play Song'), findsOneWidget);
      
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();
    });
  });
}