# Cychael Energy

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.5-blueviolet)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)

A cross-platform mobile application for smart energy monitoring and management, built with React Native and Expo.

<div align="center">
  <img src="./assets/logo.jpg" alt="Cychael Energy Logo" width="300" />
</div>

## 📋 Overview

Cychael Energy is a comprehensive solution that helps users monitor their energy consumption, manage connected devices, and receive personalized energy-saving tips to reduce their environmental footprint and utility costs.

## ✨ Key Features

-   **📱 Cross-Platform Support**: Works seamlessly on iOS, Android, and Web
-   **🔐 User Authentication**: Secure login, registration, and password recovery
-   **📊 Interactive Dashboard**: Real-time overview of energy usage and key metrics
-   **🔌 Device Management**: Track, control, and schedule connected smart devices
-   **📈 Energy Analysis**: Detailed reports and visualization of energy consumption patterns
-   **👤 Profile Management**: Customizable user profiles and preferences
-   **💡 Energy Saving Tips**: Personalized recommendations for reducing energy usage and costs
-   **🌙 Dark/Light Theme**: Customizable UI themes for better user experience

## 🛠️ Technology Stack

-   **Frontend Framework**: [React Native](https://reactnative.dev/) 0.79.2 with [Expo](https://expo.dev/) 53.0.5
-   **State Management**: React Context API
-   **Authentication & Database**: [Firebase](https://firebase.google.com/) 11.7.3
-   **Styling**: [NativeWind](https://www.nativewind.dev/) 4.1.23 (TailwindCSS for React Native)
-   **Navigation**: [React Navigation](https://reactnavigation.org/) 7.x
-   **Language**: [TypeScript](https://www.typescriptlang.org/) 5.8.3
-   **Data Visualization**: [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) 6.12.0
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) 7.56.2
-   **Validation**: [Yup](https://github.com/jquense/yup) 1.6.1

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+ recommended)
-   [npm](https://www.npmjs.com/) (v9+) or [yarn](https://yarnpkg.com/) (v1.22+)
-   [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
-   [EAS CLI](https://docs.expo.dev/build/setup/) (for builds): `npm install -g eas-cli`
-   For iOS development: macOS with Xcode installed
-   For Android development: Android Studio with SDK installed

### Environment Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add Android and iOS apps to your Firebase project
3. Download the configuration files:
    - `google-services.json` for Android
    - `GoogleService-Info.plist` for iOS
4. Place these files in the root directory of the project

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/cychael-energy.git
    cd cychael-energy
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Start the development server:

    ```bash
    # For web
    npm run web

    # For Android (requires Android emulator or device connected)
    npm run android

    # For iOS (requires Mac and iOS simulator)
    npm run ios
    ```

## 💻 Development Workflow

### Development Server Commands

```bash
# Start Expo development server with options menu
npm start

# Start for specific platform
npm run web      # Run in web browser
npm run android  # Run on Android device/emulator
npm run ios      # Run on iOS simulator (requires Mac)
```

### Building with EAS Build

[EAS Build](https://docs.expo.dev/build/introduction/) is Expo's cloud service for building app binaries.

```bash
# Configure EAS
eas build:configure

# Build Android preview/development version
eas build -p android --profile preview

# Build iOS preview/development version
eas build -p ios --profile preview

# Build production version
eas build -p android --profile production
eas build -p ios --profile production

# Submit to app stores
eas submit -p android --latest
eas submit -p ios --latest

# Deploy over-the-air updates
eas update --branch production --message "Update description"
```

## 📁 Project Structure

```
cychael-energy/
├── assets/                # App images, icons, and assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Common UI elements like buttons
│   │   └── ...
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Application screens
│   │   ├── auth/          # Authentication screens
│   │   └── ...
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── App.tsx                # Main application component
├── app.json               # Expo configuration
├── global.css             # Global styles
├── index.ts               # Entry point
├── tailwind.config.js     # TailwindCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🧪 Testing

This project uses the following testing approaches:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## 📱 Screenshots

<div align="center">
  <p>Coming soon!</p>
</div>

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
