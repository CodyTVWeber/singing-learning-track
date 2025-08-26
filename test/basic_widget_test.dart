import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/theme/app_theme.dart';

void main() {
  testWidgets('Basic app loads', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.themeData(),
        home: const Scaffold(
          body: Center(
            child: Text('Kooka Sing'),
          ),
        ),
      ),
    );

    expect(find.text('Kooka Sing'), findsOneWidget);
  });
}