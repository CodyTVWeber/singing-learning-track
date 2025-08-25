import 'package:hive_flutter/hive_flutter.dart';
import '../models/user.dart';

class UserStore {
  static const String _boxName = 'userBox';
  static const String _userKey = 'currentUser';
  
  late Box<Map> _box;
  
  Future<void> init() async {
    _box = await Hive.openBox<Map>(_boxName);
  }
  
  Future<UserProfile?> getUser() async {
    final userData = _box.get(_userKey);
    if (userData != null) {
      return UserProfile.fromJson(Map<String, dynamic>.from(userData));
    }
    return null;
  }
  
  Future<void> saveUser(UserProfile user) async {
    await _box.put(_userKey, user.toJson());
  }
  
  Future<void> deleteUser() async {
    await _box.delete(_userKey);
  }
  
  Future<void> close() async {
    await _box.close();
  }
}