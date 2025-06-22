# Cychael Energy

A React Native mobile application for energy monitoring and management with support for web, Android, and iOS platforms.

![Cychael Energy](./assets/logo.jpg)

## Overview

Cychael Energy helps users monitor their energy consumption, manage devices, and get energy-saving tips to reduce their environmental footprint and utility costs.

## Features

-   **User Authentication**: Secure login, registration, and password recovery
-   **Dashboard**: Overview of energy usage and key metrics
-   **Device Management**: Track and control connected devices
-   **Energy Analysis**: Detailed reports and visualization of energy consumption
-   **Profile Management**: User profile customization
-   **Energy Saving Tips**: Recommendations for reducing energy usage

## Technology Stack

-   React Native / Expo
-   Firebase Authentication & Database
-   NativeWind (TailwindCSS for React Native)
-   React Navigation
-   TypeScript

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Expo CLI](https://docs.expo.dev/get-started/installation/)
-   [EAS CLI](https://docs.expo.dev/build/setup/) (for builds)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/cychael-energy.git
    cd cychael-energy
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    # For web
    npm run web

    # For Android
    npm run android

    # For iOS
    npm run ios
    ```

## Development Commands

### Development Server

```bash
# Start Expo development server
npm start

# Start for specific platform
npm run web
npm run android
npm run ios
```

### Building with EAS

```bash
# Build Android preview
eas build -p android --profile preview

# Build iOS preview
eas build -p ios --profile preview

# Submit to stores
eas submit -p android --latest
eas submit -p ios --latest

# Update over-the-air
eas update
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # Application screens
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Notes

-   For iOS builds, a Mac is required
-   Ensure you have the latest Expo SDK and dependencies
-   See the [Expo documentation](https://docs.expo.dev/) for detailed information
