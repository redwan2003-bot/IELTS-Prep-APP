import 'package:flutter_test/flutter_test.dart';
import 'package:ielts_companion/features/document_intelligence/data/content_extractor.dart';

void main() {
  group('ContentExtractor Tests', () {
    test('Extracts exam tips', () {
      final text = 'Tip: Always read the instructions carefully before starting.\nRandom text here.';
      final results = ContentExtractor.extract(text);

      expect(results['Exam Tip']!.length, 1);
      expect(results['Exam Tip']!.first, 'Tip: Always read the instructions carefully before starting.');
    });

    test('Extracts dates', () {
      final text = 'The exam is scheduled for 12/05/2026.\nAnother line.';
      final results = ContentExtractor.extract(text);

      expect(results['Key Date']!.length, 1);
      expect(results['Key Date']!.first, 'The exam is scheduled for 12/05/2026.');
    });

    test('Sanitizes input', () {
      final text = 'Tip: <b>HTML</b> is not allowed here.';
      final results = ContentExtractor.extract(text);

      expect(results['Exam Tip']!.first, 'Tip: bHTML/b is not allowed here.');
    });
  });
}
