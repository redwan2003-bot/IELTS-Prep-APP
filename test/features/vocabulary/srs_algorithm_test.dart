import 'package:flutter_test/flutter_test.dart';
import 'package:ielts_companion/features/vocabulary/data/srs_algorithm.dart';
import 'package:ielts_companion/core/models/flashcard_model.dart';

void main() {
  group('SrsAlgorithm Tests', () {
    test('Perfect recall on new card sets interval to 1', () {
      final card = FlashcardModel(
        id: '1',
        term: 'term',
        definition: 'def',
      );

      final updated = SrsAlgorithm.processReview(card: card, quality: 5);

      expect(updated.interval, 1);
      expect(updated.repetitions, 1);
      expect(updated.easeFactor, greaterThan(2.5));
    });

    test('Failed recall resets repetitions to 0', () {
      final card = FlashcardModel(
        id: '1',
        term: 'term',
        definition: 'def',
      );
      
      // Simulate some progress
      card.repetitions = 5;
      card.interval = 10;
      card.easeFactor = 2.6;

      final updated = SrsAlgorithm.processReview(card: card, quality: 1);

      expect(updated.repetitions, 0);
      expect(updated.interval, 1);
      expect(updated.easeFactor, lessThan(2.6));
    });

    test('Ease factor does not drop below 1.3', () {
      final card = FlashcardModel(
        id: '1',
        term: 'term',
        definition: 'def',
      );
      
      card.easeFactor = 1.3;

      final updated = SrsAlgorithm.processReview(card: card, quality: 0);

      expect(updated.easeFactor, 1.3);
    });
  });
}
