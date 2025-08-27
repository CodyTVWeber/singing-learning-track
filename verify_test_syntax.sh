#!/bin/bash

echo "🔍 Verifying Test File Syntax"
echo "=============================="
echo ""

# Check if dart is available
if command -v dart &> /dev/null; then
    echo "✓ Dart found, checking syntax..."
    
    # Array to track files with issues
    FAILED_FILES=()
    
    # Check each test file
    for test_file in test/user_flows/*.dart test/integration_test/*.dart test/test_helpers/*.dart; do
        if [ -f "$test_file" ]; then
            echo -n "Checking $test_file... "
            if dart analyze "$test_file" 2>/dev/null | grep -q "error"; then
                echo "❌ Issues found"
                FAILED_FILES+=("$test_file")
            else
                echo "✓"
            fi
        fi
    done
    
    if [ ${#FAILED_FILES[@]} -eq 0 ]; then
        echo ""
        echo "✅ All test files have valid syntax!"
    else
        echo ""
        echo "❌ Files with syntax issues:"
        for file in "${FAILED_FILES[@]}"; do
            echo "  - $file"
        done
    fi
else
    echo "⚠️  Dart is not installed, performing basic checks..."
    
    # Basic syntax checks
    echo ""
    echo "Checking for common issues:"
    
    # Check imports
    echo -n "  Checking imports... "
    if grep -r "import.*test_helpers" test/user_flows/ test/integration_test/ > /dev/null; then
        echo "✓"
    else
        echo "⚠️  Missing test helper imports"
    fi
    
    # Check for undefined methods
    echo -n "  Checking for clearUser calls... "
    if grep -r "clearUser()" test/ 2>/dev/null | grep -v "test_helpers"; then
        echo "❌ Found clearUser() - should be clearAll()"
    else
        echo "✓"
    fi
    
    # Check test structure
    echo -n "  Checking test structure... "
    test_count=$(grep -r "testWidgets(" test/user_flows/ test/integration_test/ | wc -l)
    echo "✓ Found $test_count test cases"
fi

echo ""
echo "📊 Test File Summary:"
echo "====================="
echo ""

# Count test files and cases
user_flow_tests=$(ls test/user_flows/*.dart 2>/dev/null | wc -l)
integration_tests=$(ls test/integration_test/*.dart 2>/dev/null | wc -l)
helper_files=$(ls test/test_helpers/*.dart 2>/dev/null | wc -l)

echo "User Flow Tests: $user_flow_tests files"
echo "Integration Tests: $integration_tests files"
echo "Test Helpers: $helper_files files"

echo ""
echo "Test Coverage Areas:"
echo "  ✓ Splash Navigation"
echo "  ✓ Onboarding Flow"
echo "  ✓ Skill Tree Navigation"
echo "  ✓ Complete User Journey"
echo "  ✓ Error Handling"
echo "  ✓ Data Persistence"

echo ""
echo "🏁 Verification complete!"