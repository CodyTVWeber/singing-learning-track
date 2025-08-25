class UserProfile {
  final String id;
  final String name;
  final String ageGroup; // 'kid' | 'teen' | 'adult'
  final int currentLevel;
  final int totalPoints;
  final int streak;

  const UserProfile({
    required this.id,
    required this.name,
    required this.ageGroup,
    required this.currentLevel,
    required this.totalPoints,
    required this.streak,
  });
}



