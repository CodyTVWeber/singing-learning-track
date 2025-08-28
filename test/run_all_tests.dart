// Simple test runner to verify all tests compile
import 'simple_user_flow_test.dart' as simple_flow;
import 'lesson_page_test.dart' as lesson_page;
import 'lesson_flow_test.dart' as lesson_flow;
import 'visual_instruction_test.dart' as visual_instruction;
import 'widget_test.dart' as widget;
import 'basic_widget_test.dart' as basic_widget;

void main() {
  print('Running all tests...\n');
  
  print('1. Simple User Flow Tests');
  simple_flow.main();
  
  print('\n2. Lesson Page Widget Tests');
  lesson_page.main();
  
  print('\n3. Lesson Flow Integration Tests');
  lesson_flow.main();
  
  print('\n4. Visual Instruction Widget Tests');
  visual_instruction.main();
  
  print('\n5. Basic Widget Tests');
  basic_widget.main();
  
  print('\n6. Widget Tests');
  widget.main();
  
  print('\nAll test files imported successfully!');
}