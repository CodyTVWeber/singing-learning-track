import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum KookaState {
  waving,
  singing,
  celebrating,
  thinking,
}

class KookaMascot extends StatefulWidget {
  final KookaState state;
  final double size;
  final bool showBubble;
  final String? bubbleText;

  const KookaMascot({
    super.key,
    this.state = KookaState.waving,
    this.size = 120,
    this.showBubble = false,
    this.bubbleText,
  });

  @override
  State<KookaMascot> createState() => _KookaMascotState();
}

class _KookaMascotState extends State<KookaMascot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _bounceAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _bounceAnimation = Tween<double>(
      begin: 0,
      end: 10,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _getImagePath() {
    switch (widget.state) {
      case KookaState.singing:
        return 'img/kooka-burra-singing.png';
      case KookaState.waving:
      case KookaState.celebrating:
      case KookaState.thinking:
      default:
        return 'img/kooka-burra-waiving.png';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.showBubble && widget.bubbleText != null) ...[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: AppTheme.primary,
                width: 2,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Text(
              widget.bubbleText!,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppTheme.text,
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],
        AnimatedBuilder(
          animation: _bounceAnimation,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, -_bounceAnimation.value),
              child: Container(
                width: widget.size,
                height: widget.size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.skyLight.withOpacity(0.3),
                ),
                child: ClipOval(
                  child: Image.asset(
                    _getImagePath(),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      // Fallback if image not found
                      return Container(
                        color: AppTheme.primary.withOpacity(0.1),
                        child: Icon(
                          Icons.music_note,
                          size: widget.size * 0.5,
                          color: AppTheme.primary,
                        ),
                      );
                    },
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}