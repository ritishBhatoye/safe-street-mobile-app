# Safe Street 🛣️

A modern React Native mobile application built with Expo, featuring a beautiful UI powered by NativeWind (Tailwind CSS) and smooth animations with Reanimated.

## 🚀 Features

- **Cross-Platform**: Runs on iOS, Android, and Web
- **Modern Stack**: Built with Expo SDK 54, React 19, and TypeScript
- **Styled with NativeWind**: Tailwind CSS for React Native
- **File-Based Routing**: Powered by Expo Router
- **Dark Mode Support**: Automatic theme switching
- **Smooth Animations**: React Native Reanimated for performant animations
- **Tab Navigation**: Bottom tab navigation with haptic feedback
- **New Architecture**: Enabled for improved performance

## 📋 Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for quick testing on physical devices)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd safe-street
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## 📱 Running the App

### Development Build

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Using Expo Go

1. Run `npm start`
2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## 🏗️ Project Structure

```
safe-street/
├── src/
│   ├── app/              # File-based routing
│   │   ├── (tabs)/       # Tab navigation screens
│   │   ├── _layout.tsx   # Root layout
│   │   └── modal.tsx     # Modal screen
│   ├── components/       # Reusable components
│   │   └── ui/          # UI components
│   ├── constants/        # Theme and constants
│   └── hooks/           # Custom React hooks
├── assets/              # Images and static files
├── app.json            # Expo configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🎨 Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) ~5.9
- **UI Library**: [React Native](https://reactnative.dev/) 0.81
- **Styling**: [NativeWind](https://www.nativewind.dev/) v4 (Tailwind CSS)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) v6
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) v3
- **Gestures**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) v2

## 🧪 Development

### Linting

```bash
npm run lint
```

### Reset Project

Remove starter code and start fresh:

```bash
npm run reset-project
```

## 📝 Configuration

### Tailwind CSS

Configure Tailwind in `tailwind.config.js`. Update the `content` array to include all files using NativeWind classes.

### Theme

Customize colors and theme settings in `src/constants/theme.ts`.

### App Configuration

Modify `app.json` for:

- App name and slug
- Icons and splash screens
- Platform-specific settings
- Plugins and experiments

## 🌐 Deep Linking

The app supports deep linking with the custom scheme:

```
safestreet://
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and run linting before submitting PRs.

## 📧 Contact

For questions or support, please open an issue in the repository.
