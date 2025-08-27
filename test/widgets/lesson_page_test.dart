import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/pages/lesson_page.dart';
import 'package:kooka_sing/models/lesson.dart';
import 'package:kooka_sing/data/units.dart';

void main() {
  group('LessonPage Widget Tests', () {
    late Lesson testLesson;

    setUp(() {
      testLesson = getLessonById('breath-basics')!;
    });

    testWidgets('Lesson page shows intro state by default', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should show lesson title
      expect(find.text('Breathing with Kooka'), findsOneWidget);
      
      // Should show start lesson button
      expect(find.text('Start Lesson'), findsOneWidget);
      
      // Should not show practice interface yet
      expect(find.text('Practice Time!'), findsNothing);
    });

    testWidgets('Tapping start lesson transitions to practice state', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Tap start lesson button
      await tester.tap(find.text('Start Lesson'));
      await tester.pumpAndSettle();

      // Should now show practice interface
      expect(find.text('Practice Time!'), findsOneWidget);
      expect(find.text('Take a deep breath and hold it'), findsOneWidget);
      
      // Should not show intro content
      expect(find.text('Start Lesson'), findsNothing);
    });

    testWidgets('Lesson page shows proper lesson information', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should show lesson title
      expect(find.text(testLesson.title), findsOneWidget);
      
      // Should show lesson description
      expect(find.text(testLesson.description), findsOneWidget);
    });

    testWidgets('Lesson page has back button in app bar', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should have back button
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('Lesson page shows loading state initially', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'invalid-lesson'),
        ),
      );

      // Should show loading indicator initially
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('Lesson page shows error for invalid lesson', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'invalid-lesson'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should show error message
      expect(find.text('Lesson not found'), findsOneWidget);
    });
  });
}