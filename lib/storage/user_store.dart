import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/user.dart';

class UserStore {
  static const String _boxName = 'user_profiles';
  static const String _currentUserKey = 'current_user';
  
  static Box<UserProfile>? _box;
  static const _uuid = Uuid();

  static Future<void> init() async {
    await Hive.initFlutter();
    
    if (!Hive.isAdapterRegistered(1)) {
      Hive.registerAdapter(UserProfileAdapter());
    }
    
    _box = await Hive.openBox<UserProfile>(_boxName);
  }

  static Box<UserProfile> get _userBox {
    if (_box == null || !_box!.isOpen) {
      throw StateError('UserStore not initialized. Call UserStore.init() first.');
    }
    return _box!;
  }

  /// Get the current user profile
  static Future<UserProfile?> getUser() async {
    try {
      return _userBox.get(_currentUserKey);
    } catch (e) {
      return null;
    }
  }

  /// Save user profile (creates or updates)
  static Future<void> saveUser(UserProfile user) async {
    await _userBox.put(_currentUserKey, user);
  }

  /// Create a new user profile
  static Future<UserProfile> createUser({
    required String name,
    required String ageGroup,
  }) async {
    final user = UserProfile(
      id: _uuid.v4(),
      name: name,
      ageGroup: ageGroup,
      currentLevel: 1,
      totalPoints: 0,
      streak: 0,
    );
    
    await saveUser(user);
    return user;
  }

  /// Update user points and streak
  static Future<void> updateUserProgress({
    required int pointsToAdd,
    required bool incrementStreak,
  }) async {
    final currentUser = await getUser();
    if (currentUser == null) return;

    final updatedUser = currentUser.copyWith(
      totalPoints: currentUser.totalPoints + pointsToAdd,
      streak: incrementStreak ? currentUser.streak + 1 : currentUser.streak,
    );

    await saveUser(updatedUser);
  }

  /// Clear all user data
  static Future<void> clearAll() async {
    await _userBox.clear();
  }

  /// Check if there's an existing user
  static Future<bool> hasUser() async {
    final user = await getUser();
    return user != null;
  }
}