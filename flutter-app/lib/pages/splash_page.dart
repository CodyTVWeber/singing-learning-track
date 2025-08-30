import 'package:flutter/material.dart';
import '../storage/user_store.dart';
import '../storage/progress_store.dart';
import '../theme/app_theme.dart';
import 'onboarding_page.dart';
import 'skill_tree_page.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimation();
    _initializeApp();
  }

  void _setupAnimation() {
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    _animationController.forward();
  }

  Future<void> _initializeApp() async {
    try {
      // Initialize storage
      await UserStore.init();
      await ProgressStore.init();
      
      // Wait for animation to complete
      await Future.delayed(const Duration(seconds: 3));
      
      // Check if user exists
      final hasUser = await UserStore.hasUser();
      
      if (mounted) {
        if (hasUser) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const SkillTreePage()),
          );
        } else {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const OnboardingPage()),
          );
        }
      }
    } catch (e) {
      // Handle initialization error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error initializing app: $e'),
            backgroundColor: AppTheme.error,
          ),
        );
        
        // Fallback to onboarding
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const OnboardingPage()),
        );
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Kookaburra image
              Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(100),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primary.withValues(alpha: 0.3),
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
              ),
              
              const SizedBox(height: 40),
              
              // App title
              const Text(
                'Kooka Sing',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primary,
                  letterSpacing: 1.5,
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Subtitle
              const Text(
                'Learn to sing with your Kookaburra friend!',
                style: TextStyle(
                  fontSize: 18,
                  color: AppTheme.textLight,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 60),
              
              // Loading indicator
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary),
                strokeWidth: 3,
              ),
            ],
          ),
        ),
      ),
    );
  }
}