import 'package:flutter/material.dart';

class AppTheme {
  // Kookaburra-inspired colors
  static const Color primary = Color(0xFF8B6952); // Kookaburra brown
  static const Color secondary = Color(0xFF6FA8DC); // Sky blue
  static const Color background = Color(0xFFFAF7F2); // Warm cream
  static const Color surface = Color(0xFFFFFFFF); // Pure white
  static const Color darkBrown = Color(0xFF5D4037); // Dark feather brown
  static const Color text = Color(0xFF3E2723); // Deep brown text
  static const Color textLight = Color(0xFF6D4C41); // Light brown text
  static const Color success = Color(0xFF7CB342); // Eucalyptus green
  static const Color warning = Color(0xFFFFB74D); // Sunset orange
  static const Color error = Color(0xFFE57373); // Coral red
  static const Color featherLight = Color(0xFFD7CCC8); // Light feather
  static const Color skyLight = Color(0xFFBBDEFB); // Morning sky
  static const Color earthTone = Color(0xFFA1887F); // Earth brown
  
  // Additional Kookaburra theme colors
  static const Color kookaBlue = Color(0xFF4A90E2); // Kookaburra wing blue
  static const Color leafGreen = Color(0xFF8BC34A); // Gum tree leaf green
  static const Color barkBrown = Color(0xFF6D4C41); // Tree bark
  static const Color sunsetPink = Color(0xFFF8BBD0); // Australian sunset

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
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: text,
        ),
        displayMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: text,
        ),
        headlineLarge: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: text,
        ),
        headlineMedium: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: text,
        ),
        titleLarge: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: text,
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: text,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: text,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
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


