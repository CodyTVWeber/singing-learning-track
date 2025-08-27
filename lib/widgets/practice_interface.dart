import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class PracticeInterface extends StatefulWidget {
  const PracticeInterface({super.key});

  @override
  State<PracticeInterface> createState() => _PracticeInterfaceState();
}

class _PracticeInterfaceState extends State<PracticeInterface>
    with TickerProviderStateMixin {
  late AnimationController _breathingController;
  late Animation<double> _breathingAnimation;
  bool _isBreathing = false;

  @override
  void initState() {
    super.initState();
    _breathingController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    );
    _breathingAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _breathingController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _breathingController.dispose();
    super.dispose();
  }

  void _toggleBreathing() {
    if (_isBreathing) {
      _breathingController.stop();
    } else {
      _breathingController.repeat(reverse: true);
    }
    setState(() {
      _isBreathing = !_isBreathing;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.secondary, width: 2),
      ),
      child: Column(
        children: [
          // Breathing circle
          AnimatedBuilder(
            animation: _breathingAnimation,
            builder: (context, child) {
              return Transform.scale(
                scale: _breathingAnimation.value,
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: _isBreathing 
                        ? AppTheme.primary 
                        : AppTheme.secondary,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: (_isBreathing 
                            ? AppTheme.primary 
                            : AppTheme.secondary).withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: Icon(
                    _isBreathing ? Icons.air : Icons.air_outlined,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              );
            },
          ),
          
          const SizedBox(height: 24),
          
          // Breathing instructions
          Text(
            _isBreathing 
                ? 'Breathe in... and out...'
                : 'Tap to start breathing exercise',
            style: TextStyle(
              fontSize: 16,
              color: _isBreathing ? AppTheme.primary : AppTheme.textLight,
              fontWeight: _isBreathing ? FontWeight.w600 : FontWeight.normal,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 24),
          
          // Breathing button
          ElevatedButton.icon(
            onPressed: _toggleBreathing,
            icon: Icon(_isBreathing ? Icons.pause : Icons.play_arrow),
            label: Text(_isBreathing ? 'Stop' : 'Start'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _isBreathing ? AppTheme.error : AppTheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}