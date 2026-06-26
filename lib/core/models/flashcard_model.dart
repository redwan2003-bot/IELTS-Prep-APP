import 'package:hive/hive.dart';

class FlashcardModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String word;

  @HiveField(2)
  final String definition;

  @HiveField(3)
  final String exampleSentence;

  @HiveField(4)
  final String category;

  @HiveField(5)
  DateTime nextReviewDate;

  @HiveField(6)
  double easeFactor;

  @HiveField(7)
  int interval;

  @HiveField(8)
  int repetitions;

  FlashcardModel({
    required this.id,
    required this.word,
    required this.definition,
    required this.exampleSentence,
    this.category = 'Academic',
    DateTime? nextReviewDate,
    this.easeFactor = 2.5,
    this.interval = 1,
    this.repetitions = 0,
  }) : nextReviewDate = nextReviewDate ?? DateTime.now();

  bool get isDueForReview =>
      DateTime.now().isAfter(nextReviewDate) ||
      DateTime.now().isAtSameMomentAs(nextReviewDate);
}

class FlashcardModelAdapter extends TypeAdapter<FlashcardModel> {
  @override
  final int typeId = 1;

  @override
  FlashcardModel read(BinaryReader reader) {
    return FlashcardModel(
      id: reader.readString(),
      word: reader.readString(),
      definition: reader.readString(),
      exampleSentence: reader.readString(),
      category: reader.readString(),
      nextReviewDate:
          DateTime.fromMillisecondsSinceEpoch(reader.readInt()),
      easeFactor: reader.readDouble(),
      interval: reader.readInt(),
      repetitions: reader.readInt(),
    );
  }

  @override
  void write(BinaryWriter writer, FlashcardModel obj) {
    writer.writeString(obj.id);
    writer.writeString(obj.word);
    writer.writeString(obj.definition);
    writer.writeString(obj.exampleSentence);
    writer.writeString(obj.category);
    writer.writeInt(obj.nextReviewDate.millisecondsSinceEpoch);
    writer.writeDouble(obj.easeFactor);
    writer.writeInt(obj.interval);
    writer.writeInt(obj.repetitions);
  }
}
