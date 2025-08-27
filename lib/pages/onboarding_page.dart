import 'package:flutter/material.dart';
import '../storage/user_store.dart';
import '../theme/app_theme.dart';
import 'skill_tree_page.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  String _selectedAgeGroup = 'kid';
  bool _isLoading = false;

  final List<Map<String, dynamic>> _ageGroups = [
    {
      'value': 'kid',
      'label': 'Kid (3-12)',
      'icon': Icons.child_care,
      'description': 'Fun and playful learning',
    },
    {
      'value': 'teen',
      'label': 'Teen (13-17)',
      'icon': Icons.school,
      'description': 'Building confidence and skills',
    },
    {
      'value': 'adult',
      'label': 'Adult (18+)',
      'icon': Icons.person,
      'description': 'Learning at your own pace',
    },
  ];

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _completeOnboarding() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Create user profile
      await UserStore.createUser(
        name: _nameController.text.trim(),
        ageGroup: _selectedAgeGroup,
      );

      // Navigate to skill tree
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const SkillTreePage()),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error creating profile: $e'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                
                // Kookaburra welcome
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(60),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primary.withValues(alpha: 0.2),
                              blurRadius: 15,
                              spreadRadius: 3,
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(60),
                          child: Image.asset(
                            'img/kooka-burra-waiving.png',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                decoration: BoxDecoration(
                                  color: AppTheme.featherLight,
                                  borderRadius: BorderRadius.circular(60),
                                ),
                                child: const Icon(
                                  Icons.music_note,
                                  size: 50,
                                  color: AppTheme.primary,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      const Text(
                        'Welcome to Kooka Sing!',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primary,
                        ),
                      ),
                      
                      const SizedBox(height: 8),
                      
                      const Text(
                        'Let\'s get to know you so we can personalize your singing journey!',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppTheme.textLight,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // Name input
                const Text(
                  'What\'s your name?',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.text,
                  ),
                ),
                
                const SizedBox(height: 12),
                
                TextFormField(
                  controller: _nameController,
                  decoration: InputDecoration(
                    hintText: 'Enter your name',
                    filled: true,
                    fillColor: AppTheme.surface,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: AppTheme.primary, width: 2),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 16,
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter your name';
                    }
                    if (value.trim().length < 2) {
                      return 'Name must be at least 2 characters';
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: 32),
                
                // Age group selection
                const Text(
                  'Which age group describes you?',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.text,
                  ),
                ),
                
                const SizedBox(height: 16),
                
                ...(_ageGroups.map((group) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Card(
                    color: _selectedAgeGroup == group['value'] 
                        ? AppTheme.primary.withValues(alpha: 0.1)
                        : AppTheme.surface,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: _selectedAgeGroup == group['value']
                            ? AppTheme.primary
                            : AppTheme.featherLight,
                        width: _selectedAgeGroup == group['value'] ? 2 : 1,
                      ),
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () {
                        setState(() {
                          _selectedAgeGroup = group['value'];
                        });
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Icon(
                              group['icon'],
                              color: _selectedAgeGroup == group['value']
                                  ? AppTheme.primary
                                  : AppTheme.textLight,
                              size: 28,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    group['label'],
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: _selectedAgeGroup == group['value']
                                          ? AppTheme.primary
                                          : AppTheme.text,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    group['description'],
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: _selectedAgeGroup == group['value']
                                          ? AppTheme.primary.withValues(alpha: 0.8)
                                          : AppTheme.textLight,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (_selectedAgeGroup == group['value'])
                              const Icon(
                                Icons.check_circle,
                                color: AppTheme.primary,
                                size: 24,
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ))),
                
                const SizedBox(height: 24),
                
                // Continue button
                ElevatedButton(
                  onPressed: _isLoading ? null : _completeOnboarding,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 3,
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text(
                          'Start Your Singing Journey!',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                ),
                
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
      ),
    );
  }
}