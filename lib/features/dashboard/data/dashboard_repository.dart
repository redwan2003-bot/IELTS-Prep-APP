import '../../../core/database/hive_service.dart';
import '../../../core/models/task_model.dart';
import 'package:uuid/uuid.dart';

class DashboardRepository {
  final _uuid = const Uuid();

  /// Returns tasks for today, auto-seeding if none exist
  List<TaskModel> getTodaysTasks() {
    final today = DateTime.now();
    final tasks = HiveService.getTasksForDate(today);
    if (tasks.isEmpty) {
      _seedTodaysTasks(today);
      return HiveService.getTasksForDate(today);
    }
    return tasks;
  }

  Future<void> toggleTask(String taskId) async {
    await HiveService.toggleTaskCompletion(taskId);
  }

  double getTodaysProgress() {
    final tasks = getTodaysTasks();
    if (tasks.isEmpty) return 0.0;
    final completed = tasks.where((t) => t.isCompleted).length;
    return completed / tasks.length;
  }

  /// Seeds sample daily tasks based on the IELTS 1-month roadmap
  Future<void> _seedTodaysTasks(DateTime date) async {
    final sampleTasks = [
      TaskModel(
        id: _uuid.v4(),
        title: 'Listen to a BBC 6 Minute English podcast',
        moduleType: 'Listening',
        date: date,
      ),
      TaskModel(
        id: _uuid.v4(),
        title: 'Practice True/False/Not Given passage (20 min)',
        moduleType: 'Reading',
        date: date,
      ),
      TaskModel(
        id: _uuid.v4(),
        title: 'Write a 250-word essay (Task 2 prompt)',
        moduleType: 'Writing',
        date: date,
      ),
      TaskModel(
        id: _uuid.v4(),
        title: 'Record a 2-min Part 2 speaking response',
        moduleType: 'Speaking',
        date: date,
      ),
      TaskModel(
        id: _uuid.v4(),
        title: 'Review 10 academic vocabulary flashcards',
        moduleType: 'Vocabulary',
        date: date,
      ),
    ];

    for (final task in sampleTasks) {
      await HiveService.saveTask(task);
    }
  }
}
