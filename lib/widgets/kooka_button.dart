import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class KookaButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isPrimary;
  final bool isLarge;
  final IconData? icon;
  final bool isLoading;

  const KookaButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isPrimary = true,
    this.isLarge = false,
    this.icon,
    this.isLoading = false,
  });

  @override
  State<KookaButton> createState() => _KookaButtonState();
}

class _KookaButtonState extends State<KookaButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
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

  void _handleTapDown(TapDownDetails details) {
    if (widget.onPressed != null && !widget.isLoading) {
      _controller.forward();
    }
  }

  void _handleTapUp(TapUpDetails details) {
    if (widget.onPressed != null && !widget.isLoading) {
      _controller.reverse();
    }
  }

  void _handleTapCancel() {
    if (widget.onPressed != null && !widget.isLoading) {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final backgroundColor = widget.isPrimary
        ? AppTheme.primary
        : AppTheme.surface;
    final foregroundColor = widget.isPrimary
        ? Colors.white
        : AppTheme.primary;
    final borderColor = widget.isPrimary
        ? AppTheme.primary
        : AppTheme.primary;

    final padding = widget.isLarge
        ? const EdgeInsets.symmetric(horizontal: 32, vertical: 16)
        : const EdgeInsets.symmetric(horizontal: 24, vertical: 12);

    final fontSize = widget.isLarge ? 18.0 : 16.0;

    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      onTap: widget.isLoading ? null : widget.onPressed,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              decoration: BoxDecoration(
                color: backgroundColor,
                border: Border.all(
                  color: borderColor,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: widget.onPressed != null && !widget.isLoading
                    ? [
                        BoxShadow(
                          color: AppTheme.primary.withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ]
                    : [],
              ),
              child: Padding(
                padding: padding,
                child: Center(
                  child: widget.isLoading
                      ? SizedBox(
                          width: fontSize,
                          height: fontSize,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              foregroundColor,
                            ),
                          ),
                        )
                      : Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (widget.icon != null) ...[
                              Icon(
                                widget.icon,
                                color: foregroundColor,
                                size: fontSize + 4,
                              ),
                              const SizedBox(width: 8),
                            ],
                            Text(
                              widget.text,
                              style: TextStyle(
                                color: foregroundColor,
                                fontSize: fontSize,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}