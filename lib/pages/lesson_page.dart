import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/lesson.dart';
import '../models/user.dart';
import '../models/progress.dart';
import '../storage/progress_store.dart';
import '../storage/user_store.dart';
import '../widgets/kooka_mascot.dart';
import '../widgets/practice_interface.dart';
import '../data/units.dart';

enum LessonState { intro, practice, completion }

class LessonPage extends StatefulWidget {
  final String lessonId;

  const LessonPage({super.key, required this.lessonId});

  @override
  State<LessonPage> createState() => _LessonPageState();
}

class _LessonPageState extends State<LessonPage> {
  LessonState _currentState = LessonState.intro;
  Lesson? _lesson;
  UserProfile? _user;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadLessonData();
  }

  Future<void> _loadLessonData() async {
    try {
      final lesson = getLessonById(widget.lessonId);
      final user = await UserStore.getUser();
      
      if (mounted) {
        setState(() {
          _lesson = lesson;
          _user = user;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading lesson: $e'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    }
  }

  void _startLesson() {
    setState(() {
      _currentState = LessonState.practice;
    });
  }

  Future<void> _completeLesson() async {
    if (_user == null || _lesson == null) return;

    try {
      // Save progress
      final progress = LessonProgress(
        userId: _user!.id,
        lessonId: _lesson!.id,
        completed: true,
        score: 100, // Default score for now
        completedDate: DateTime.now(),
      );
      await ProgressStore.saveProgress(progress);

      // Update user points and streak
      final updatedUser = _user!.copyWith(
        totalPoints: _user!.totalPoints + 100,
        streak: _user!.streak + 1,
      );
      await UserStore.saveUser(updatedUser);

      if (mounted) {
        setState(() {
          _currentState = LessonState.completion;
          _user = updatedUser;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error completing lesson: $e'),
          backgroundColor: AppTheme.error,
        ),
      );
    }
  }

  void _continueToNext() {
    Navigator.of(context).pop(); // Return to skill tree
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFFAF7F2),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary),
          ),
        ),
      );
    }

    if (_lesson == null) {
      return Scaffold(
        backgroundColor: const Color(0xFFFAF7F2),
        appBar: AppBar(
          title: const Text('Lesson Not Found'),
          backgroundColor: AppTheme.primary,
        ),
        body: const Center(
          child: Text('Lesson not found'),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      appBar: AppBar(
        title: Text(_lesson!.title),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: _buildCurrentState(),
    );
  }

  Widget _buildCurrentState() {
    switch (_currentState) {
      case LessonState.intro:
        return _buildIntroState();
      case LessonState.practice:
        return _buildPracticeState();
      case LessonState.completion:
        return _buildCompletionState();
    }
  }

  Widget _buildIntroState() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Kooka mascot
          const KookaMascot(),
          
          const SizedBox(height: 40),
          
          // Lesson description
          Text(
            _lesson!.description,
            style: const TextStyle(
              fontSize: 18,
              color: AppTheme.text,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 40),
          
          // Start lesson button
          ElevatedButton(
            onPressed: _startLesson,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Start Lesson',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPracticeState() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Practice title
          const Text(
            'Practice Time!',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppTheme.primary,
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Practice instructions
          Text(
            'Take a deep breath and hold it',
            style: const TextStyle(
              fontSize: 18,
              color: AppTheme.text,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 40),
          
          // Practice interface
          const PracticeInterface(),
          
          const SizedBox(height: 40),
          
          // Complete button
          ElevatedButton(
            onPressed: _completeLesson,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.success,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'I\'m Ready!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCompletionState() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Success icon
          const Icon(
            Icons.check_circle,
            size: 120,
            color: AppTheme.success,
          ),
          
          const SizedBox(height: 40),
          
          // Congratulations message
          const Text(
            'Great Job!',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: AppTheme.success,
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Points earned
          Text(
            'You earned 100 points!',
            style: const TextStyle(
              fontSize: 20,
              color: AppTheme.text,
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Streak info
          if (_user != null && _user!.streak > 1)
            Text(
              '${_user!.streak} day streak!',
              style: const TextStyle(
                fontSize: 18,
                color: AppTheme.secondary,
                fontWeight: FontWeight.w600,
              ),
            ),
          
          const SizedBox(height: 40),
          
          // Continue button
          ElevatedButton(
            onPressed: _continueToNext,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Continue',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}