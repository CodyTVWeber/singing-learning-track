import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Color(0xFF8B6952);
  static const Color secondary = Color(0xFF6FA8DC);
  static const Color background = Color(0xFFFAF7F2);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color darkBrown = Color(0xFF5D4037);
  static const Color text = Color(0xFF3E2723);
  static const Color textLight = Color(0xFF6D4C41);
  static const Color success = Color(0xFF7CB342);
  static const Color warning = Color(0xFFFFB74D);
  static const Color error = Color(0xFFE57373);
  static const Color featherLight = Color(0xFFD7CCC8);
  static const Color skyLight = Color(0xFFBBDEFB);
  static const Color earthTone = Color(0xFFA1887F);

  static ThemeData themeData() {
    return ThemeData(
      colorScheme: const ColorScheme.light(
        primary: primary,
        secondary: secondary,
        surface: surface,
        background: background,
        error: error,
      ),
      scaffoldBackgroundColor: background,
      useMaterial3: true,
      textTheme: const TextTheme(
        bodyMedium: TextStyle(color: text),
      ),
    );
  }
}

class Spacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
}


