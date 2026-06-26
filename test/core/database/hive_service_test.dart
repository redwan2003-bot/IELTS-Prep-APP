import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:ielts_companion/core/database/hive_service.dart';
import 'package:ielts_companion/core/models/task_model.dart';
import 'package:ielts_companion/core/models/flashcard_model.dart';
import 'package:ielts_companion/core/models/extracted_note_model.dart';

void main() {
  setUp(() async {
    final temp = await Directory.systemTemp.createTemp();
    Hive.init(temp.path);
    await HiveService.init();
  });

  tearDown(() async {
    await Hive.deleteFromDisk();
  });

  group('HiveService Tests', () {
    test('Saves and retrieves a task', () async {
      final task = TaskModel(
        id: '1',
        title: 'Test Task',
        type: TaskType.reading,
        date: DateTime.now(),
      );

      await HiveService.saveTask(task);
      final tasks = HiveService.getTasksForDate(DateTime.now());

      expect(tasks.length, 1);
      expect(tasks.first.title, 'Test Task');
    });

    test('Toggles task completion', () async {
      final task = TaskModel(
        id: '2',
        title: 'Another Task',
        type: TaskType.writing,
        date: DateTime.now(),
      );

      await HiveService.saveTask(task);
      await HiveService.toggleTaskCompletion('2');

      final tasks = HiveService.getTasksForDate(DateTime.now());
      expect(tasks.first.isCompleted, true);
    });

    test('Saves and retrieves a note', () async {
      final note = ExtractedNoteModel(
        id: '1',
        sourceFileName: 'test.pdf',
        content: 'This is a test note',
        tags: ['test'],
      );

      await HiveService.saveNote(note);
      final results = HiveService.searchNotes('test note');

      expect(results.length, 1);
      expect(results.first.content, 'This is a test note');
    });
  });
}
