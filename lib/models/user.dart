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

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'ageGroup': ageGroup,
    'currentLevel': currentLevel,
    'totalPoints': totalPoints,
    'streak': streak,
  };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    id: json['id'] as String,
    name: json['name'] as String,
    ageGroup: json['ageGroup'] as String,
    currentLevel: json['currentLevel'] as int,
    totalPoints: json['totalPoints'] as int,
    streak: json['streak'] as int,
  );

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



