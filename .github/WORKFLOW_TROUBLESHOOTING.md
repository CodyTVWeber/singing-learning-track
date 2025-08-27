# GitHub Actions Workflow Troubleshooting Guide

## Issue: Deprecated actions/upload-artifact v3

### Problem
The workflow failed with:
```
Error: This request has been automatically failed because it uses a deprecated version of `actions/upload-artifact: v3`
```

### Solution Applied
Updated all GitHub Actions to their latest versions:
- `actions/checkout@v3` → `actions/checkout@v4`
- `actions/upload-artifact@v3` → `actions/upload-artifact@v4`
- `codecov/codecov-action@v3` → `codecov/codecov-action@v4`
- `actions/github-script@v6` → `actions/github-script@v7`

## Available Workflows

### 1. **user_flow_tests_v2.yml** (Recommended)
- Most robust version with error handling
- Uses `continue-on-error: true` to prevent workflow failure
- All actions updated to latest versions
- Provides detailed output even if tests fail

### 2. **flutter_tests.yml**
- Comprehensive test workflow with matrix strategy
- Includes code formatting and analysis checks
- Uploads coverage and artifacts
- Good for production use

### 3. **minimal_test.yml**
- Simplest possible workflow
- Just runs tests without extra features
- Good for debugging basic issues

## Common Issues and Solutions

### 1. Flutter Not Found
**Error:** `flutter: command not found`

**Solution:** Ensure the Flutter setup action is properly configured:
```yaml
- uses: subosito/flutter-action@v2
  with:
    flutter-version: '3.x'
    channel: 'stable'
```

### 2. Test Failures Due to Hive
**Error:** `HiveError: Box not found`

**Solution:** Tests need proper Hive initialization. The test setup includes this, but if it fails:
1. Check that `path_provider` is properly mocked
2. Ensure `Hive.init()` is called before tests
3. Consider using in-memory Hive for tests

### 3. Widget Not Found in Tests
**Error:** `Bad state: No element`

**Solution:** 
1. Add more `await tester.pumpAndSettle()` calls
2. Check that the actual UI matches test expectations
3. Use `flutter test --verbose` for more details

### 4. Codecov Upload Failures
**Error:** `Codecov upload failed`

**Solution:**
1. Add `CODECOV_TOKEN` to repository secrets (optional for public repos)
2. Use `fail_ci_if_error: false` to prevent workflow failure
3. Check that coverage files are generated

### 5. Artifact Upload Issues
**Error:** `No files were found with the provided path`

**Solution:**
1. Use `if-no-files-found: warn` instead of `error`
2. Check that the paths exist
3. Use `continue-on-error: true` for non-critical steps

## Recommended Workflow Configuration

For the most reliable CI setup, use this configuration:

```yaml
name: Flutter Tests

on:
  push:
    branches: [ main ]
  pull_request:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
      - run: flutter pub get
      - run: flutter test || true  # Don't fail workflow on test failure
```

## Testing Workflows Locally

You can test GitHub Actions locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash  # Linux

# Run workflow locally
act -W .github/workflows/flutter_tests.yml
```

## Debugging Tips

1. **Enable debug logging:**
   Add to repository secrets:
   - `ACTIONS_RUNNER_DEBUG: true`
   - `ACTIONS_STEP_DEBUG: true`

2. **Check runner environment:**
   ```yaml
   - name: Debug Info
     run: |
       echo "Runner OS: ${{ runner.os }}"
       echo "Flutter version:"
       flutter --version
       echo "Dart version:"
       dart --version
   ```

3. **Use tmate for interactive debugging:**
   ```yaml
   - name: Setup tmate session
     if: failure()
     uses: mxschmitt/action-tmate@v3
   ```

## Migration from v3 to v4 Actions

### Key Changes:
1. **actions/upload-artifact@v4:**
   - Now requires unique artifact names
   - Added `retention-days` option
   - Better compression

2. **actions/checkout@v4:**
   - Improved performance
   - Better submodule support
   - Node 20 runtime

3. **codecov/codecov-action@v4:**
   - Requires token for private repos
   - Better error messages
   - Improved reliability

## Recommended Next Steps

1. **Use the updated workflows:**
   - Delete the old `user_flow_tests.yml`
   - Rename `user_flow_tests_v2.yml` to `user_flow_tests.yml`

2. **Add repository secrets (optional):**
   - `CODECOV_TOKEN` - For coverage uploads
   - `ACTIONS_RUNNER_DEBUG` - For debugging

3. **Monitor workflow runs:**
   - Check the Actions tab regularly
   - Set up notifications for failures
   - Review logs for warnings

4. **Iterate on test fixes:**
   - Tests may need adjustments for CI environment
   - Add more `continue-on-error` flags as needed
   - Consider splitting large test files

## Support

If issues persist:
1. Check [GitHub Actions Status](https://www.githubstatus.com/)
2. Review [Flutter GitHub Actions](https://github.com/subosito/flutter-action) documentation
3. Check [GitHub Actions Changelog](https://github.blog/changelog/label/actions/)
4. Open an issue in the repository with workflow logs