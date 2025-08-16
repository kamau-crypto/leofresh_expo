# Mobile Application

A secure Android/IOS compatible mobile application built with TypeScript, Expo,React Native Paper, Tanstack Query, and Zustand for a seamless integration with Frappe's ERPNext.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Architecture Layering](#architecture-layering)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [API Communication](#api-communication)
- [State Management](#state-management)
- [Form Validation](#form-validation)
- [UI Components & Theming](#ui-components--theming)
- [Alert System](#alert-system)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Overview

This mobile application provides a comprehensive solution for to the frappe's ERPNext backend for:
    1. Making Sales
     to ai Built with modern React Native technologies and integrated with Frappe backend, it offers a seamless user experience across iOS and Android platforms.

## Features

- 🔐 Secure authentication system
- 📱 Cross-platform compatibility (iOS & Android)
- 🎨 Material Design 3 theming with React Native Paper
- 🔄 Real-time data synchronization with Frappe backend
- 📋 Robust form validation and input handling
- 🎯 Smart alert system (Toasts & Snackbars)
- 🚀 Optimized performance with Zustand state management
- 📊 [Add your specific app features]

## Tech Stack

### Frontend

- **Framework**: Expo SDK 53
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **State Management**: Zustand
- **Form Management**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios

### Backend

- **Backend Framework**: Frappe
- **Authentication**: Frappe Auth System
- **API**: RESTful APIs

### Development Tools

- **Package Manager**: npm/yarn
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Prerequisites

### System Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0 or yarn >= 1.22.0
- Expo CLI >= 6.0.0
- Git

### Development Environment

- **iOS Development**: Xcode 14+ (macOS only)
- **Android Development**: Android Studio with SDK 33+
- **Code Editor**: VS Code (recommended)

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- React Native Tools

## Installation

### 1. Clone Repository

```bash
git clone [your-repository-url]
cd [your-app-name]
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install Expo CLI (if not already installed)

```bash
npm install -g @expo/cli
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Frappe Backend Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-frappe-site.com
EXPO_PUBLIC_API_VERSION=v1

# Authentication
EXPO_PUBLIC_AUTH_ENDPOINT=/api/method/login
EXPO_PUBLIC_REFRESH_TOKEN_ENDPOINT=/api/method/frappe.auth.get_logged_user

# App Configuration
EXPO_PUBLIC_APP_NAME=YourAppName
EXPO_PUBLIC_APP_VERSION=1.0.0

# Development
EXPO_PUBLIC_DEV_MODE=true
```

### App Configuration (app.config.js)

```javascript
export default {
	expo: {
		name: "Your App Name",
		slug: "your-app-slug",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		plugins: ["expo-router"],
	},
};
```

## Running the App

### Development Mode

```bash
# Start the development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on device with Expo Go
npx expo start --tunnel
```

### Device Testing

1. Install Expo Go app on your mobile device
2. Scan the QR code from the terminal
3. The app will load on your device

## Building for Production

### EAS Build Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure
```

### iOS Build

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

### Android Build

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

## Architecture Layering

The application follows a layered architecture pattern for maintainability and scalability:

### Presentation Layer

- **Components**: Reusable UI components built with React Native Paper
- **Screens**: Individual app screens and navigation
- **Hooks**: Custom React hooks for component logic

### Business Logic Layer

- **Services**: Business logic and data processing
- **Stores**: Zustand state management stores
- **Utils**: Helper functions and utilities

### Data Access Layer

- **API**: Axios-based HTTP client for Frappe communication
- **Models**: TypeScript interfaces and types
- **Validators**: Zod schemas for data validation

### Infrastructure Layer

- **Auth**: Authentication service and token management
- **Storage**: Local storage and caching
- **Navigation**: React Navigation configuration

_[This section will be expanded with specific components as requested]_

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── forms/           # Form-specific components
│   └── ui/              # UI-specific components
├── screens/             # App screens
├── navigation/          # Navigation configuration
├── services/            # API and business logic
│   ├── api/            # Axios API layer
│   ├── auth/           # Authentication service
│   └── frappe/         # Frappe-specific services
├── store/             # Zustand state stores
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── hooks/              # Custom React hooks
├── constants/          # App constants
├── validators/         # Zod validation schemas
└── assets/             # Images, fonts, etc.
```

## Authentication

### Features

- Secure login/logout functionality
- Token-based authentication with Frappe
- Automatic token refresh
- Biometric authentication (optional)

### Implementation

```typescript
// Example authentication flow
const useAuth = () => {
	const login = async (username: string, password: string) => {
		// Authentication logic with Frappe backend
	};

	const logout = async () => {
		// Logout and cleanup
	};
};
```

## API Communication

### Axios Configuration

The app uses a centralized Axios instance for all API communications:

```typescript
// api/client.ts
const apiClient = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
	timeout: 10000,
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(config => {
	// Add auth token to requests
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
	response => response,
	error => {
		// Handle errors globally
	}
);
```

### Frappe Integration

- RESTful API communication
- Automatic error handling
- Request/response transformation
- Token management

## State Management

### Zustand Stores

The app uses Zustand for lightweight and efficient state management:

```typescript
// stores/authStore.ts
interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	isAuthenticated: false,
	login: async credentials => {
		// Login logic
	},
	logout: () => {
		// Logout logic
	},
}));
```

## Form Validation

### React Hook Form + Zod

Forms are built using React Hook Form with Zod validation:

```typescript
// validators/loginSchema.ts
export const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

// components/LoginForm.tsx
const LoginForm = () => {
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(loginSchema),
	});

	// Form implementation
};
```

## UI Components & Theming

### React Native Paper Integration

- Material Design 3 components
- Consistent theming across the app
- Dark/light mode support
- Customizable color schemes

### Theme Configuration

```typescript
const theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: "#your-primary-color",
		// Custom color overrides
	},
};
```

## Alert System

### Toast Notifications (Non-Critical)

Used for informational messages and minor feedback:

```typescript
import { ToastAndroid } from "react-native";

const showToast = (message: string) => {
	ToastAndroid.show(message, ToastAndroid.SHORT);
};
```

### Snackbars (Critical Alerts)

Used for important messages requiring user attention:

```typescript
import { Snackbar } from "react-native-paper";

const CriticalAlert = ({ visible, message, onDismiss }) => (
	<Snackbar
		visible={visible}
		onDismiss={onDismiss}
		duration={Snackbar.DURATION_LONG}>
		{message}
	</Snackbar>
);
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy

- Unit tests for utilities and services
- Component testing with React Native Testing Library
- Integration tests for API communication
- E2E testing with Detox (optional)

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore

## Troubleshooting

### Common Issues

#### Metro bundler issues

```bash
# Clear Metro cache
npx expo start --clear
```

#### Android build failures

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
```

#### iOS build issues

```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..
```

### Frappe Connection Issues

1. Verify backend URL in environment variables/config setup
2. Check network connectivity
3. Ensure Frappe CORS settings allow your domain
4. Verify API endpoint availability

### Performance Issues

- Check for memory leaks in Zustand stores
- Optimize image sizes and formats
- Use React.memo for expensive components
- Implement proper list virtualization

## License

This project is licensed under the [APHI License](LICENSE) - see the LICENSE file for details.
