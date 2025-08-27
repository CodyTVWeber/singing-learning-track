import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/pages/lesson_page.dart';
import 'package:kooka_sing/models/user.dart';
import 'package:kooka_sing/data/units.dart';

void main() {
  group('Simple Lesson Flow Tests', () {
    testWidgets('Lesson page shows proper content', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should show lesson description
      expect(find.text('Let\'s learn to breathe like Kooka!'), findsOneWidget);
      
      // Should show start lesson button
      expect(find.text('Start Lesson'), findsOneWidget);
    });

    testWidgets('User can progress through lesson states', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should start in intro state
      expect(find.text('Start Lesson'), findsOneWidget);
      expect(find.text('Practice Time!'), findsNothing);

      // Tap start lesson button
      await tester.tap(find.text('Start Lesson'));
      await tester.pumpAndSettle();

      // Should now be in practice state
      expect(find.text('Practice Time!'), findsOneWidget);
      expect(find.text('Start Lesson'), findsNothing);
    });

    testWidgets('Lesson page has proper navigation', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: LessonPage(lessonId: 'breath-basics'),
        ),
      );

      // Wait for loading to complete
      await tester.pumpAndSettle();

      // Should have back button
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
      
      // Should show lesson title in app bar
      expect(find.text('Breathing with Kooka'), findsOneWidget);
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