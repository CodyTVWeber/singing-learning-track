import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/main.dart';
import 'package:kooka_sing/pages/splash_page.dart';
import 'package:kooka_sing/pages/onboarding_page.dart';
import 'package:kooka_sing/pages/skill_tree_page.dart';
import 'package:kooka_sing/storage/user_store.dart';
import 'package:kooka_sing/storage/progress_store.dart';
import '../test_helpers/test_data.dart';
import '../test_helpers/test_setup.dart';

void main() {
  group('Splash Screen Navigation Flow', () {
    setUpAll(() async {
      await setupTestHive();
    });

    tearDownAll(() async {
      await teardownTestHive();
    });

    testWidgets('Shows splash screen on app launch', (WidgetTester tester) async {
      // Build the app
      await tester.pumpWidget(const KookaSingApp());

      // Verify splash screen is displayed
      expect(find.byType(SplashPage), findsOneWidget);
      expect(find.text('Kooka Sing'), findsOneWidget);
      expect(find.text('Learn to sing with your Kookaburra friend!'), findsOneWidget);
      
      // Check for Kooka image
      expect(find.byType(Image), findsWidgets);
    });

    testWidgets('Navigates to onboarding for new users', (WidgetTester tester) async {
      // Ensure no existing user
      await UserStore.init();
      await ProgressStore.init();
      await UserStore.clearAll();

      // Build the app
      await tester.pumpWidget(const KookaSingApp());

      // Wait for splash screen animation and navigation
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      // Should navigate to onboarding page
      expect(find.byType(OnboardingPage), findsOneWidget);
      expect(find.text('Welcome to Kooka Sing!'), findsOneWidget);
    });

    testWidgets('Navigates to skill tree for returning users', (WidgetTester tester) async {
      // Setup returning user
      await UserStore.init();
      await ProgressStore.init();
      final user = TestData.returningUser;
      await UserStore.saveUser(user);

      // Build the app
      await tester.pumpWidget(const KookaSingApp());

      // Wait for splash screen animation and navigation
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      // Should navigate to skill tree page
      expect(find.byType(SkillTreePage), findsOneWidget);
      
      // Should display user info
      expect(find.text(user.name), findsOneWidget);
      expect(find.text('${user.totalPoints} points'), findsOneWidget);
    });

    testWidgets('Shows loading indicator during initialization', (WidgetTester tester) async {
      // Build the app
      await tester.pumpWidget(const KookaSingApp());

      // Initially should show loading
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      
      // Wait a bit
      await tester.pump(const Duration(milliseconds: 500));
      
      // Still loading
      expect(find.byType(SplashPage), findsOneWidget);
    });

    testWidgets('Handles initialization errors gracefully', (WidgetTester tester) async {
      // Create a test widget that simulates error
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (context) {
              // Simulate initialization error
              Future.delayed(Duration.zero, () {
                // This would be where error handling happens
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Error initializing app'),
                    backgroundColor: Colors.red,
                  ),
                );
              });
              return const SplashPage();
            },
          ),
        ),
      );

      await tester.pump();
      await tester.pump(const Duration(seconds: 1));

      // Should still show splash page (not crash)
      expect(find.byType(SplashPage), findsOneWidget);
    });

    testWidgets('Splash screen animation plays correctly', (WidgetTester tester) async {
      // Build the app
      await tester.pumpWidget(const KookaSingApp());

      // Check initial opacity (should be fading in)
      final fadeTransition = tester.widget<FadeTransition>(
        find.byType(FadeTransition).first,
      );
      expect(fadeTransition.opacity.value, lessThan(1.0));

      // Pump to progress animation
      await tester.pump(const Duration(seconds: 1));
      
      // Should be more visible
      expect(fadeTransition.opacity.value, greaterThan(0.0));

      // Complete animation
      await tester.pump(const Duration(seconds: 1));
      await tester.pumpAndSettle();
    });
  });
}