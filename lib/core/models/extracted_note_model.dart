import 'package:hive/hive.dart';

class ExtractedNoteModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String sourceFileName;

  @HiveField(2)
  final String content;

  @HiveField(3)
  final List<String> tags;

  @HiveField(4)
  final DateTime extractedAt;

  @HiveField(5)
  bool isFavorite;

  ExtractedNoteModel({
    required this.id,
    required this.sourceFileName,
    required this.content,
    List<String>? tags,
    DateTime? extractedAt,
    this.isFavorite = false,
  })  : tags = tags ?? [],
        extractedAt = extractedAt ?? DateTime.now();
}

class ExtractedNoteModelAdapter extends TypeAdapter<ExtractedNoteModel> {
  @override
  final int typeId = 2;

  @override
  ExtractedNoteModel read(BinaryReader reader) {
    final tagCount = reader.readInt();
    final tags = List<String>.generate(tagCount, (_) => reader.readString());
    return ExtractedNoteModel(
      id: reader.readString(),
      sourceFileName: reader.readString(),
      content: reader.readString(),
      tags: tags,
      extractedAt:
          DateTime.fromMillisecondsSinceEpoch(reader.readInt()),
      isFavorite: reader.readBool(),
    );
  }

  @override
  void write(BinaryWriter writer, ExtractedNoteModel obj) {
    writer.writeInt(obj.tags.length);
    for (final tag in obj.tags) {
      writer.writeString(tag);
    }
    writer.writeString(obj.id);
    writer.writeString(obj.sourceFileName);
    writer.writeString(obj.content);
    writer.writeInt(obj.extractedAt.millisecondsSinceEpoch);
    writer.writeBool(obj.isFavorite);
  }
}
