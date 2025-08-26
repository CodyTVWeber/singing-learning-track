/// Run all user flow tests for Kooka Sing app
/// 
/// This file imports and runs all user flow tests to ensure
/// the complete user experience works as expected.
/// 
/// Run with: flutter test test/run_all_user_flow_tests.dart

import 'user_flows/splash_navigation_test.dart' as splash_test;
import 'user_flows/onboarding_flow_test.dart' as onboarding_test;
import 'user_flows/skill_tree_flow_test.dart' as skill_tree_test;
import 'integration_test/complete_user_journey_test.dart' as journey_test;

void main() {
  // Run all user flow tests
  splash_test.main();
  onboarding_test.main();
  skill_tree_test.main();
  journey_test.main();
}