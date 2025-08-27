import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/lesson.dart';
import '../theme/app_theme.dart';
import '../storage/progress_store.dart';
import 'skill_tree_page.dart';

class LessonPage extends StatefulWidget {
  final Lesson lesson;

  const LessonPage({super.key, required this.lesson});

  @override
  State<LessonPage> createState() => _LessonPageState();
}

class _LessonPageState extends State<LessonPage> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Map<String, dynamic> _content;
  int _currentStep = 0;
  bool _isCompleted = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    // Parse JSON content
    try {
      _content = json.decode(widget.lesson.content);
    } catch (e) {
      _content = {
        'steps': ['Start lesson'],
        'visual': widget.lesson.imageUrl,
        'audio': null,
      };
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < (_content['steps'] as List).length - 1) {
      setState(() {
        _currentStep++;
      });
    } else {
      _completeLesson();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  void _completeLesson() async {
    setState(() {
      _isCompleted = true;
    });
    
    // Save progress
    await ProgressStore.markLessonComplete(widget.lesson.id);
    
    // Show celebration
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          child: Container(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  '🎉',
                  style: TextStyle(fontSize: 64),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Great Job!',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.text,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'You finished ${widget.lesson.title}',
                  style: const TextStyle(
                    fontSize: 18,
                    color: AppTheme.textLight,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(
                        builder: (context) => const SkillTreePage(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: const Text(
                    'Next Lesson',
                    style: TextStyle(fontSize: 18, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
  }

  Widget _buildVisualElement() {
    final visualType = _content['visual'] ?? widget.lesson.imageUrl;
    
    // Animation for breathing exercise
    if (widget.lesson.id == 'breath-basics') {
      return AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          final scale = 0.8 + (_animationController.value * 0.4);
          return Container(
            height: 200,
            width: 200,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppTheme.accent.withOpacity(0.3),
            ),
            child: Transform.scale(
              scale: scale,
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.primary,
                ),
                child: const Center(
                  child: Text(
                    '🎈',
                    style: TextStyle(fontSize: 64),
                  ),
                ),
              ),
            ),
          );
        },
      );
    }
    
    // Pitch visualization
    if (widget.lesson.id == 'voice-discovery') {
      return SizedBox(
        height: 200,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildBirdIcon('🐣', 'High', 150),
            _buildBirdIcon('🦅', 'Low', 100),
          ],
        ),
      );
    }
    
    // Rhythm visualization
    if (widget.lesson.id == 'rhythm-clap') {
      return TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: 1),
        duration: const Duration(milliseconds: 500),
        builder: (context, value, child) {
          return Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '👏',
                style: TextStyle(
                  fontSize: 64 + (value * 20),
                ),
              ),
              const SizedBox(width: 20),
              Text(
                '👏',
                style: TextStyle(
                  fontSize: 64 + ((1 - value) * 20),
                ),
              ),
            ],
          );
        },
      );
    }
    
    // Animal sounds visualization
    if (widget.lesson.id == 'animal-sounds') {
      final animals = ['🐱', '🐶', '🐮'];
      final step = _currentStep < 3 ? _currentStep : 2;
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            animals[step],
            style: const TextStyle(fontSize: 100),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            decoration: BoxDecoration(
              color: AppTheme.accent.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              step == 0 ? 'MEOW' : step == 1 ? 'WOOF' : 'MOO',
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: AppTheme.primary,
              ),
            ),
          ),
        ],
      );
    }
    
    // Echo visualization
    if (widget.lesson.id == 'echo-game') {
      return Stack(
        alignment: Alignment.center,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: _currentStep == 2 ? 150 : 100,
            height: _currentStep == 2 ? 150 : 100,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppTheme.accent.withOpacity(0.3),
            ),
          ),
          const Text(
            '🔊',
            style: TextStyle(fontSize: 64),
          ),
        ],
      );
    }
    
    // Song visualization
    if (widget.lesson.type == 'song') {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.secondary, width: 3),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              widget.lesson.title,
              style: const TextStyle(fontSize: 48),
            ),
            const SizedBox(height: 16),
            const Icon(
              Icons.music_note,
              size: 64,
              color: AppTheme.primary,
            ),
          ],
        ),
      );
    }
    
    // Default visual
    return Container(
      height: 200,
      width: 200,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AppTheme.surface,
        border: Border.all(color: AppTheme.secondary, width: 3),
      ),
      child: const Center(
        child: Text(
          '🎵',
          style: TextStyle(fontSize: 64),
        ),
      ),
    );
  }

  Widget _buildBirdIcon(String emoji, String label, double height) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Container(
          height: height,
          alignment: Alignment.topCenter,
          child: Text(
            emoji,
            style: const TextStyle(fontSize: 48),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.text,
          ),
        ),
      ],
    );
  }

  Widget _buildInteractiveButton(String label, IconData icon, VoidCallback onTap) {
    return Material(
      color: AppTheme.accent,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, color: Colors.white, size: 28),
              const SizedBox(width: 12),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final steps = _content['steps'] as List<dynamic>;
    final currentStepText = steps[_currentStep];

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(widget.lesson.title),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Progress indicator
              LinearProgressIndicator(
                value: (_currentStep + 1) / steps.length,
                backgroundColor: AppTheme.surface,
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.success),
                minHeight: 8,
              ),
              const SizedBox(height: 32),
              
              // Visual element
              Expanded(
                flex: 3,
                child: Center(
                  child: _buildVisualElement(),
                ),
              ),
              
              // Current step instruction
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.secondary, width: 2),
                ),
                child: Text(
                  currentStepText,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.text,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 24),
              
              // Interactive buttons based on lesson type
              if (widget.lesson.type == 'practice')
                _buildInteractiveButton(
                  'Practice',
                  Icons.play_arrow,
                  () {
                    // Trigger animation or sound
                  },
                ),
              
              if (widget.lesson.type == 'sound')
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildInteractiveButton(
                      'Listen',
                      Icons.hearing,
                      () {
                        // Play sound
                      },
                    ),
                    const SizedBox(width: 16),
                    _buildInteractiveButton(
                      'Record',
                      Icons.mic,
                      () {
                        // Record voice
                      },
                    ),
                  ],
                ),
              
              if (widget.lesson.type == 'song')
                _buildInteractiveButton(
                  'Play Song',
                  Icons.music_note,
                  () {
                    // Play song
                  },
                ),
              
              const SizedBox(height: 32),
              
              // Navigation buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Back button
                  if (_currentStep > 0)
                    IconButton(
                      onPressed: _previousStep,
                      icon: const Icon(Icons.arrow_back),
                      iconSize: 32,
                      color: AppTheme.primary,
                    )
                  else
                    const SizedBox(width: 48),
                  
                  // Step counter
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppTheme.featherLight,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${_currentStep + 1} / ${steps.length}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.text,
                      ),
                    ),
                  ),
                  
                  // Next button
                  IconButton(
                    onPressed: _nextStep,
                    icon: Icon(
                      _currentStep < steps.length - 1
                          ? Icons.arrow_forward
                          : Icons.check_circle,
                    ),
                    iconSize: 32,
                    color: _currentStep < steps.length - 1
                        ? AppTheme.primary
                        : AppTheme.success,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}