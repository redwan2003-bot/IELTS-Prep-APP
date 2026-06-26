import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/document_intelligence/presentation/upload_screen.dart';
import '../../features/vocabulary/presentation/flashcard_deck_screen.dart';
import '../shell/app_shell.dart';

// Plain Provider — no code generation needed
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/dashboard',
    routes: [
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: DashboardScreen(),
            ),
          ),
          GoRoute(
            path: '/documents',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: UploadScreen(),
            ),
          ),
          GoRoute(
            path: '/vocabulary',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: FlashcardDeckScreen(),
            ),
          ),
        ],
      ),
    ],
  );
});
