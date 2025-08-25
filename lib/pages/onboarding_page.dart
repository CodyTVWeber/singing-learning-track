import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';
import '../models/user.dart';
import '../storage/user_store.dart';
import '../widgets/kooka_button.dart';
import '../widgets/kooka_mascot.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _nameController = TextEditingController();
  String _selectedAgeGroup = 'kid';
  bool _isLoading = false;
  final _userStore = UserStore();

  @override
  void initState() {
    super.initState();
    _initStorage();
  }

  Future<void> _initStorage() async {
    await _userStore.init();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _completeOnboarding() async {
    if (_nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your name'),
          backgroundColor: AppTheme.warning,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final user = UserProfile(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text.trim(),
        ageGroup: _selectedAgeGroup,
        currentLevel: 1,
        totalPoints: 0,
        streak: 0,
      );

      await _userStore.saveUser(user);
      
      if (mounted) {
        context.go('/skill-tree');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              const KookaMascot(
                state: KookaState.waving,
                size: 150,
                showBubble: true,
                bubbleText: "G'day! I'm Kooka!",
              ),
              const SizedBox(height: 40),
              Text(
                'Welcome to Kooka Sing!',
                style: Theme.of(context).textTheme.displayMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Let\'s start your singing journey together!',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppTheme.textLight,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // Name input
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'What\'s your name?',
                  hintText: 'Enter your name',
                  filled: true,
                  fillColor: AppTheme.surface,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AppTheme.primary, width: 2),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AppTheme.primary, width: 2),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AppTheme.secondary, width: 2),
                  ),
                  labelStyle: TextStyle(color: AppTheme.text),
                ),
                style: const TextStyle(fontSize: 18),
              ),
              
              const SizedBox(height: 32),
              
              // Age group selection
              Text(
                'Who\'s learning to sing?',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),
              
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  _AgeGroupCard(
                    title: 'Kid',
                    subtitle: 'Ages 5-12',
                    icon: Icons.child_care,
                    value: 'kid',
                    groupValue: _selectedAgeGroup,
                    onChanged: (value) => setState(() => _selectedAgeGroup = value!),
                  ),
                  _AgeGroupCard(
                    title: 'Teen',
                    subtitle: 'Ages 13-17',
                    icon: Icons.school,
                    value: 'teen',
                    groupValue: _selectedAgeGroup,
                    onChanged: (value) => setState(() => _selectedAgeGroup = value!),
                  ),
                  _AgeGroupCard(
                    title: 'Adult',
                    subtitle: 'Ages 18+',
                    icon: Icons.person,
                    value: 'adult',
                    groupValue: _selectedAgeGroup,
                    onChanged: (value) => setState(() => _selectedAgeGroup = value!),
                  ),
                ],
              ),
              
              const SizedBox(height: 48),
              
              KookaButton(
                text: 'Start Singing!',
                onPressed: _completeOnboarding,
                isLarge: true,
                isLoading: _isLoading,
                icon: Icons.music_note,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _AgeGroupCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String value;
  final String groupValue;
  final ValueChanged<String?> onChanged;

  const _AgeGroupCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.value,
    required this.groupValue,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = value == groupValue;
    
    return GestureDetector(
      onTap: () => onChanged(value),
      child: Container(
        width: 160,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary : AppTheme.surface,
          border: Border.all(
            color: AppTheme.primary,
            width: 2,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppTheme.primary.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [],
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 40,
              color: isSelected ? Colors.white : AppTheme.primary,
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : AppTheme.text,
              ),
            ),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 14,
                color: isSelected ? Colors.white70 : AppTheme.textLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}