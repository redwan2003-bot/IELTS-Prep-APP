/// ContentExtractor uses a robust Regex/keyword-based system to intelligently
/// categorize raw text from PDF documents into structured notes.
/// All operations are pure and unit-testable.
class ContentExtractor {
  // Patterns for recognizing IELTS-related content
  static final _tipPattern = RegExp(
    r'(tip|note|remember|important|key point|strategy|trick)[:\s].+',
    caseSensitive: false,
  );

  static final _datePattern = RegExp(
    r'\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\b',
    caseSensitive: false,
  );

  static final _vocabularyPattern = RegExp(
    r'^[A-Z][a-z]+(?:\s+[a-z]+){0,3}:\s+[A-Z].{10,}',
    multiLine: true,
  );

  static final _bulletPattern = RegExp(
    r'(?:^|\n)[•\-\*]\s+(.+)',
  );

  /// Extracts structured notes from raw text, returned as a map of tag -> content list.
  static Map<String, List<String>> extract(String rawText) {
    final results = <String, List<String>>{
      'Exam Tip': [],
      'Vocabulary': [],
      'Key Date': [],
      'Action Item': [],
    };

    // Split into lines for processing
    final lines = rawText.split('\n').map((l) => l.trim()).where((l) => l.isNotEmpty);

    for (final line in lines) {
      // Sanitize: skip lines that are too short or too long to be useful
      if (line.length < 10 || line.length > 500) continue;

      if (_tipPattern.hasMatch(line)) {
        results['Exam Tip']!.add(_sanitize(line));
      } else if (_vocabularyPattern.hasMatch(line)) {
        results['Vocabulary']!.add(_sanitize(line));
      } else if (_datePattern.hasMatch(line)) {
        results['Key Date']!.add(_sanitize(line));
      } else if (_bulletPattern.hasMatch(line)) {
        results['Action Item']!.add(_sanitize(line));
      }
    }

    return results;
  }

  /// Sanitizes user-facing text to prevent injection or broken UI.
  static String _sanitize(String input) {
    return input
        .replaceAll(RegExp(r'[<>]'), '') // Remove HTML-like characters
        .replaceAll(RegExp(r'\s+'), ' ') // Normalize whitespace
        .trim();
  }
}
