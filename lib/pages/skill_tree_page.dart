import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/units.dart';

class SkillTreePage extends StatelessWidget {
  const SkillTreePage({super.key});

  @override
  Widget build(BuildContext context) {
    final units = getAllUnits();
    final completed = <String>[]; // placeholder until storage is added

    return Scaffold(
      appBar: AppBar(title: const Text('Your Journey with Kooka')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final unit = units[index];
          final unitCompleted = unit.lessons.isNotEmpty &&
              unit.lessons.every((l) => completed.contains(l.id));

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
                      final unlocked = isLessonUnlocked(lesson.id, completed);
                      final done = completed.contains(lesson.id);
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


