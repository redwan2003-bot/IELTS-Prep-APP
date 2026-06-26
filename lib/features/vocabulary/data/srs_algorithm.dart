import '../../../core/models/flashcard_model.dart';

/// Pure Dart implementation of the SuperMemo-2 (SM-2) spaced repetition algorithm.
/// This is a stateless utility class — fully unit-testable with zero dependencies.
///
/// Quality ratings (q):
///   0 - Complete blackout (forgot entirely)
///   1 - Wrong, but remembered on hint
///   2 - Wrong, but easy to remember after
///   3 - Correct, but with difficulty
///   4 - Correct with slight hesitation
///   5 - Perfect response
class SrsAlgorithm {
  static const double _minEaseFactor = 1.3;

  /// Processes a review and returns an updated FlashcardModel.
  /// Does NOT mutate the original card — returns a new state.
  static FlashcardModel processReview({
    required FlashcardModel card,
    required int quality, // 0-5
  }) {
    assert(quality >= 0 && quality <= 5, 'Quality must be between 0 and 5');

    int newInterval;
    int newRepetitions;
    double newEaseFactor;

    if (quality >= 3) {
      // Successful recall
      if (card.repetitions == 0) {
        newInterval = 1;
      } else if (card.repetitions == 1) {
        newInterval = 6;
      } else {
        newInterval = (card.interval * card.easeFactor).round();
      }
      newRepetitions = card.repetitions + 1;
    } else {
      // Failed recall — reset
      newInterval = 1;
      newRepetitions = 0;
    }

    // Update ease factor using SM-2 formula
    newEaseFactor = card.easeFactor +
        (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Clamp ease factor to prevent it from going below minimum
    if (newEaseFactor < _minEaseFactor) {
      newEaseFactor = _minEaseFactor;
    }

    final nextReviewDate = DateTime.now().add(Duration(days: newInterval));

    // Return updated card state (Hive object updated in-place)
    card.interval = newInterval;
    card.repetitions = newRepetitions;
    card.easeFactor = newEaseFactor;
    card.nextReviewDate = nextReviewDate;

    return card;
  }
}
