# PWA to Native Migration Blueprint: IELTS Prep App

## 1. Overview

This document serves as a blueprint for migrating the frontend of the "IELTS Prep App" from its current Progressive Web App (PWA) implementation (React, Vite, TailwindCSS) to a Native Mobile App using Expo and React Native. The primary goal is to leverage the existing Supabase backend (database, authentication, storage) without modification, focusing solely on rewriting the user interface and client-side logic to a native mobile framework.

This blueprint is intended to guide an AI coding assistant (e.g., Cursor, Anti-gravity) in performing a systematic and efficient migration, ensuring a production-grade native application that can be deployed to the Apple App Store and Google Play Store.

## 2. Core Principles of Migration

*   **Backend Reusability**: The existing Supabase project (database schema, RLS policies, authentication setup, storage buckets) will be fully reused. No changes are required on the Supabase side.
*   **Frontend Rewrite**: The entire PWA frontend codebase will be rewritten in React Native (Expo).
*   **Feature Parity**: All existing features (user authentication, study plan management, daily reminders, note-taking, roadmap upload/viewing) must be re-implemented with equivalent native functionality.
*   **Native Experience**: The new frontend must provide a smooth, performant, and platform-consistent user experience typical of native mobile applications.
*   **Security**: Maintain or enhance the security posture, especially regarding API key handling and local data storage.

## 3. Technology Stack for Native App

| Category          | PWA (Existing)         | Native App (Target)           | Purpose                                                               |
| :---------------- | :--------------------- | :---------------------------- | :-------------------------------------------------------------------- |
| **Frontend**      | React (Vite)           | React Native (Expo)           | Building native mobile UIs.                                           |
| **Language**      | TypeScript             | TypeScript                    | Type safety and maintainability.                                      |
| **Styling**       | TailwindCSS            | NativeWind / React Native StyleSheet | Consistent UI styling.                                                |
| **Routing**       | React Router           | Expo Router / React Navigation| Native screen navigation.                                             |
| **State Mgmt.**   | React Context / Zustand| React Context / Zustand       | Application state management.                                         |
| **Notifications** | Web Push API           | Expo Notifications            | Cross-platform push and local notifications.                          |
| **File Picker**   | HTML `<input type="file">` | `expo-document-picker`        | Native file selection.                                                |
| **Local Storage** | `localStorage`         | `expo-secure-store` / `AsyncStorage` | Secure and persistent local data storage.                             |
| **Build/Deploy**  | Vercel                 | Expo EAS                      | Building native binaries and app store submission.                    |

## 4. Migration Steps and Component Mapping

### 4.1. Project Initialization

*   **Action**: Create a new Expo project with TypeScript.
*   **Instruction for AI**: `npx create-expo-app ielts-prep-native --template blank-typescript`.
*   **Configuration**: Set up `app.json` for app metadata, icons, splash screens, and native build settings. Install and configure NativeWind for Tailwind CSS integration in React Native.

### 4.2. UI Component Translation

Translate existing React (web) components to their React Native equivalents. This is a direct mapping of visual elements and layout.

