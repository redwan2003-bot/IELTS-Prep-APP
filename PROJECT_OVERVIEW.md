# IELTS Band 9 Companion - Project Overview

## 📱 About The App
IELTS Band 9 Companion is a comprehensive, offline-first mobile application designed to help users prepare for the IELTS exam. It features task tracking, document intelligence (extracting key information from study materials), and a spaced repetition system (SRS) for vocabulary flashcards.

## 🛠️ Technology Stack
*   **Framework:** Flutter (Dart)
*   **State Management:** Riverpod (`flutter_riverpod`)
*   **Local Storage / Database:** Hive (`hive_flutter`) - *Using manually written `TypeAdapter`s for performance and build stability.*
*   **Routing:** GoRouter
*   **UI/Styling:** `flutter_screenutil` (responsive design), Google Fonts, Custom Painters (for progress rings).
*   **Document Parsing:** `syncfusion_flutter_pdf`
*   **Error Reporting:** Sentry (`sentry_flutter`)

## 📂 Architecture & Directory Structure
The project follows a feature-first, layered architecture to maintain separation of concerns:

```text
lib/
├── core/                       # App-wide shared resources
│   ├── database/               # Hive initialization and CRUD services
│   ├── models/                 # Hive data models & TypeAdapters
│   ├── router/                 # GoRouter configuration
│   └── theme/                  # App colors, text styles, and global themes
├── features/                   # Independent feature modules
│   ├── dashboard/              # Home screen, task tracking, progress rings
│   ├── document_intelligence/  # PDF upload, content extraction, and sanitization
│   └── vocabulary/             # Flashcard deck, SM-2 spaced repetition algorithm
└── main.dart                   # Application entry point & service initialization
```

## ✨ Core Features

### 1. Dashboard & Task Tracking
*   **Daily Progress Ring:** A custom-painted, animated circular progress bar showing the percentage of daily tasks completed.
*   **Task Management:** Users can toggle task completion. Tasks are stored locally using Hive (`TaskModel`).

### 2. Document Intelligence
*   **PDF Upload:** Users can upload PDF study materials using `file_picker`.
*   **Content Extraction:** The `PdfParserService` extracts raw text from PDFs.
*   **Intelligent Categorization:** The `ContentExtractor` uses Regex to intelligently identify and categorize text into 'Exam Tips', 'Vocabulary', 'Key Dates', and 'Action Items'.
*   **Local Notes:** Extracted data is saved to Hive as `ExtractedNoteModel`.

### 3. Vocabulary & Spaced Repetition (SRS)
*   **Flashcards:** Users can review vocabulary using interactive 3D flip animations.
*   **SuperMemo-2 (SM-2):** A pure Dart implementation of the SM-2 algorithm calculates the `easeFactor` and `interval` for each card based on user recall quality (0-5 scale).
*   **Due Cards:** Hive queries surface cards that are due for review based on their `nextReviewDate`.

## 🚀 Getting Started

### Prerequisites
*   [Flutter SDK](https://docs.flutter.dev/get-started/install) (^3.12.2)
*   Android Studio (for Android toolchain and device emulation)

### Installation
1.  Clone the repository.
2.  Get packages:
    ```bash
    flutter pub get
    ```
3.  Run the application:
    ```bash
    flutter run
    ```

### Note on Code Generation
To avoid hanging issues with `build_runner` on Windows, this project currently uses **manual TypeAdapters** for Hive models (`TaskModel`, `FlashcardModel`, `ExtractedNoteModel`) instead of relying on `hive_generator`. Similarly, Riverpod is used without `@riverpod` annotations to keep the build process fast and reliable.

## 📦 Preparing for Google Play Store (Next Steps)
The following steps are required before the app can be published:
1.  **Android Toolchain:** Ensure Android Studio is installed and run `flutter doctor --android-licenses`.
2.  **App Signing:** Generate a release keystore using `keytool` and configure `android/app/build.gradle` to use it for signing release builds.
3.  **App Icons & Splash:** Run `flutter pub run flutter_launcher_icons:main` and `flutter pub run flutter_native_splash:create` once the Flutter CLI is responsive.
4.  **Privacy Policy:** A `privacy_policy.html` file has been created and needs to be hosted online.
5.  **Build:** Run `flutter build appbundle --release` to generate the final AAB file for upload to the Google Play Console.
