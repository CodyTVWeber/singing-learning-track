import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';
import '../models/lesson.dart';
import '../models/progress.dart';
import '../models/user.dart';
import '../storage/user_store.dart';
import '../storage/progress_store.dart';
import '../widgets/kooka_button.dart';
import '../widgets/kooka_mascot.dart';
import '../widgets/progress_bar.dart';

class LessonPage extends StatefulWidget {
  final Lesson lesson;

  const LessonPage({
    super.key,
    required this.lesson,
  });

  @override
  State<LessonPage> createState() => _LessonPageState();
}

class _LessonPageState extends State<LessonPage> {
  final _userStore = UserStore();
  final _progressStore = ProgressStore();
  
  UserProfile? _user;
  int _currentStep = 0;
  final int _totalSteps = 3; // Intro, Practice, Complete
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _initializeStores();
  }

  Future<void> _initializeStores() async {
    await _userStore.init();
    await _progressStore.init();
    final user = await _userStore.getUser();
    if (mounted) {
      setState(() => _user = user);
    }
  }

  Widget _buildIntroStep() {
    return Column(
      children: [
        const KookaMascot(
          state: KookaState.waving,
          size: 120,
        ),
        const SizedBox(height: 24),
        Text(
          widget.lesson.title,
          style: Theme.of(context).textTheme.headlineLarge,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.skyLight.withOpacity(0.3),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.secondary, width: 2),
          ),
          child: Column(
            children: [
              Icon(
                _getLessonIcon(),
                size: 48,
                color: AppTheme.secondary,
              ),
              const SizedBox(height: 12),
              Text(
                widget.lesson.description,
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Text(
          'What you\'ll learn:',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.earthTone),
          ),
          child: Text(
            widget.lesson.content,
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }

  Widget _buildPracticeStep() {
    return Column(
      children: [
        const KookaMascot(
          state: KookaState.singing,
          size: 120,
          showBubble: true,
          bubbleText: "Let's practice together!",
        ),
        const SizedBox(height: 32),
        Text(
          'Practice Time!',
          style: Theme.of(context).textTheme.headlineLarge,
        ),
        const SizedBox(height: 24),
        
        // Practice content based on lesson type
        if (widget.lesson.type == 'practice') ...[
          _buildBreathingPractice(),
        ] else if (widget.lesson.type == 'sound') ...[
          _buildSoundPractice(),
        ] else if (widget.lesson.type == 'song') ...[
          _buildSongPractice(),
        ],
      ],
    );
  }

  Widget _buildBreathingPractice() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.leafGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.leafGreen, width: 2),
      ),
      child: Column(
        children: [
          Icon(
            Icons.air,
            size: 64,
            color: AppTheme.leafGreen,
          ),
          const SizedBox(height: 16),
          Text(
            'Breathing Exercise',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          Text(
            '1. Put your hand on your belly\n'
            '2. Breathe in slowly through your nose\n'
            '3. Feel your belly expand like a balloon\n'
            '4. Breathe out slowly through your mouth\n'
            '5. Repeat 5 times',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 24),
          Text(
            'Imagine you\'re smelling a beautiful eucalyptus leaf!',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              fontStyle: FontStyle.italic,
              color: AppTheme.textLight,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSoundPractice() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.kookaBlue.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.kookaBlue, width: 2),
      ),
      child: Column(
        children: [
          Icon(
            Icons.record_voice_over,
            size: 64,
            color: AppTheme.kookaBlue,
          ),
          const SizedBox(height: 16),
          Text(
            'Voice Range Practice',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _VoiceRangeCard(
                title: 'High',
                subtitle: 'Baby Kooka',
                icon: Icons.arrow_upward,
                color: AppTheme.sunsetPink,
              ),
              _VoiceRangeCard(
                title: 'Middle',
                subtitle: 'Mama Kooka',
                icon: Icons.horizontal_rule,
                color: AppTheme.secondary,
              ),
              _VoiceRangeCard(
                title: 'Low',
                subtitle: 'Papa Kooka',
                icon: Icons.arrow_downward,
                color: AppTheme.barkBrown,
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            'Try making sounds in each voice range!',
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSongPractice() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.sunsetPink.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.sunsetPink, width: 2),
      ),
      child: Column(
        children: [
          Icon(
            Icons.music_note,
            size: 64,
            color: AppTheme.primary,
          ),
          const SizedBox(height: 16),
          Text(
            'Kookaburra Song',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              'Kookaburra sits in the old gum tree\n'
              'Merry, merry king of the bush is he\n'
              'Laugh, Kookaburra!\n'
              'Laugh, Kookaburra!\n'
              'Gay your life must be',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                fontSize: 18,
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Practice singing along with Kooka!',
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildCompleteStep() {
    return Column(
      children: [
        const KookaMascot(
          state: KookaState.celebrating,
          size: 150,
          showBubble: true,
          bubbleText: "You're amazing!",
        ),
        const SizedBox(height: 32),
        Text(
          'Lesson Complete!',
          style: Theme.of(context).textTheme.displayMedium?.copyWith(
            color: AppTheme.success,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppTheme.success.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.success, width: 2),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.star, color: AppTheme.warning, size: 32),
                  const SizedBox(width: 8),
                  Text(
                    '+10 Points',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: AppTheme.success,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Icon(Icons.star, color: AppTheme.warning, size: 32),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                'Great job completing ${widget.lesson.title}!',
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _nextStep() async {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
    } else {
      // Complete the lesson
      await _completeLesson();
    }
  }

  Future<void> _completeLesson() async {
    if (_user == null) return;

    setState(() => _isLoading = true);

    try {
      // Save progress
      final progress = LessonProgress(
        userId: _user!.id,
        lessonId: widget.lesson.id,
        completed: true,
        score: 10,
        completedDate: DateTime.now(),
      );
      await _progressStore.saveProgress(progress);

      // Update user points
      final updatedUser = _user!.copyWith(
        totalPoints: _user!.totalPoints + 10,
      );
      await _userStore.saveUser(updatedUser);

      if (mounted) {
        // Show completion for a moment before navigating
        await Future.delayed(const Duration(seconds: 2));
        context.go('/skill-tree');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error saving progress: ${e.toString()}'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  IconData _getLessonIcon() {
    switch (widget.lesson.type) {
      case 'practice':
        return Icons.air;
      case 'sound':
        return Icons.record_voice_over;
      case 'song':
        return Icons.music_note;
      default:
        return Icons.school;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.go('/skill-tree'),
        ),
        title: Text('Level ${widget.lesson.level}'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: ProgressBar(
                value: (_currentStep + 1) / _totalSteps,
                height: 8,
              ),
            ),
            
            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _currentStep == 0
                      ? _buildIntroStep()
                      : _currentStep == 1
                          ? _buildPracticeStep()
                          : _buildCompleteStep(),
                ),
              ),
            ),
            
            // Bottom button
            Padding(
              padding: const EdgeInsets.all(24),
              child: KookaButton(
                text: _currentStep < _totalSteps - 1 ? 'Continue' : 'Complete',
                onPressed: _nextStep,
                isLarge: true,
                isLoading: _isLoading,
                icon: _currentStep < _totalSteps - 1
                    ? Icons.arrow_forward
                    : Icons.check_circle,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _VoiceRangeCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _VoiceRangeCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color, width: 2),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 12,
              color: color.withOpacity(0.8),
            ),
          ),
        ],
      ),
    );
  }
}