| Web Component (React/HTML) | Native Component (React Native) | Notes                                                         |
| :------------------------- | :------------------------------ | :------------------------------------------------------------ |
| `<div>`                    | `<View>`                        | Fundamental building block for UI.                            |
| `<p>`, `<h1>`, `<span>`    | `<Text>`                        | For all text content.                                         |
| `<button>`                 | `<Pressable>` / `<TouchableOpacity>` | For interactive buttons.                                      |
| `<input type="text">`    | `<TextInput>`                   | For text input fields.                                        |
| `<img src="...">`        | `<Image source={{ uri: 
...
` }} />` | For displaying images.                                        |
| `<form>`                   | No direct equivalent; use `<View>` and handle submission logic manually. |
| `<nav>`                    | `React Navigation` components (e.g., `Stack.Navigator`, `Tab.Navigator`) | For app navigation.                                           |
| `Tailwind CSS classes`     | `NativeWind` classes / `StyleSheet.create` | For styling components.                                       |

### 4.3. State Management Migration

*   **Action**: Adapt existing React Context API or lightweight state management (Zustand/Jotai) to the React Native environment.
*   **Instruction for AI**: Ensure state management logic remains consistent. If using Context, ensure providers wrap the native navigation stack appropriately.

### 4.4. Authentication Flow Adaptation

*   **Action**: Migrate Supabase authentication calls and session management.
*   **Instruction for AI**: 
    *   Use `@supabase/supabase-js` as before.
    *   Replace `localStorage` usage for session storage with `expo-secure-store` for enhanced security in a native environment.
    *   Adapt UI for login/registration forms to React Native components.

### 4.5. Data Fetching and Manipulation

*   **Action**: Ensure all Supabase data fetching (CRUD operations for `study_plans`, `notes`, `reminders`, `uploaded_roadmaps`) works correctly.
*   **Instruction for AI**: The Supabase client-side SDK (`@supabase/supabase-js`) is cross-platform and will work directly. Ensure environment variables for Supabase URL and `anon` key are correctly configured for Expo (e.g., via `app.config.ts` or `.env` files managed by Expo).

### 4.6. File Handling (PDF/DOC Uploads)

*   **Action**: Replace web-based file input with native document picker.
*   **Instruction for AI**: 
    *   Use `expo-document-picker` to allow users to select PDF/DOC files from their device.
    *   Adapt the logic to upload the selected file to Supabase Storage, ensuring the `file_path` and `file_type` are correctly stored in the `uploaded_roadmaps` table.

### 4.7. Notifications

*   **Action**: Replace Web Push API with Expo Notifications for local and push notifications.
*   **Instruction for AI**: 
    *   Implement `expo-notifications` to request notification permissions.
    *   Schedule local notifications for daily reminders based on user settings.
    *   If push notifications are desired (e.g., for server-triggered reminders), implement logic to obtain and send Expo Push Tokens to Supabase (or a custom backend function) for later use.

### 4.8. Build and Deployment

*   **Action**: Configure Expo Application Services (EAS) for building and submitting native app binaries.
*   **Instruction for AI**: 
    *   Set up `eas.json` for build profiles (development, preview, production).
    *   Provide instructions for using `eas build` to generate `.ipa` (iOS) and `.aab` (Android) files.
    *   Provide instructions for using `eas submit` to upload these binaries to Apple App Store Connect and Google Play Console.

## 5. Security Considerations for Native App

*   **API Keys**: Store Supabase API keys securely using Expo's environment variable handling (e.g., `app.config.ts` or `.env` files). The `anon` key is safe to expose client-side *only* because RLS is strictly enforced.
*   **Secure Storage**: Use `expo-secure-store` for sensitive local data storage (e.g., user session tokens) instead of `AsyncStorage`.
*   **Network Security**: All communication with Supabase must occur over HTTPS.
*   **RLS**: Reiterate the importance of strict Row Level Security on Supabase tables.

## 6. Performance and User Experience

*   **Native Performance**: Optimize React Native components for smooth animations and transitions. Consider `react-native-reanimated` for complex animations.
*   **Offline Support**: Implement local data caching (e.g., using `AsyncStorage` or a dedicated local database like WatermelonDB) for offline access to study plans and notes.
*   **Platform-Specific UI**: While React Native aims for cross-platform, be mindful of platform-specific UI/UX conventions (e.g., navigation patterns).

## 7. Deliverables

*   Complete, production-ready source code for the IELTS Prep Native App (Expo/React Native).
*   Updated `README.md` with instructions for project setup, running locally, building with EAS, and key architectural decisions.
*   Clear instructions for setting up Expo EAS and submitting to app stores.

## 8. Constraints and Assumptions

*   The existing Supabase project (database, RLS, auth, storage) is fully functional and will be reused as-is.
*   The AI coding assistant has access to the previous `system_architecture.md` and `ai_coding_prompt.md` for context.
*   The focus is on migrating the frontend; no new backend features are to be developed.

This blueprint provides a detailed roadmap for transforming your PWA into a robust native mobile application, ensuring a seamless transition and a high-quality end product.
