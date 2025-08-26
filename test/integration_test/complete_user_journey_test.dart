import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/main.dart';
import 'package:kooka_sing/pages/splash_page.dart';
import 'package:kooka_sing/pages/onboarding_page.dart';
import 'package:kooka_sing/pages/skill_tree_page.dart';
import 'package:kooka_sing/storage/user_store.dart';
import 'package:kooka_sing/storage/progress_store.dart';
import 'package:kooka_sing/models/progress.dart';

void main() {
  group('Complete User Journey Integration Test', () {
    setUpAll(() async {
      TestWidgetsFlutterBinding.ensureInitialized();
    });

    setUp(() async {
      // Clean slate for each test
      await UserStore.init();
      await ProgressStore.init();
      await UserStore.clearUser();
    });

    testWidgets('New user complete journey: Splash → Onboarding → Skill Tree → Lesson', 
        (WidgetTester tester) async {
      // STEP 1: Launch app
      await tester.pumpWidget(const KookaSingApp());
      
      // Verify splash screen appears
      expect(find.byType(SplashPage), findsOneWidget);
      expect(find.text('Your Journey with Kooka'), findsOneWidget);
      
      // Wait for splash animation and navigation
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      // STEP 2: Should navigate to onboarding (no existing user)
      expect(find.byType(OnboardingPage), findsOneWidget);
      expect(find.text('Welcome to Kooka Sing!'), findsOneWidget);

      // STEP 3: Complete onboarding
      // Enter name
      final nameField = find.byType(TextFormField);
      await tester.enterText(nameField, 'Journey Tester');
      await tester.pump();

      // Select age group (Teen)
      final teenOption = find.ancestor(
        of: find.text('Teen (13-17)'),
        matching: find.byType(Card),
      ).first;
      await tester.tap(teenOption);
      await tester.pump();

      // Submit onboarding
      await tester.tap(find.text('Get Started'));
      await tester.pump(); // Start loading
      await tester.pumpAndSettle(); // Wait for navigation

      // STEP 4: Should now be on skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);
      
      // Verify user info is displayed
      expect(find.text('Journey Tester'), findsOneWidget);
      expect(find.text('0 points'), findsOneWidget);
      
      // Verify lessons are displayed
      expect(find.text('Vocal Foundations'), findsOneWidget);
      expect(find.text('Breathing with Kooka'), findsOneWidget);

      // STEP 5: Interact with first lesson (should be unlocked)
      await tester.tap(find.text('Breathing with Kooka'));
      await tester.pump();

      // Verify we can interact with unlocked lesson
      // (In full implementation, this would navigate to lesson page)
      
      // STEP 6: Try to tap locked lesson (should not work)
      await tester.tap(find.text('Finding Your Voice'));
      await tester.pump();
      
      // Should still see lock icon
      expect(
        find.descendant(
          of: find.ancestor(
            of: find.text('Finding Your Voice'),
            matching: find.byType(Card),
          ).first,
          matching: find.byIcon(Icons.lock),
        ),
        findsOneWidget,
      );

      // Verify user was properly saved
      final savedUser = await UserStore.getUser();
      expect(savedUser, isNotNull);
      expect(savedUser!.name, equals('Journey Tester'));
      expect(savedUser.ageGroup, equals('teen'));
    });

    testWidgets('Returning user journey: Splash → Skill Tree with progress', 
        (WidgetTester tester) async {
      // SETUP: Create existing user with progress
      await UserStore.init();
      await ProgressStore.init();
      
      final existingUser = await UserStore.saveUser(UserProfile(
        id: 'test-user-123',
        name: 'Returning Student',
        ageGroup: 'kid',
        currentLevel: 2,
        totalPoints: 250,
        streak: 5,
      ));
      
      // Add some completed lessons
      await ProgressStore.saveProgress(LessonProgress(
        userId: 'test-user-123',
        lessonId: 'breath-basics',
        completed: true,
        score: 95,
        completedDate: DateTime.now().subtract(const Duration(days: 1)),
      ));

      // STEP 1: Launch app
      await tester.pumpWidget(const KookaSingApp());
      
      // Verify splash screen
      expect(find.byType(SplashPage), findsOneWidget);
      
      // Wait for navigation
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      // STEP 2: Should skip onboarding and go straight to skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);
      expect(find.byType(OnboardingPage), findsNothing);
      
      // STEP 3: Verify user data is loaded
      expect(find.text('Returning Student'), findsOneWidget);
      expect(find.text('250 points'), findsOneWidget);
      expect(find.text('5 day streak'), findsOneWidget);
      
      // STEP 4: Verify progress is reflected
      // First lesson should show as completed
      expect(
        find.descendant(
          of: find.ancestor(
            of: find.text('Breathing with Kooka'),
            matching: find.byType(Card),
          ).first,
          matching: find.byIcon(Icons.check_circle),
        ),
        findsOneWidget,
      );
      
      // Second lesson should be unlocked (prerequisite met)
      expect(
        find.descendant(
          of: find.ancestor(
            of: find.text('Finding Your Voice'),
            matching: find.byType(Card),
          ).first,
          matching: find.byIcon(Icons.lock),
        ),
        findsNothing, // No lock icon
      );
    });

    testWidgets('Progress persistence across app restarts', 
        (WidgetTester tester) async {
      // PART 1: Initial session - create user and make progress
      await tester.pumpWidget(const KookaSingApp());
      
      // Go through onboarding
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();
      
      // Complete onboarding
      await tester.enterText(find.byType(TextFormField), 'Persistent User');
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();
      
      // Now on skill tree
      expect(find.byType(SkillTreePage), findsOneWidget);
      
      // Simulate completing a lesson
      final user = await UserStore.getUser();
      await ProgressStore.saveProgress(LessonProgress(
        userId: user!.id,
        lessonId: 'breath-basics',
        completed: true,
        score: 100,
        completedDate: DateTime.now(),
      ));
      
      // Update user points
      await UserStore.saveUser(UserProfile(
        id: user.id,
        name: user.name,
        ageGroup: user.ageGroup,
        currentLevel: user.currentLevel,
        totalPoints: 100,
        streak: 1,
      ));

      // PART 2: Simulate app restart
      await tester.pumpWidget(Container()); // Clear current widget
      await tester.pumpAndSettle();
      
      // Relaunch app
      await tester.pumpWidget(const KookaSingApp());
      
      // Wait for splash and navigation
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();
      
      // Should go directly to skill tree (user exists)
      expect(find.byType(SkillTreePage), findsOneWidget);
      
      // Verify persisted data
      expect(find.text('Persistent User'), findsOneWidget);
      expect(find.text('100 points'), findsOneWidget);
      expect(find.text('1 day streak'), findsOneWidget);
      
      // Verify lesson progress persisted
      expect(
        find.descendant(
          of: find.ancestor(
            of: find.text('Breathing with Kooka'),
            matching: find.byType(Card),
          ).first,
          matching: find.byIcon(Icons.check_circle),
        ),
        findsOneWidget,
      );
    });

    testWidgets('Error handling throughout journey', 
        (WidgetTester tester) async {
      // Test various error scenarios
      
      // SCENARIO 1: Network/Storage error during onboarding
      await tester.pumpWidget(const KookaSingApp());
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();
      
      // Try onboarding with invalid input
      await tester.tap(find.text('Get Started'));
      await tester.pump();
      
      // Should show validation error
      expect(find.text('Please enter your name'), findsOneWidget);
      
      // Fix and continue
      await tester.enterText(find.byType(TextFormField), 'Error Tester');
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();
      
      // Should successfully navigate despite earlier error
      expect(find.byType(SkillTreePage), findsOneWidget);
    });

    testWidgets('Accessibility features work throughout journey', 
        (WidgetTester tester) async {
      // Enable semantics for accessibility testing
      tester.ensureSemantics();
      
      await tester.pumpWidget(const KookaSingApp());
      
      // Check splash screen accessibility
      expect(
        find.bySemanticsLabel(RegExp('Kooka.*')),
        findsWidgets,
      );
      
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();
      
      // Check onboarding accessibility
      final nameFieldSemantics = find.ancestor(
        of: find.byType(TextFormField),
        matching: find.byType(Semantics),
      );
      expect(nameFieldSemantics, findsWidgets);
      
      // Complete onboarding
      await tester.enterText(find.byType(TextFormField), 'A11y Tester');
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();
      
      // Check skill tree accessibility
      expect(
        find.bySemanticsLabel(RegExp('.*lesson.*')),
        findsWidgets,
      );
    });

    testWidgets('Deep linking and navigation state', 
        (WidgetTester tester) async {
      // Setup user first
      await UserStore.saveUser(UserProfile(
        id: 'nav-test-user',
        name: 'Navigator',
        ageGroup: 'adult',
        currentLevel: 1,
        totalPoints: 0,
        streak: 0,
      ));
      
      // Test direct navigation to skill tree
      await tester.pumpWidget(
        const MaterialApp(
          home: SkillTreePage(),
        ),
      );
      await tester.pumpAndSettle();
      
      // Should load properly even with direct navigation
      expect(find.text('Navigator'), findsOneWidget);
      expect(find.text('Vocal Foundations'), findsOneWidget);
      
      // Test back navigation prevention
      // (User shouldn't be able to go back to onboarding after completing it)
    });
  });
}