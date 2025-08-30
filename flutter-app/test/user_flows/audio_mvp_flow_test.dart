import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kooka_sing/pages/practice_page.dart';

void main() {
  group('WS5 Audio MVP - User Flow', () {
    testWidgets('record → stop → play shows basic pitch hint', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: PracticePage(),
        ),
      );

      // Initial state: record button is visible
      expect(find.text('Record'), findsOneWidget);

      // Start recording
      await tester.tap(find.text('Record'));
      await tester.pump();

      // While recording, a Stop button should appear
      expect(find.text('Stop'), findsOneWidget);

      // Stop recording
      await tester.tap(find.text('Stop'));
      await tester.pumpAndSettle();

      // After stopping, playback should be possible and a pitch hint is shown
      expect(find.text('Play'), findsOneWidget);
      expect(find.byKey(const Key('pitch-hint')), findsOneWidget);
      expect(find.textContaining('Pitch:'), findsOneWidget);

      // Play back the recording (no error should occur)
      await tester.tap(find.text('Play'));
      await tester.pump();
    });
  });
}

