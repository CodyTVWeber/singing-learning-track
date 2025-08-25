import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'theme/app_theme.dart';
import 'pages/skill_tree_page.dart';
import 'pages/onboarding_page.dart';
import 'pages/lesson_page.dart';
import 'data/units.dart';
import 'storage/user_store.dart';
import 'storage/progress_store.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive
  await Hive.initFlutter();
  
  runApp(const KookaSingApp());
}

class KookaSingApp extends StatefulWidget {
  const KookaSingApp({super.key});

  @override
  State<KookaSingApp> createState() => _KookaSingAppState();
}

class _KookaSingAppState extends State<KookaSingApp> {
  late final GoRouter _router;
  final _userStore = UserStore();
  bool _isInitialized = false;
  String? _initialRoute;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    await _userStore.init();
    final user = await _userStore.getUser();
    
    setState(() {
      _initialRoute = user == null ? '/onboarding' : '/skill-tree';
      _isInitialized = true;
    });
    
    _router = GoRouter(
      initialLocation: _initialRoute!,
      routes: [
        GoRoute(
          path: '/onboarding',
          builder: (context, state) => const OnboardingPage(),
        ),
        GoRoute(
          path: '/skill-tree',
          builder: (context, state) => const SkillTreePage(),
        ),
        GoRoute(
          path: '/lesson/:id',
          builder: (context, state) {
            final lessonId = state.pathParameters['id']!;
            final lesson = getLessonById(lessonId);
            if (lesson == null) {
              return const SkillTreePage();
            }
            return LessonPage(lesson: lesson);
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return MaterialApp(
        theme: AppTheme.themeData(),
        home: const Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        ),
      );
    }
    
    return MaterialApp.router(
      title: 'Kooka Sing',
      theme: AppTheme.themeData(),
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}



