import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/hive_service.dart';
import '../../../core/models/flashcard_model.dart';
import '../../../core/theme/app_theme.dart';
import '../data/srs_algorithm.dart';
import 'package:uuid/uuid.dart';

final _flashcardsProvider =
    StateNotifierProvider<FlashcardNotifier, List<FlashcardModel>>(
  (ref) => FlashcardNotifier(),
);

class FlashcardNotifier extends StateNotifier<List<FlashcardModel>> {
  FlashcardNotifier() : super([]) {
    _load();
  }

  final _uuid = const Uuid();

  void _load() {
    state = HiveService.getDueFlashcards();
    if (state.isEmpty) _seedSampleCards();
  }

  void _seedSampleCards() {
    final samples = [
      FlashcardModel(
        id: _uuid.v4(),
        word: 'Mitigate',
        definition:
            'To make less severe, serious, or painful.',
        exampleSentence:
            'Governments must mitigate the effects of climate change.',
        category: 'Academic',
      ),
      FlashcardModel(
        id: _uuid.v4(),
        word: 'Proliferate',
        definition: 'To increase rapidly in number; multiply.',
        exampleSentence:
            'Social media platforms have proliferated over the last decade.',
        category: 'Academic',
      ),
      FlashcardModel(
        id: _uuid.v4(),
        word: 'Substantiate',
        definition: 'To provide evidence to support or prove the truth of.',
        exampleSentence:
            'The researcher failed to substantiate her claims.',
        category: 'Academic',
      ),
    ];

    for (final card in samples) {
      HiveService.saveFlashcard(card);
    }
    state = samples;
  }

  Future<void> reviewCard(FlashcardModel card, int quality) async {
    final updated = SrsAlgorithm.processReview(card: card, quality: quality);
    await HiveService.saveFlashcard(updated);
    // Remove reviewed card from the current session
    state = state.where((c) => c.id != card.id).toList();
  }
}

class FlashcardDeckScreen extends ConsumerStatefulWidget {
  const FlashcardDeckScreen({super.key});

  @override
  ConsumerState<FlashcardDeckScreen> createState() =>
      _FlashcardDeckScreenState();
}

class _FlashcardDeckScreenState extends ConsumerState<FlashcardDeckScreen>
    with SingleTickerProviderStateMixin {
  bool _showBack = false;
  late AnimationController _flipController;
  late Animation<double> _flipAnimation;

  @override
  void initState() {
    super.initState();
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _flipAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _flipController.dispose(); // Prevent memory leak
    super.dispose();
  }

  void _flipCard() {
    if (_showBack) {
      _flipController.reverse();
    } else {
      _flipController.forward();
    }
    setState(() => _showBack = !_showBack);
  }

  void _resetFlip() {
    _flipController.reverse();
    setState(() => _showBack = false);
  }

  @override
  Widget build(BuildContext context) {
    final cards = ref.watch(_flashcardsProvider);
    final notifier = ref.read(_flashcardsProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FA),
      appBar: AppBar(
        title: const Text('Vocabulary Builder',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Chip(
              label: Text('${cards.length} due'),
              backgroundColor: AppTheme.primary.withOpacity(0.1),
              labelStyle: const TextStyle(
                  color: AppTheme.primary, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
      body: cards.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.celebration_rounded,
                      size: 64, color: Colors.amber),
                  SizedBox(height: 16),
                  Text(
                    "You're all caught up! 🎉",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'No cards due for review right now.',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Progress indicator
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: _flipCard,
                    child: AnimatedBuilder(
                      animation: _flipAnimation,
                      builder: (context, child) {
                        final angle = _flipAnimation.value * 3.14159;
                        final isBack = _flipAnimation.value > 0.5;

                        return Transform(
                          alignment: Alignment.center,
                          transform: Matrix4.identity()
                            ..setEntry(3, 2, 0.001)
                            ..rotateY(angle),
                          child: isBack
                              ? _buildCardFace(
                                  cards.first,
                                  showBack: true,
                                )
                              : _buildCardFace(
                                  cards.first,
                                  showBack: false,
                                ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _showBack
                        ? 'How well did you know it?'
                        : 'Tap card to reveal definition',
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                  const SizedBox(height: 24),
                  if (_showBack)
                    Row(
                      children: [
                        Expanded(
                          child: _RatingButton(
                            label: 'Forgot',
                            icon: Icons.close_rounded,
                            color: Colors.red,
                            onTap: () {
                              notifier.reviewCard(cards.first, 0);
                              _resetFlip();
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _RatingButton(
                            label: 'Hard',
                            icon: Icons.sentiment_dissatisfied_rounded,
                            color: Colors.orange,
                            onTap: () {
                              notifier.reviewCard(cards.first, 2);
                              _resetFlip();
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _RatingButton(
                            label: 'Good',
                            icon: Icons.sentiment_satisfied_rounded,
                            color: Colors.blue,
                            onTap: () {
                              notifier.reviewCard(cards.first, 4);
                              _resetFlip();
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _RatingButton(
                            label: 'Easy',
                            icon: Icons.sentiment_very_satisfied_rounded,
                            color: Colors.green,
                            onTap: () {
                              notifier.reviewCard(cards.first, 5);
                              _resetFlip();
                            },
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
    );
  }

  Widget _buildCardFace(FlashcardModel card, {required bool showBack}) {
    return Container(
      width: double.infinity,
      height: 260,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: showBack
              ? [AppTheme.primaryVariant, AppTheme.primary]
              : [Colors.white, const Color(0xFFF0F0FF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (!showBack) ...[
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  card.category,
                  style: const TextStyle(
                      color: AppTheme.primary,
                      fontSize: 12,
                      fontWeight: FontWeight.w600),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                card.word,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E1E1E),
                ),
              ),
            ] else ...[
              Text(
                card.word,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white70,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                card.definition,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  color: Colors.white,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                '"${card.exampleSentence}"',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  color: Colors.white70,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _RatingButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _RatingButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(label,
                style: TextStyle(
                    color: color,
                    fontSize: 11,
                    fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
