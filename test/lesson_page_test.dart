import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/pages/lesson_page.dart';
import 'package:kooka_sing/models/lesson.dart';
import 'package:kooka_sing/theme/app_theme.dart';

void main() {
  group('LessonPage Widget Tests', () {
    late Lesson testLesson;

    setUp(() {
      testLesson = Lesson(
        id: 'test-lesson',
        level: 1,
        unit: 1,
        position: 1,
        title: '🎈 Test Lesson',
        type: 'practice',
        description: 'Test description',
        content: '{"steps": ["Step 1", "Step 2", "Step 3"], "visual": "test-visual", "audio": "test-audio"}',
        imageUrl: 'test-image',
        unlocked: true,
        prerequisite: null,
      );
    });

    testWidgets('LessonPage displays lesson title', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      expect(find.text('🎈 Test Lesson'), findsOneWidget);
    });

    testWidgets('LessonPage shows first step initially', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      expect(find.text('Step 1'), findsOneWidget);
      expect(find.text('Step 2'), findsNothing);
    });

    testWidgets('LessonPage shows progress indicator', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      expect(find.byType(LinearProgressIndicator), findsOneWidget);
      expect(find.text('1 / 3'), findsOneWidget);
    });

    testWidgets('Next button advances to next step', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      // Find and tap next button
      final nextButton = find.byIcon(Icons.arrow_forward);
      expect(nextButton, findsOneWidget);
      
      await tester.tap(nextButton);
      await tester.pump();

      // Should now show step 2
      expect(find.text('Step 2'), findsOneWidget);
      expect(find.text('Step 1'), findsNothing);
      expect(find.text('2 / 3'), findsOneWidget);
    });

    testWidgets('Back button returns to previous step', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      // Advance to step 2
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();

      // Now go back
      final backButton = find.byIcon(Icons.arrow_back);
      expect(backButton, findsOneWidget);
      
      await tester.tap(backButton);
      await tester.pump();

      // Should be back at step 1
      expect(find.text('Step 1'), findsOneWidget);
      expect(find.text('1 / 3'), findsOneWidget);
    });

    testWidgets('Final step shows check icon', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      // Advance to last step
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();
      await tester.tap(find.byIcon(Icons.arrow_forward));
      await tester.pump();

      // Should show check icon instead of arrow
      expect(find.byIcon(Icons.check_circle), findsOneWidget);
      expect(find.byIcon(Icons.arrow_forward), findsNothing);
      expect(find.text('3 / 3'), findsOneWidget);
    });

    testWidgets('Breathing lesson shows animated visual', (WidgetTester tester) async {
      final breathingLesson = Lesson(
        id: 'breath-basics',
        level: 1,
        unit: 1,
        position: 1,
        title: '🎈 Belly Breathing',
        type: 'practice',
        description: 'Blow up your belly!',
        content: '{"steps": ["Watch Kooka breathe"], "visual": "kooka-belly-animation", "audio": "breath-guide"}',
        imageUrl: 'kooka-breathing',
        unlocked: true,
        prerequisite: null,
      );

      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: breathingLesson),
        ),
      );

      // Should find the balloon emoji in the visual
      expect(find.text('🎈'), findsWidgets);
      expect(find.byType(AnimatedBuilder), findsWidgets);
    });

    testWidgets('Practice lesson shows practice button', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: testLesson),
        ),
      );

      expect(find.text('Practice'), findsOneWidget);
      expect(find.byIcon(Icons.play_arrow), findsOneWidget);
    });

    testWidgets('Sound lesson shows listen and record buttons', (WidgetTester tester) async {
      final soundLesson = Lesson(
        id: 'test-sound',
        level: 1,
        unit: 1,
        position: 1,
        title: 'Sound Test',
        type: 'sound',
        description: 'Test',
        content: '{"steps": ["Listen"], "visual": "test", "audio": "test"}',
        imageUrl: 'test',
        unlocked: true,
        prerequisite: null,
      );

      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: soundLesson),
        ),
      );

      expect(find.text('Listen'), findsOneWidget);
      expect(find.text('Record'), findsOneWidget);
      expect(find.byIcon(Icons.hearing), findsOneWidget);
      expect(find.byIcon(Icons.mic), findsOneWidget);
    });

    testWidgets('Song lesson shows play song button', (WidgetTester tester) async {
      final songLesson = Lesson(
        id: 'test-song',
        level: 1,
        unit: 1,
        position: 1,
        title: 'Song Test',
        type: 'song',
        description: 'Test',
        content: '{"steps": ["Sing"], "visual": "test", "audio": "test"}',
        imageUrl: 'test',
        unlocked: true,
        prerequisite: null,
      );

      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lesson: songLesson),
        ),
      );

      expect(find.text('Play Song'), findsOneWidget);
      expect(find.byIcon(Icons.music_note), findsWidgets);
    });
  });
}