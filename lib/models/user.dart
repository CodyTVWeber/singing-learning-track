import 'package:hive/hive.dart';

part 'user.g.dart';

@HiveType(typeId: 1)
class UserProfile extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String ageGroup; // 'kid' | 'teen' | 'adult'
  
  @HiveField(3)
  final int currentLevel;
  
  @HiveField(4)
  final int totalPoints;
  
  @HiveField(5)
  final int streak;

  UserProfile({
    required this.id,
    required this.name,
    required this.ageGroup,
    required this.currentLevel,
    required this.totalPoints,
    required this.streak,
  });

  UserProfile copyWith({
    String? id,
    String? name,
    String? ageGroup,
    int? currentLevel,
    int? totalPoints,
    int? streak,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      ageGroup: ageGroup ?? this.ageGroup,
      currentLevel: currentLevel ?? this.currentLevel,
      totalPoints: totalPoints ?? this.totalPoints,
      streak: streak ?? this.streak,
    );
  }
}



