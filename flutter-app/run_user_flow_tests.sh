#!/bin/bash

# Kooka Sing - User Flow Tests Runner Script
# This script runs all user flow tests for the Kooka Sing application

echo "🎵 Kooka Sing - Running User Flow Tests 🎵"
echo "========================================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    echo "Visit: https://docs.flutter.dev/get-started/install"
    exit 1
fi

echo "✓ Flutter found"
echo ""

# Get Flutter dependencies
echo "📦 Getting dependencies..."
flutter pub get

echo ""
echo "🧪 Running tests..."
echo ""

# Run tests with proper error handling
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo "▶️  Running: $test_name"
    if flutter test "$test_file"; then
        echo "✅ $test_name passed"
    else
        echo "❌ $test_name failed"
        FAILED_TESTS+=("$test_name")
    fi
    echo ""
}

# Array to track failed tests
FAILED_TESTS=()

# Run individual test suites
run_test "test/user_flows/splash_navigation_test.dart" "Splash Navigation Tests"
run_test "test/user_flows/onboarding_flow_test.dart" "Onboarding Flow Tests"
run_test "test/user_flows/skill_tree_flow_test.dart" "Skill Tree Flow Tests"
run_test "test/integration_test/complete_user_journey_test.dart" "Complete User Journey Tests"

echo "========================================="
echo "📊 Test Summary"
echo "========================================="

if [ ${#FAILED_TESTS[@]} -eq 0 ]; then
    echo "✅ All tests passed!"
    echo ""
    echo "🎉 Great job! The user flows are working correctly."
else
    echo "❌ Some tests failed:"
    for test in "${FAILED_TESTS[@]}"; do
        echo "  - $test"
    done
    echo ""
    echo "Please review the test output above for details."
    exit 1
fi

# Optional: Generate coverage report
echo ""
read -p "Generate coverage report? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📈 Generating coverage report..."
    flutter test --coverage
    echo "Coverage report generated in coverage/lcov.info"
    
    # If lcov is installed, generate HTML report
    if command -v genhtml &> /dev/null; then
        genhtml coverage/lcov.info -o coverage/html
        echo "HTML coverage report generated in coverage/html/"
        echo "Open coverage/html/index.html in a browser to view."
    fi
fi

echo ""
echo "🏁 Test run complete!"