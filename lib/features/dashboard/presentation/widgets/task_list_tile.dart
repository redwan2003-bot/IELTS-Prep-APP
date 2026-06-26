import 'package:flutter/material.dart';
import '../../../../core/models/task_model.dart';
import '../../../../core/theme/app_theme.dart';

class TaskListTile extends StatefulWidget {
  final TaskModel task;
  final VoidCallback onToggle;

  const TaskListTile({
    super.key,
    required this.task,
    required this.onToggle,
  });

  @override
  State<TaskListTile> createState() => _TaskListTileState();
}

class _TaskListTileState extends State<TaskListTile>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  static const Map<String, Color> _moduleColors = {
    'Listening': Color(0xFF4A90D9),
    'Reading': Color(0xFF7B5EA7),
    'Writing': Color(0xFFE67E22),
    'Speaking': Color(0xFF27AE60),
    'Vocabulary': Color(0xFFE74C3C),
  };

  static const Map<String, IconData> _moduleIcons = {
    'Listening': Icons.headphones_rounded,
    'Reading': Icons.menu_book_rounded,
    'Writing': Icons.edit_note_rounded,
    'Speaking': Icons.record_voice_over_rounded,
    'Vocabulary': Icons.auto_stories_rounded,
  };

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose(); // Prevent memory leak
    super.dispose();
  }

  void _handleTap() {
    _controller.forward().then((_) => _controller.reverse());
    widget.onToggle();
  }

  @override
  Widget build(BuildContext context) {
    final color = _moduleColors[widget.task.moduleType] ?? AppTheme.primary;
    final icon = _moduleIcons[widget.task.moduleType] ?? Icons.task_rounded;
    final isCompleted = widget.task.isCompleted;

    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTap: _handleTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 0),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: isCompleted ? color.withOpacity(0.1) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isCompleted ? color : Colors.grey.shade200,
              width: 1.5,
            ),
            boxShadow: isCompleted
                ? []
                : [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
          ),
          child: Row(
            children: [
              // Module icon
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(width: 14),
              // Title and module type
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.task.title,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: isCompleted
                            ? Colors.grey
                            : const Color(0xFF1E1E1E),
                        decoration:
                            isCompleted ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.task.moduleType,
                      style: TextStyle(
                        fontSize: 12,
                        color: color,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              // Animated checkmark
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: isCompleted
                    ? Container(
                        key: const ValueKey('checked'),
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: color,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.check_rounded,
                          color: Colors.white,
                          size: 18,
                        ),
                      )
                    : Container(
                        key: const ValueKey('unchecked'),
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          border: Border.all(
                              color: Colors.grey.shade300, width: 2),
                          shape: BoxShape.circle,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
