import 'package:hive/hive.dart';

class TaskModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final String moduleType;

  @HiveField(3)
  bool isCompleted;

  @HiveField(4)
  final DateTime date;

  TaskModel({
    required this.id,
    required this.title,
    required this.moduleType,
    this.isCompleted = false,
    required this.date,
  });

  TaskModel copyWith({
    String? id,
    String? title,
    String? moduleType,
    bool? isCompleted,
    DateTime? date,
  }) {
    return TaskModel(
      id: id ?? this.id,
      title: title ?? this.title,
      moduleType: moduleType ?? this.moduleType,
      isCompleted: isCompleted ?? this.isCompleted,
      date: date ?? this.date,
    );
  }
}

class TaskModelAdapter extends TypeAdapter<TaskModel> {
  @override
  final int typeId = 0;

  @override
  TaskModel read(BinaryReader reader) {
    return TaskModel(
      id: reader.readString(),
      title: reader.readString(),
      moduleType: reader.readString(),
      isCompleted: reader.readBool(),
      date: DateTime.fromMillisecondsSinceEpoch(reader.readInt()),
    );
  }

  @override
  void write(BinaryWriter writer, TaskModel obj) {
    writer.writeString(obj.id);
    writer.writeString(obj.title);
    writer.writeString(obj.moduleType);
    writer.writeBool(obj.isCompleted);
    writer.writeInt(obj.date.millisecondsSinceEpoch);
  }
}
