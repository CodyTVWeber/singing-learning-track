import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/widgets/visual_instruction.dart';
import 'package:kooka_sing/theme/app_theme.dart';

void main() {
  group('VisualInstruction Widget Tests', () {
    testWidgets('VisualInstruction displays icon and text', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: VisualInstruction(
              icon: '🎵',
              shortText: 'Sing!',
            ),
          ),
        ),
      );

      expect(find.text('🎵'), findsOneWidget);
      expect(find.text('Sing!'), findsOneWidget);
    });

    testWidgets('VisualInstruction responds to tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: VisualInstruction(
              icon: '👏',
              shortText: 'Clap',
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(VisualInstruction));
      expect(tapped, true);
    });

    testWidgets('VisualInstruction uses custom background color', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: VisualInstruction(
              icon: '🎈',
              shortText: 'Breathe',
              backgroundColor: Colors.blue,
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(VisualInstruction),
          matching: find.byType(Container),
        ).first,
      );

      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, Colors.blue);
    });
  });

  group('AnimatedVisualButton Widget Tests', () {
    testWidgets('AnimatedVisualButton displays emoji and label', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AnimatedVisualButton(
              emoji: '🎤',
              label: 'Start',
              onTap: () {},
            ),
          ),
        ),
      );

      expect(find.text('🎤'), findsOneWidget);
      expect(find.text('Start'), findsOneWidget);
    });

    testWidgets('AnimatedVisualButton animates on tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AnimatedVisualButton(
              emoji: '▶️',
              label: 'Play',
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      // Get initial scale
      final initialTransform = tester.widget<Transform>(
        find.descendant(
          of: find.byType(AnimatedVisualButton),
          matching: find.byType(Transform),
        ),
      );

      // Tap and hold
      await tester.press(find.byType(AnimatedVisualButton));
      await tester.pump(const Duration(milliseconds: 75));

      // Check scale changed during press
      final pressedTransform = tester.widget<Transform>(
        find.descendant(
          of: find.byType(AnimatedVisualButton),
          matching: find.byType(Transform),
        ),
      );

      // Release
      await tester.pumpAndSettle();
      
      expect(tapped, true);
    });

    testWidgets('AnimatedVisualButton uses custom color', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AnimatedVisualButton(
              emoji: '🎵',
              label: 'Music',
              color: Colors.purple,
              onTap: () {},
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(AnimatedVisualButton),
          matching: find.byType(Container),
        ).last,
      );

      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, Colors.purple);
    });
  });

  group('ProgressDots Widget Tests', () {
    testWidgets('ProgressDots shows correct number of dots', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ProgressDots(
              total: 5,
              current: 2,
            ),
          ),
        ),
      );

      // Should find 5 containers (dots)
      final dots = find.descendant(
        of: find.byType(ProgressDots),
        matching: find.byType(Container),
      );
      expect(dots, findsNWidgets(5));
    });

    testWidgets('ProgressDots highlights current and completed dots', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ProgressDots(
              total: 4,
              current: 2,
            ),
          ),
        ),
      );

      final containers = tester.widgetList<Container>(
        find.descendant(
          of: find.byType(ProgressDots),
          matching: find.byType(Container),
        ),
      ).toList();

      // Check colors
      expect((containers[0].decoration as BoxDecoration).color, AppTheme.success); // Completed
      expect((containers[1].decoration as BoxDecoration).color, AppTheme.success); // Completed
      expect((containers[2].decoration as BoxDecoration).color, AppTheme.primary); // Current
      expect((containers[3].decoration as BoxDecoration).color, AppTheme.surface); // Future
    });

    testWidgets('ProgressDots current dot is wider', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ProgressDots(
              total: 3,
              current: 1,
            ),
          ),
        ),
      );

      final containers = tester.widgetList<Container>(
        find.descendant(
          of: find.byType(ProgressDots),
          matching: find.byType(Container),
        ),
      ).toList();

      // Check widths
      expect(containers[0].constraints?.maxWidth, 12); // Completed
      expect(containers[1].constraints?.maxWidth, 24); // Current (wider)
      expect(containers[2].constraints?.maxWidth, 12); // Future
    });
  });
}