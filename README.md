# IELTS Prep - React Native App

A native mobile application for IELTS preparation, built with Expo and React Native. This is the native migration of the IELTS Prep PWA.

## Features

- **Authentication**: Secure login/register with Supabase and expo-secure-store
- **Study Plans**: Create and manage 1, 2, or 3-month study schedules
- **Notes**: Take and organize study notes with content sanitization
- **Reminders**: Set push notifications for study tasks using expo-notifications
- **Roadmaps**: Upload and manage PDF/DOC study roadmaps using expo-document-picker

## Tech Stack

- **Framework**: Expo SDK 56 with React Native
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth + expo-secure-store
- **Notifications**: expo-notifications (production-grade)
- **File Handling**: expo-document-picker

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo Go app (for development)
- iOS Simulator (macOS only) or Android Emulator

### Installation

1. Navigate to the project directory:
```bash
cd ielts-prep-native
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Development

Start the development server:
```bash
npx expo start
```

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

## Building for Production with EAS

### Setup EAS

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Configure EAS (if not already configured):
```bash
eas build:configure
```

### Build for iOS

1. Configure your iOS app in the [Expo dashboard](https://expo.dev)
2. Build the app:
```bash
eas build --platform ios
```

3. Submit to App Store:
```bash
eas submit --platform ios
```

### Build for Android

1. Build the app:
```bash
eas build --platform android
```

2. Submit to Google Play:
```bash
eas submit --platform android
```

### Build Variants

For development builds:
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

For preview builds:
```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

## Project Structure

```
ielts-prep-native/
├── app/                    # Expo Router file-based routing
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── tabs/              # Tab-based main navigation
│   │   ├── index.tsx      # Dashboard
│   │   ├── plans.tsx      # Study Plans
│   │   ├── notes.tsx      # Notes
│   │   ├── reminders.tsx  # Reminders
│   │   └── roadmaps.tsx  # Roadmaps
│   ├── _layout.tsx        # Root layout
│   ├── (auth)/            # Auth group layout
│   └── (tabs)/            # Tabs group layout
├── components/            # Reusable UI components
│   └── ui/               # Native UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication with expo-secure-store
├── lib/                  # Utilities
│   └── supabase.ts       # Supabase client
├── assets/               # Static assets
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── tailwind.config.js    # TailwindCSS configuration
└── package.json          # Dependencies
```

## Security Features

- **Secure Storage**: Session tokens stored in expo-secure-store (encrypted keychain/keystore)
- **User Isolation**: All data queries filtered by user_id
- **Input Validation**: All forms have client-side validation
- **XSS Prevention**: Note content sanitized before rendering
- **Error Handling**: Comprehensive error handling with user feedback

## Environment Variables

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create the following tables:
   - `study_plans` (id, title, duration_months, user_id, created_at)
   - `notes` (id, title, content, user_id, created_at)
   - `reminders` (id, title, reminder_time, user_id, created_at)
   - `uploaded_roadmaps` (id, user_id, file_name, file_path, content_type, created_at)
3. Create a storage bucket named `roadmaps`
4. Enable Row Level Security (RLS) policies to ensure user data isolation

## Troubleshooting

### Metro bundler issues
```bash
npx expo start -c
```

### Clear cache
```bash
npx expo start --clear
```

### Reset native modules
```bash
rm -rf node_modules
npm install
npx expo prebuild --clean
```

## License

This project is licensed under the MIT License.
