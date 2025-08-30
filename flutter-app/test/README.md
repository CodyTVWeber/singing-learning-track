# Kooka Sing - User Flow Tests

This directory contains comprehensive user flow tests for the Kooka Sing application, ensuring all user journeys work correctly from app launch to lesson completion.

## Test Structure

```
test/
├── user_flows/                 # Individual user flow tests
│   ├── splash_navigation_test.dart    # Splash screen and initial navigation
│   ├── onboarding_flow_test.dart      # User onboarding process
│   └── skill_tree_flow_test.dart      # Skill tree navigation and interaction
├── integration_test/           # End-to-end integration tests
│   └── complete_user_journey_test.dart # Full user journey scenarios
├── test_helpers/              # Test utilities and helpers
│   ├── mock_storage.dart     # Mock storage implementations
│   └── test_data.dart        # Test data factories
├── widget_test.dart           # Basic widget tests
└── run_all_user_flow_tests.dart # Test runner for all flow tests
```

## Test Coverage

### 1. Splash Navigation Test (`splash_navigation_test.dart`)
- ✅ App launch and splash screen display
- ✅ Navigation to onboarding for new users
- ✅ Navigation to skill tree for returning users
- ✅ Loading states and animations
- ✅ Error handling during initialization

### 2. Onboarding Flow Test (`onboarding_flow_test.dart`)
- ✅ Welcome message and UI elements
- ✅ Name input validation
- ✅ Age group selection
- ✅ Profile creation and persistence
- ✅ Navigation to skill tree after completion
- ✅ Loading states during submission
- ✅ Input sanitization (whitespace trimming)
- ✅ Responsive layout

### 3. Skill Tree Flow Test (`skill_tree_flow_test.dart`)
- ✅ User profile display
- ✅ Units and lessons rendering
- ✅ Lesson ordering and hierarchy
- ✅ Lock/unlock states based on prerequisites
- ✅ Progress tracking and completion states
- ✅ Lesson type indicators
- ✅ Pull-to-refresh functionality
- ✅ Empty states and loading states

### 4. Complete User Journey Test (`complete_user_journey_test.dart`)
- ✅ New user complete flow: Splash → Onboarding → Skill Tree
- ✅ Returning user flow: Splash → Skill Tree with saved progress
- ✅ Progress persistence across app restarts
- ✅ Error handling throughout the journey
- ✅ Accessibility features
- ✅ Deep linking and navigation state

## Running Tests

### Run all tests
```bash
flutter test
```

### Run specific test file
```bash
flutter test test/user_flows/splash_navigation_test.dart
```

### Run all user flow tests
```bash
flutter test test/run_all_user_flow_tests.dart
```

### Run with coverage
```bash
flutter test --coverage
```

### Run integration tests
```bash
flutter test test/integration_test/complete_user_journey_test.dart
```

## Test Utilities

### Mock Storage (`test_helpers/mock_storage.dart`)
Provides mock implementations of `UserStore` and `ProgressStore` for testing without actual persistence.

### Test Data (`test_helpers/test_data.dart`)
Factory methods for creating test users, progress records, and common test scenarios.

## Key User Flows Tested

1. **First-time User Flow**
   - App launch → Splash screen → Onboarding → Profile creation → Skill tree

2. **Returning User Flow**
   - App launch → Splash screen → Skill tree with saved progress

3. **Lesson Progression Flow**
   - View locked lessons → Complete prerequisite → Unlock next lesson → Track progress

4. **Error Recovery Flow**
   - Handle initialization errors → Validation errors → Graceful fallbacks

## Best Practices

1. **Setup and Teardown**: Each test properly initializes and cleans up storage
2. **Isolation**: Tests don't depend on each other's state
3. **Realistic Scenarios**: Tests simulate actual user behavior
4. **Comprehensive Coverage**: Tests cover happy paths, edge cases, and error scenarios
5. **Accessibility**: Tests verify accessibility features work correctly

## Adding New Tests

When adding new features, ensure to:
1. Create corresponding user flow tests
2. Update integration tests if the feature affects the user journey
3. Add test data helpers if needed
4. Document the new tests in this README

## Troubleshooting

### Tests failing with "Storage not initialized"
Ensure `UserStore.init()` and `ProgressStore.init()` are called in `setUpAll()` or `setUp()`.

### Tests timing out
Increase timeout or use `pumpAndSettle()` instead of multiple `pump()` calls.

### Mock data not persisting
Check that mock storage is properly initialized and not being reset between test steps.

## CI/CD Integration

These tests are designed to run in CI/CD pipelines. Ensure your CI configuration includes:
```yaml
- flutter test --coverage
- flutter test test/integration_test/
```