import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/units.dart';
import '../storage/user_store.dart';
import '../storage/progress_store.dart';
import '../models/user.dart';

class SkillTreePage extends StatefulWidget {
  const SkillTreePage({super.key});

  @override
  State<SkillTreePage> createState() => _SkillTreePageState();
}

class _SkillTreePageState extends State<SkillTreePage> {
  UserProfile? _user;
  List<String> _completedLessonIds = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      final user = await UserStore.getUser();
      if (user != null) {
        final completedIds = await ProgressStore.getCompletedLessonIds(user.id);
        if (mounted) {
          setState(() {
            _user = user;
            _completedLessonIds = completedIds;
            _isLoading = false;
          });
        }
      } else {
        // This shouldn't happen if coming from proper flow, but handle gracefully
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading user data: $e'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: const Color(0xFFFAF7F2),
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary),
          ),
        ),
      );
    }

    final units = getAllUnits();

    return Scaffold(
      appBar: AppBar(
        title: Text(_user != null ? 'Hi ${_user!.name}!' : 'Your Journey with Kooka'),
        actions: [
          if (_user != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Chip(
                label: Text('${_user!.totalPoints} points'),
                backgroundColor: AppTheme.primary,
                labelStyle: const TextStyle(color: Colors.white),
              ),
            ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final unit = units[index];
          final unitCompleted = unit.lessons.isNotEmpty &&
              unit.lessons.every((l) => _completedLessonIds.contains(l.id));

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
                  Text('Unit ${unit.unit}: ${unit.title}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.text,
                      )),
                  const SizedBox(height: 4),
                  Text(unit.description, style: const TextStyle(color: AppTheme.textLight)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: unit.lessons.map((lesson) {
                      final unlocked = isLessonUnlocked(lesson.id, _completedLessonIds);
                      final done = _completedLessonIds.contains(lesson.id);
                      return Opacity(
                        opacity: unlocked ? 1 : 0.5,
                        child: GestureDetector(
                          onTap: unlocked
                              ? () {
                                  // TODO: navigate to lesson page
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
    );
  }
}


