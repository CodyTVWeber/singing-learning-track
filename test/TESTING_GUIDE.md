# Kooka Sing Testing Guide

## Overview

This guide provides comprehensive documentation for testing the Kooka Sing application, focusing on user flow tests that ensure the complete user experience works as expected.

## Testing Philosophy

Our testing approach follows these principles:

1. **User-Centric**: Tests simulate real user interactions and journeys
2. **Comprehensive**: Cover happy paths, edge cases, and error scenarios
3. **Maintainable**: Clear structure, reusable utilities, and good documentation
4. **Fast Feedback**: Quick test execution with clear failure messages

## Test Categories

### 1. Unit Tests
- Test individual functions and classes in isolation
- Located in `test/unit/`
- Fast execution, no UI rendering

### 2. Widget Tests
- Test individual widgets and their interactions
- Located in `test/widgets/`
- Use `WidgetTester` to interact with widgets

### 3. User Flow Tests
- Test complete user workflows
- Located in `test/user_flows/`
- Simulate real user journeys through the app

### 4. Integration Tests
- Test the entire application end-to-end
- Located in `test/integration_test/`
- Verify all components work together correctly

## Key User Flows

### 1. New User Onboarding Flow

```dart
// Test path: Splash → Onboarding → Profile Creation → Skill Tree
testWidgets('New user complete onboarding', (tester) async {
  // Launch app
  await tester.pumpWidget(KookaSingApp());
  
  // Wait for splash screen
  await tester.pumpAndSettle();
  
  // Should navigate to onboarding
  expect(find.byType(OnboardingPage), findsOneWidget);
  
  // Complete onboarding
  await tester.enterText(find.byType(TextFormField), 'User Name');
  await tester.tap(find.text('Get Started'));
  await tester.pumpAndSettle();
  
  // Should be on skill tree
  expect(find.byType(SkillTreePage), findsOneWidget);
});
```

### 2. Returning User Flow

```dart
// Test path: Splash → Skill Tree (with saved progress)
testWidgets('Returning user sees their progress', (tester) async {
  // Setup existing user
  await UserStore.saveUser(existingUser);
  
  // Launch app
  await tester.pumpWidget(KookaSingApp());
  await tester.pumpAndSettle();
  
  // Should skip onboarding
  expect(find.byType(SkillTreePage), findsOneWidget);
  
  // Verify saved progress is displayed
  expect(find.text('100 points'), findsOneWidget);
});
```

### 3. Lesson Progression Flow

```dart
// Test path: View lessons → Complete prerequisite → Unlock next
testWidgets('Lesson unlocking based on prerequisites', (tester) async {
  // Initially second lesson is locked
  expect(find.byIcon(Icons.lock), findsOneWidget);
  
  // Complete first lesson
  await completeLesson('breath-basics');
  
  // Second lesson should unlock
  expect(find.byIcon(Icons.lock), findsNothing);
});
```

## Testing Patterns

### 1. Page Object Pattern

Create reusable page objects for common interactions:

```dart
class OnboardingPageObject {
  final WidgetTester tester;
  
  OnboardingPageObject(this.tester);
  
  Future<void> enterName(String name) async {
    await tester.enterText(find.byType(TextFormField), name);
  }
  
  Future<void> selectAgeGroup(String ageGroup) async {
    await tester.tap(find.text(ageGroup));
  }
  
  Future<void> submit() async {
    await tester.tap(find.text('Get Started'));
    await tester.pumpAndSettle();
  }
}
```

### 2. Test Data Builders

Use builder pattern for test data:

```dart
class TestUserBuilder {
  String name = 'Test User';
  String ageGroup = 'kid';
  int points = 0;
  
  TestUserBuilder withName(String n) {
    name = n;
    return this;
  }
  
  TestUserBuilder withPoints(int p) {
    points = p;
    return this;
  }
  
  UserProfile build() {
    return UserProfile(
      name: name,
      ageGroup: ageGroup,
      totalPoints: points,
    );
  }
}
```

### 3. Custom Matchers

Create custom matchers for complex assertions:

```dart
Matcher hasCompletedLesson(String lessonId) {
  return predicate<SkillTreePage>((page) {
    final completed = page.completedLessons;
    return completed.contains(lessonId);
  }, 'has completed lesson $lessonId');
}
```

## Best Practices

### 1. Test Setup and Teardown

Always clean up after tests:

```dart
setUp(() async {
  await UserStore.init();
  await ProgressStore.init();
});

tearDown(() async {
  await UserStore.clearAll();
  await ProgressStore.clearAll();
});
```

### 2. Async Handling

Use proper async patterns:

```dart
// Good: Wait for animations
await tester.pumpAndSettle();

// Good: Wait for specific duration
await tester.pump(Duration(seconds: 2));

// Bad: Multiple pump() calls
await tester.pump();
await tester.pump();
await tester.pump();
```

