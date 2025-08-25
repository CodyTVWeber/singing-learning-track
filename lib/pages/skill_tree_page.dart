import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';
import '../data/units.dart';
import '../models/user.dart';
import '../storage/user_store.dart';
import '../storage/progress_store.dart';
import '../widgets/kooka_mascot.dart';

class SkillTreePage extends StatefulWidget {
  const SkillTreePage({super.key});

  @override
  State<SkillTreePage> createState() => _SkillTreePageState();
}

class _SkillTreePageState extends State<SkillTreePage> {
  final _userStore = UserStore();
  final _progressStore = ProgressStore();
  
  UserProfile? _user;
  List<String> _completed = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    await _userStore.init();
    await _progressStore.init();
    
    final user = await _userStore.getUser();
    if (user != null) {
      final completed = await _progressStore.getCompletedLessonIds(user.id);
      if (mounted) {
        setState(() {
          _user = user;
          _completed = completed;
          _isLoading = false;
        });
      }
    } else {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    final units = getAllUnits();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Journey with Kooka'),
        backgroundColor: AppTheme.background,
        elevation: 0,
        actions: [
          if (_user != null)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Row(
                children: [
                  Icon(Icons.star, color: AppTheme.warning),
                  const SizedBox(width: 4),
                  Text(
                    '${_user!.totalPoints}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
          IconButton(
            icon: const Icon(Icons.insights),
            onPressed: () => context.push('/progress'),
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Kooka mascot header
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              children: [
                KookaMascot(
                  state: KookaState.waving,
                  size: 80,
                  showBubble: true,
                  bubbleText: _user != null ? "Keep it up, ${_user!.name}!" : "Let's sing!",
                ),
                if (_user != null) ...[                  const SizedBox(height: 8),
                  Text(
                    'Streak: ${_user!.streak} days',
                    style: TextStyle(
                      color: AppTheme.textLight,
                      fontSize: 14,
                    ),
                  ),
                ],
              ],
            ),
          ),
          Expanded(
            child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final unit = units[index];
          final unitCompleted = unit.lessons.isNotEmpty &&
              unit.lessons.every((l) => _completed.contains(l.id));
          final completedInUnit = unit.lessons.where((l) => _completed.contains(l.id)).length;
          final totalInUnit = unit.lessons.length;

          return Card(
            color: AppTheme.surface,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(
                color: unitCompleted ? AppTheme.success : AppTheme.secondary,
                width: 2,
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Unit ${unit.unit}: ${unit.title}',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.text,
                                )),
                            const SizedBox(height: 4),
                            Text(unit.description, style: const TextStyle(color: AppTheme.textLight)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: unitCompleted 
                              ? AppTheme.success.withOpacity(0.2)
                              : AppTheme.secondary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$completedInUnit/$totalInUnit',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: unitCompleted ? AppTheme.success : AppTheme.secondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: unit.lessons.map((lesson) {
                      final unlocked = isLessonUnlocked(lesson.id, _completed);
                      final done = _completed.contains(lesson.id);
                      return Opacity(
                        opacity: unlocked ? 1 : 0.5,
                        child: GestureDetector(
                          onTap: unlocked
                              ? () {
                                  context.push('/lesson/${lesson.id}');
                                }
                              : null,
                          child: Container(
                            width: 160,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: done
                                  ? AppTheme.success
                                  : (unlocked ? AppTheme.surface : AppTheme.featherLight),
                              border: Border.all(
                                color: done
                                    ? AppTheme.success
                                    : (unlocked ? AppTheme.secondary : AppTheme.earthTone),
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(lesson.title,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.text,
                                    )),
                                const SizedBox(height: 6),
                                Text('Level ${lesson.level}', style: const TextStyle(color: AppTheme.textLight)),
                                const SizedBox(height: 8),
                                Text(
                                  lesson.description,
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(color: AppTheme.textLight),
                                ),
                                const SizedBox(height: 8),
                                Align(
                                  alignment: Alignment.bottomRight,
                                  child: Text(
                                    done ? 'Completed' : (unlocked ? 'Start' : 'Locked'),
                                    style: TextStyle(
                                      color: done
                                          ? Colors.white
                                          : (unlocked ? AppTheme.secondary : AppTheme.earthTone),
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                )
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  )
                ],
              ),
            ),
          );
        },
        separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemCount: units.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}


