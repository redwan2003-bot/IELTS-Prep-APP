import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/task_model.dart';
import '../data/dashboard_repository.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>(
  (ref) => DashboardRepository(),
);

// Holds the list of today's tasks
final todaysTasksProvider =
    StateNotifierProvider<TasksNotifier, List<TaskModel>>((ref) {
  final repository = ref.watch(dashboardRepositoryProvider);
  return TasksNotifier(repository);
});

// Computed provider for today's completion progress (0.0 to 1.0)
final todaysProgressProvider = Provider<double>((ref) {
  final tasks = ref.watch(todaysTasksProvider);
  if (tasks.isEmpty) return 0.0;
  final completed = tasks.where((t) => t.isCompleted).length;
  return completed / tasks.length;
});

class TasksNotifier extends StateNotifier<List<TaskModel>> {
  final DashboardRepository _repository;

  TasksNotifier(this._repository) : super([]) {
    _loadTasks();
  }

  void _loadTasks() {
    state = _repository.getTodaysTasks();
  }

  Future<void> toggleTask(String taskId) async {
    await _repository.toggleTask(taskId);
    // Update state immutably to trigger UI rebuild
    state = state.map((task) {
      if (task.id == taskId) {
        return task.copyWith(isCompleted: !task.isCompleted);
      }
      return task;
    }).toList();
  }
}
