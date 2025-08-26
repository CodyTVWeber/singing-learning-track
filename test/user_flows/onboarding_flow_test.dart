import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/pages/onboarding_page.dart';
import 'package:kooka_sing/pages/skill_tree_page.dart';
import 'package:kooka_sing/storage/user_store.dart';
import 'package:kooka_sing/storage/progress_store.dart';

void main() {
  group('Onboarding User Flow', () {
    setUpAll(() async {
      TestWidgetsFlutterBinding.ensureInitialized();
      await UserStore.init();
      await ProgressStore.init();
    });

    setUp(() async {
      // Clear any existing user data before each test
      await UserStore.clearUser();
    });

    testWidgets('Shows welcome message and Kooka mascot', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Check for welcome elements
      expect(find.text('Welcome to Kooka Sing!'), findsOneWidget);
      expect(find.text("Let's get to know you"), findsOneWidget);
      expect(find.byType(Image), findsWidgets); // Kooka mascot images
    });

    testWidgets('Displays name input field with validation', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Find name input field
      final nameField = find.byType(TextFormField);
      expect(nameField, findsOneWidget);

      // Check placeholder text
      expect(find.text('Enter your name'), findsOneWidget);

      // Test empty name validation
      final getStartedButton = find.text('Get Started');
      await tester.tap(getStartedButton);
      await tester.pump();

      // Should show validation error
      expect(find.text('Please enter your name'), findsOneWidget);

      // Enter a valid name
      await tester.enterText(nameField, 'Test User');
      await tester.pump();

      // Error should disappear
      expect(find.text('Please enter your name'), findsNothing);
    });

    testWidgets('Shows age group selection cards', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Check all age group options are displayed
      expect(find.text('Kid (3-12)'), findsOneWidget);
      expect(find.text('Teen (13-17)'), findsOneWidget);
      expect(find.text('Adult (18+)'), findsOneWidget);

      // Check descriptions
      expect(find.text('Fun and playful learning'), findsOneWidget);
      expect(find.text('Building confidence and skills'), findsOneWidget);
      expect(find.text('Learning at your own pace'), findsOneWidget);

      // Check icons are displayed
      expect(find.byIcon(Icons.child_care), findsOneWidget);
      expect(find.byIcon(Icons.school), findsOneWidget);
      expect(find.byIcon(Icons.person), findsOneWidget);
    });

    testWidgets('Can select different age groups', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Initially Kid should be selected (default)
      final kidCard = find.ancestor(
        of: find.text('Kid (3-12)'),
        matching: find.byType(Card),
      ).first;

      // Tap on Teen option
      final teenCard = find.ancestor(
        of: find.text('Teen (13-17)'),
        matching: find.byType(Card),
      ).first;
      
      await tester.tap(teenCard);
      await tester.pump();

      // Teen should now be selected
      // Check visual feedback (selected card should have different styling)
      final teenCardWidget = tester.widget<Card>(teenCard);
      expect(teenCardWidget.elevation, greaterThan(1));

      // Tap on Adult option
      final adultCard = find.ancestor(
        of: find.text('Adult (18+)'),
        matching: find.byType(Card),
      ).first;
      
      await tester.tap(adultCard);
      await tester.pump();

      // Adult should now be selected
      final adultCardWidget = tester.widget<Card>(adultCard);
      expect(adultCardWidget.elevation, greaterThan(1));
    });

    testWidgets('Complete onboarding flow successfully', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const OnboardingPage(),
          routes: {
            '/skill-tree': (context) => const SkillTreePage(),
          },
        ),
      );

      // Enter name
      final nameField = find.byType(TextFormField);
      await tester.enterText(nameField, 'Test Student');
      await tester.pump();

      // Select Teen age group
      final teenCard = find.ancestor(
        of: find.text('Teen (13-17)'),
        matching: find.byType(Card),
      ).first;
      await tester.tap(teenCard);
      await tester.pump();

      // Tap Get Started button
      final getStartedButton = find.text('Get Started');
      await tester.tap(getStartedButton);
      await tester.pump();

      // Should show loading indicator
      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      // Wait for async operations
      await tester.pumpAndSettle();

      // Should navigate to skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);

      // Verify user was saved
      final savedUser = await UserStore.getUser();
      expect(savedUser, isNotNull);
      expect(savedUser!.name, equals('Test Student'));
      expect(savedUser.ageGroup, equals('teen'));
    });

    testWidgets('Shows loading state during profile creation', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Fill in the form
      await tester.enterText(find.byType(TextFormField), 'Test User');
      await tester.pump();

      // Submit the form
      await tester.tap(find.text('Get Started'));
      await tester.pump();

      // Should show loading indicator while saving
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      
      // Button should be disabled during loading
      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      expect(button.onPressed, isNull);
    });

    testWidgets('Validates minimum name length', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Enter very short name
      await tester.enterText(find.byType(TextFormField), 'A');
      await tester.pump();

      // Try to submit
      await tester.tap(find.text('Get Started'));
      await tester.pump();

      // Should show validation error
      expect(find.text('Name must be at least 2 characters'), findsOneWidget);

      // Enter valid name
      await tester.enterText(find.byType(TextFormField), 'AB');
      await tester.pump();

      // Error should be gone
      expect(find.text('Name must be at least 2 characters'), findsNothing);
    });

    testWidgets('Trims whitespace from name input', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const OnboardingPage(),
          routes: {
            '/skill-tree': (context) => const SkillTreePage(),
          },
        ),
      );

      // Enter name with whitespace
      await tester.enterText(find.byType(TextFormField), '  Test User  ');
      await tester.pump();

      // Submit
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();

      // Check saved user has trimmed name
      final savedUser = await UserStore.getUser();
      expect(savedUser?.name, equals('Test User'));
    });

    testWidgets('Responsive layout adapts to screen size', (WidgetTester tester) async {
      // Test on tablet size
      tester.view.physicalSize = const Size(1024, 768);
      tester.view.devicePixelRatio = 1.0;

      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingPage(),
        ),
      );

      // Content should still be visible and properly laid out
      expect(find.text('Welcome to Kooka Sing!'), findsOneWidget);
      expect(find.byType(TextFormField), findsOneWidget);
      expect(find.text('Kid (3-12)'), findsOneWidget);

      // Reset to default size
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });
  });
}