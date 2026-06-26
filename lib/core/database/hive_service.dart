import 'package:hive_flutter/hive_flutter.dart';

import '../models/extracted_note_model.dart';
import '../models/flashcard_model.dart';
import '../models/task_model.dart';

class HiveService {
  static const String _tasksBox = 'tasks';
  static const String _flashcardsBox = 'flashcards';
  static const String _notesBox = 'notes';

  /// Must be called once in main() after Hive.initFlutter()
  static Future<void> init() async {
    // Register Adapters
    if (!Hive.isAdapterRegistered(0)) {
      Hive.registerAdapter(TaskModelAdapter());
    }
    if (!Hive.isAdapterRegistered(1)) {
      Hive.registerAdapter(FlashcardModelAdapter());
    }
    if (!Hive.isAdapterRegistered(2)) {
      Hive.registerAdapter(ExtractedNoteModelAdapter());
    }

    // Open Boxes
    await Hive.openBox<TaskModel>(_tasksBox);
    await Hive.openBox<FlashcardModel>(_flashcardsBox);
    await Hive.openBox<ExtractedNoteModel>(_notesBox);
  }

  // --- Task Operations ---

  static Box<TaskModel> get tasksBox => Hive.box<TaskModel>(_tasksBox);

  static Future<void> saveTask(TaskModel task) async {
    try {
      await tasksBox.put(task.id, task);
    } catch (e) {
      throw Exception('Failed to save task: $e');
    }
  }

  static List<TaskModel> getTasksForDate(DateTime date) {
    try {
      final allTasks = tasksBox.values.toList();
      return allTasks.where((task) {
        return task.date.year == date.year &&
            task.date.month == date.month &&
            task.date.day == date.day;
      }).toList();
    } catch (e) {
      return [];
    }
  }

  static Future<void> toggleTaskCompletion(String taskId) async {
    try {
      final task = tasksBox.get(taskId);
      if (task != null) {
        task.isCompleted = !task.isCompleted;
        await task.save();
      }
    } catch (e) {
      throw Exception('Failed to update task: $e');
    }
  }

  // --- Flashcard Operations ---

  static Box<FlashcardModel> get flashcardsBox =>
      Hive.box<FlashcardModel>(_flashcardsBox);

  static Future<void> saveFlashcard(FlashcardModel card) async {
    try {
      await flashcardsBox.put(card.id, card);
    } catch (e) {
      throw Exception('Failed to save flashcard: $e');
    }
  }

  static List<FlashcardModel> getDueFlashcards() {
    try {
      return flashcardsBox.values
          .where((card) => card.isDueForReview)
          .toList();
    } catch (e) {
      return [];
    }
  }

  static Future<void> deleteFlashcard(String id) async {
    try {
      await flashcardsBox.delete(id);
    } catch (e) {
      throw Exception('Failed to delete flashcard: $e');
    }
  }

  // --- Extracted Notes Operations ---

  static Box<ExtractedNoteModel> get notesBox =>
      Hive.box<ExtractedNoteModel>(_notesBox);

  static Future<void> saveNote(ExtractedNoteModel note) async {
    try {
      await notesBox.put(note.id, note);
    } catch (e) {
      throw Exception('Failed to save note: $e');
    }
  }

  static List<ExtractedNoteModel> searchNotes(String query) {
    try {
      final lowerQuery = query.toLowerCase();
      return notesBox.values.where((note) {
        return note.content.toLowerCase().contains(lowerQuery) ||
            note.tags.any((tag) => tag.toLowerCase().contains(lowerQuery));
      }).toList();
    } catch (e) {
      return [];
    }
  }

  static Future<void> deleteNote(String id) async {
    try {
      await notesBox.delete(id);
    } catch (e) {
      throw Exception('Failed to delete note: $e');
    }
  }

  static Future<void> closeAll() async {
    await Hive.close();
  }
}
