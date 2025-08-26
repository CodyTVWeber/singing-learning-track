import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:path/path.dart' as path;
import 'dart:io';

/// Setup test environment for Hive
Future<void> setupTestHive() async {
  TestWidgetsFlutterBinding.ensureInitialized();
  
  // Create a temporary directory for Hive
  final tempDir = await Directory.systemTemp.createTemp('hive_test_');
  
  // Initialize Hive with the temp directory
  Hive.init(tempDir.path);
  
  // Mock the path_provider plugin
  const MethodChannel channel = MethodChannel('plugins.flutter.io/path_provider');
  TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
      .setMockMethodCallHandler(channel, (MethodCall methodCall) async {
    switch (methodCall.method) {
      case 'getApplicationDocumentsDirectory':
        return tempDir.path;
      case 'getApplicationSupportDirectory':
        return tempDir.path;
      case 'getTemporaryDirectory':
        return tempDir.path;
      default:
        return null;
    }
  });
}

/// Clean up Hive after tests
Future<void> teardownTestHive() async {
  await Hive.close();
  // Clean up all boxes
  try {
    await Hive.deleteFromDisk();
  } catch (_) {
    // Ignore errors during cleanup
  }
}