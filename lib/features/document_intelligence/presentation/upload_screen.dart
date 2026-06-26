import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/hive_service.dart';
import '../../../core/models/extracted_note_model.dart';
import '../../../core/theme/app_theme.dart';
import '../data/content_extractor.dart';
import '../data/pdf_parser_service.dart';
import 'package:uuid/uuid.dart';

final _uploadStateProvider =
    StateNotifierProvider<UploadNotifier, UploadState>(
  (ref) => UploadNotifier(),
);

enum UploadStatus { idle, uploading, processing, done, error }

class UploadState {
  final UploadStatus status;
  final String? fileName;
  final String? errorMessage;
  final List<ExtractedNoteModel> extractedNotes;

  const UploadState({
    this.status = UploadStatus.idle,
    this.fileName,
    this.errorMessage,
    this.extractedNotes = const [],
  });

  UploadState copyWith({
    UploadStatus? status,
    String? fileName,
    String? errorMessage,
    List<ExtractedNoteModel>? extractedNotes,
  }) {
    return UploadState(
      status: status ?? this.status,
      fileName: fileName ?? this.fileName,
      errorMessage: errorMessage ?? this.errorMessage,
      extractedNotes: extractedNotes ?? this.extractedNotes,
    );
  }
}

class UploadNotifier extends StateNotifier<UploadState> {
  UploadNotifier() : super(const UploadState());

  final _parser = PdfParserService();
  final _uuid = const Uuid();

  Future<void> pickAndProcessFile() async {
    try {
      // Strict MIME-type validation: only allow PDF
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
        withData: true,
      );

      if (result == null || result.files.isEmpty) return;

      final file = result.files.first;

      // Guard: validate file actually has bytes
      if (file.bytes == null) {
        state = state.copyWith(
          status: UploadStatus.error,
          errorMessage: 'Could not read file. Please try again.',
        );
        return;
      }

      // Guard: max file size 20MB
      if (file.size > 20 * 1024 * 1024) {
        state = state.copyWith(
          status: UploadStatus.error,
          errorMessage: 'File too large. Maximum size is 20MB.',
        );
        return;
      }

      state = state.copyWith(
        status: UploadStatus.uploading,
        fileName: file.name,
      );

      await Future.delayed(const Duration(milliseconds: 300)); // UX feedback

      state = state.copyWith(status: UploadStatus.processing);

      // Parse in background Isolate (won't freeze the UI)
      final rawText = await _parser.extractTextFromBytes(file.bytes!);

      // Extract structured notes
      final extracted = ContentExtractor.extract(rawText);

      final notes = <ExtractedNoteModel>[];
      extracted.forEach((tag, contents) {
        for (final content in contents) {
          final note = ExtractedNoteModel(
            id: _uuid.v4(),
            sourceFileName: file.name,
            content: content,
            tags: [tag],
          );
          notes.add(note);
          HiveService.saveNote(note);
        }
      });

      state = state.copyWith(
        status: UploadStatus.done,
        extractedNotes: notes,
      );
    } catch (e) {
      state = state.copyWith(
        status: UploadStatus.error,
        errorMessage: 'An unexpected error occurred: ${e.toString()}',
      );
    }
  }

  void reset() => state = const UploadState();
}

class UploadScreen extends ConsumerWidget {
  const UploadScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(_uploadStateProvider);
    final notifier = ref.read(_uploadStateProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FA),
      appBar: AppBar(
        title: const Text('Document Intelligence',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Upload Card
            GestureDetector(
              onTap: state.status == UploadStatus.uploading ||
                      state.status == UploadStatus.processing
                  ? null
                  : notifier.pickAndProcessFile,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: double.infinity,
                height: 160,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: state.status == UploadStatus.done
                        ? AppTheme.secondary
                        : AppTheme.primary.withOpacity(0.3),
                    width: 2,
                    style: BorderStyle.solid,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: _buildUploadContent(state),
              ),
            ),

            const SizedBox(height: 24),

            // Status message
            if (state.status == UploadStatus.error)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        state.errorMessage ?? 'Unknown error',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      onPressed: notifier.reset,
                    ),
                  ],
                ),
              ),

            if (state.status == UploadStatus.done) ...[
              Text(
                '${state.extractedNotes.length} notes extracted from "${state.fileName}"',
                style: const TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 15),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.separated(
                  itemCount: state.extractedNotes.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final note = state.extractedNotes[index];
                    return _NoteCard(note: note);
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildUploadContent(UploadState state) {
    switch (state.status) {
      case UploadStatus.uploading:
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 12),
            Text('Uploading ${state.fileName}...',
                style: const TextStyle(color: Colors.grey)),
          ],
        );
      case UploadStatus.processing:
        return const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 12),
            Text('Extracting content...', style: TextStyle(color: Colors.grey)),
            Text('This may take a moment for large files.',
                style: TextStyle(color: Colors.grey, fontSize: 11)),
          ],
        );
      case UploadStatus.done:
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle_rounded,
                color: AppTheme.secondary, size: 48),
            const SizedBox(height: 8),
            const Text('Extraction Complete!',
                style:
                    TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(state.fileName ?? '',
                style: const TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        );
      default:
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.upload_file_rounded,
                size: 48, color: AppTheme.primary.withOpacity(0.7)),
            const SizedBox(height: 12),
            const Text('Tap to upload a PDF',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const Text('Max file size: 20MB',
                style: TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        );
    }
  }
}

class _NoteCard extends StatelessWidget {
  final ExtractedNoteModel note;
  const _NoteCard({required this.note});

  Color _tagColor(String tag) {
    switch (tag) {
      case 'Exam Tip':
        return Colors.orange;
      case 'Vocabulary':
        return Colors.purple;
      case 'Key Date':
        return Colors.blue;
      case 'Action Item':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final tag = note.tags.isNotEmpty ? note.tags.first : 'Note';
    final color = _tagColor(tag);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: color, width: 4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              tag,
              style: TextStyle(
                  fontSize: 11,
                  color: color,
                  fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(height: 8),
          Text(note.content, style: const TextStyle(fontSize: 13)),
        ],
      ),
    );
  }
}
