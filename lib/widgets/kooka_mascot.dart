import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class KookaMascot extends StatelessWidget {
  const KookaMascot({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(100),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(100),
        child: Image.asset(
          'img/kooka-burra-waiving.png',
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              decoration: BoxDecoration(
                color: AppTheme.featherLight,
                borderRadius: BorderRadius.circular(100),
              ),
              child: const Icon(
                Icons.music_note,
                size: 80,
                color: AppTheme.primary,
              ),
            );
          },
        ),
      ),
    );
  }
}