### 3. Finding Widgets

Be specific when finding widgets:

```dart
// Good: Specific finder
final lessonCard = find.ancestor(
  of: find.text('Lesson Title'),
  matching: find.byType(Card),
).first;

// Bad: Too generic
final card = find.byType(Card).first;
```

### 4. Assertions

Use meaningful assertions:

```dart
// Good: Clear expectation
expect(
  find.text('Welcome to Kooka Sing!'),
  findsOneWidget,
  reason: 'Onboarding welcome message should be displayed',
);

// Bad: No context
expect(find.text('Welcome'), findsOneWidget);
```

## Common Testing Scenarios

### Testing Navigation

```dart
testWidgets('Navigate from splash to onboarding', (tester) async {
  await tester.pumpWidget(KookaSingApp());
  
  // Wait for splash animation
  await tester.pump(Duration(seconds: 3));
  await tester.pumpAndSettle();
  
  // Verify navigation occurred
  expect(find.byType(OnboardingPage), findsOneWidget);
});
```

### Testing Form Validation

```dart
testWidgets('Name field validation', (tester) async {
  // Leave field empty
  await tester.tap(find.text('Submit'));
  await tester.pump();
  
  // Check error message
  expect(find.text('Please enter your name'), findsOneWidget);
  
  // Enter valid name
  await tester.enterText(find.byType(TextFormField), 'Valid Name');
  await tester.pump();
  
  // Error should be gone
  expect(find.text('Please enter your name'), findsNothing);
});
```

### Testing State Persistence

```dart
testWidgets('User data persists across app restarts', (tester) async {
  // Create user
  await createTestUser(tester);
  
  // Restart app
  await tester.pumpWidget(Container());
  await tester.pumpWidget(KookaSingApp());
  await tester.pumpAndSettle();
  
  // Verify data persisted
  expect(find.text('Test User'), findsOneWidget);
});
```

### Testing Loading States

```dart
testWidgets('Shows loading during async operations', (tester) async {
  await tester.tap(find.text('Load Data'));
  await tester.pump();
  
  // Should show loading indicator
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
  
  // Wait for loading to complete
  await tester.pumpAndSettle();
  
  // Loading should be gone
  expect(find.byType(CircularProgressIndicator), findsNothing);
});
```

## Debugging Tests

### 1. Visual Debugging

```dart
// Print widget tree
debugDumpApp();

// Take screenshot (in golden tests)
await expectLater(
  find.byType(MyWidget),
  matchesGoldenFile('goldens/my_widget.png'),
);
```

### 2. Verbose Output

```dart
// Enable verbose test output
flutter test --verbose
```

### 3. Run Single Test

```dart
// Run specific test
flutter test test/user_flows/onboarding_flow_test.dart --name "Shows welcome message"
```

## Performance Testing

Monitor test execution time:

```dart
test('Performance: Onboarding completes quickly', () async {
  final stopwatch = Stopwatch()..start();
  
  await completeOnboarding();
  
  stopwatch.stop();
  expect(stopwatch.elapsedMilliseconds, lessThan(3000));
});
```

## Accessibility Testing

Ensure accessibility features work:

```dart
testWidgets('Screen reader can navigate onboarding', (tester) async {
  // Enable semantics
  tester.ensureSemantics();
  
  await tester.pumpWidget(OnboardingPage());
  
  // Check semantic labels
  expect(
    find.bySemanticsLabel('Enter your name'),
    findsOneWidget,
  );
  
  // Check traversal order
  final semantics = tester.getSemantics(find.byType(TextFormField));
  expect(semantics.label, contains('name'));
});
```

## Continuous Integration

Tests run automatically on:
- Every push to main/develop branches
- Every pull request
- Manual workflow dispatch

See `.github/workflows/user_flow_tests.yml` for CI configuration.

## Troubleshooting

### Common Issues and Solutions

1. **Test Timeouts**
   - Increase timeout: `flutter test --timeout 60s`
   - Use `pumpAndSettle()` instead of multiple `pump()`

2. **Flaky Tests**
   - Add proper waits for async operations
   - Mock external dependencies
   - Use `TestWidgetsFlutterBinding.ensureInitialized()`

3. **State Leakage**
   - Always clean up in `tearDown()`
   - Use fresh test data for each test
   - Reset singletons and static variables

4. **Widget Not Found**
   - Check if widget is in viewport
   - Ensure proper pump/settle after state changes
   - Use more specific finders

## Resources

- [Flutter Testing Documentation](https://flutter.dev/docs/testing)
- [Widget Testing Cookbook](https://flutter.dev/docs/cookbook/testing/widget)
- [Integration Testing Guide](https://flutter.dev/docs/testing/integration-tests)
- [Testing Best Practices](https://flutter.dev/docs/testing/best-practices)