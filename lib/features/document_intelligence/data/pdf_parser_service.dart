import 'dart:isolate';
import 'package:flutter/foundation.dart';
import 'package:syncfusion_flutter_pdf/pdf.dart';

/// Parses a PDF file in a background Isolate to avoid UI freeze (ANR prevention).
class PdfParserService {
  /// Takes raw bytes of a PDF file and returns all extracted text.
  /// Uses compute() which spawns a background Isolate safely.
  Future<String> extractTextFromBytes(Uint8List fileBytes) async {
    try {
      final text = await compute(_parsePdfIsolate, fileBytes);
      return text;
    } catch (e) {
      throw Exception('PDF extraction failed: $e');
    }
  }
}

/// Top-level function required by compute() — must be outside of any class.
String _parsePdfIsolate(Uint8List bytes) {
  final buffer = StringBuffer();

  try {
    final document = PdfDocument(inputBytes: bytes);
    final extractor = PdfTextExtractor(document);

    for (int i = 0; i < document.pages.count; i++) {
      final pageText = extractor.extractText(startPageIndex: i, endPageIndex: i);
      if (pageText != null && pageText.isNotEmpty) {
        buffer.writeln(pageText);
      }
    }

    document.dispose(); // Always release PDF resources
  } catch (e) {
    throw Exception('Error parsing page: $e');
  }

  return buffer.toString();
}
