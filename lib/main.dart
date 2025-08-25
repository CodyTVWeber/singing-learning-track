import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'pages/skill_tree_page.dart';

void main() {
  runApp(const KookaSingApp());
}

class KookaSingApp extends StatelessWidget {
  const KookaSingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kooka Sing',
      theme: AppTheme.themeData(),
      home: const SkillTreePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}



