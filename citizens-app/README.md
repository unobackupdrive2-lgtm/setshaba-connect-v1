# Setshaba Connect - Citizens App

A React Native mobile application that enables citizens to report municipal issues and track their resolution status. Built with Expo and integrates with the Setshaba Connect backend API.

## Features

### 🔐 Authentication
- User registration and login using Supabase JWT authentication
- Secure session management with automatic token refresh
- Profile management with location data

### 📋 Report Management
- Create detailed reports with title, description, category, and optional photos
- View all community reports with filtering and search
- Upvote reports to show community support
- Track report status updates from municipal officials
- View personal report history

### 🗺️ Interactive Map
- Display municipality boundaries using GeoJSON data
- Show reported issues as markers on the map
- Color-coded markers by report category
- User location integration

### 📱 Mobile-First Design
- Clean, intuitive interface optimized for mobile devices
- Responsive design that works on various screen sizes
- Smooth navigation with React Navigation
- Loading states and error handling throughout

## Technology Stack

- **Framework**: React Native with Expo managed workflow
- **Navigation**: React Navigation v6
- **Authentication**: Supabase Auth with JWT tokens
- **Maps**: React Native Maps
- **State Management**: React Hooks and Context API
- **HTTP Client**: Fetch API with custom service layer
- **UI Components**: Custom components with React Native Paper styling
- **Location Services**: Expo Location
- **Image Handling**: Expo Image Picker
- **Push Notifications**: Expo Notifications (ready for implementation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   └── reports/        # Report-specific components
├── config/             # Configuration files
│   ├── api.js         # API endpoints and constants
│   └── supabase.js    # Supabase client configuration
├── hooks/              # Custom React hooks
│   ├── useAuth.js     # Authentication hook
│   ├── useLocation.js # Location services hook
│   └── useReports.js  # Report management hooks
├── navigation/         # Navigation configuration
│   ├── AppNavigator.js    # Main app navigator
│   ├── AuthNavigator.js   # Authentication screens
│   └── MainNavigator.js   # Main app screens
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   └── main/          # Main application screens
└── services/           # API service layer
    ├── authService.js     # Authentication API calls
    ├── reportService.js   # Report management API calls
    ├── userService.js     # User profile API calls
    ├── municipalityService.js # Municipality data API calls
    └── locationService.js # Location services
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd citizens-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Update `src/config/supabase.js` with your Supabase project URL and anon key
   - Update `src/config/api.js` with your backend API URL

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   - Install Expo Go app on your mobile device
   - Scan the QR code from the terminal
   - Or press 'a' for Android emulator, 'i' for iOS simulator

### Building for Production

#### Android APK
```bash
# Build for Android
expo build:android

# Or using EAS Build (recommended)
npm install -g @expo/eas-cli
eas build --platform android
```

#### iOS App
```bash
# Build for iOS
expo build:ios

# Or using EAS Build (recommended)
eas build --platform ios
```

## Configuration

### Environment Variables
The app expects the following configuration in `src/config/`:

**supabase.js**:
```javascript
const supabaseUrl = 'your_supabase_project_url';
const supabaseAnonKey = 'your_supabase_anon_key';
```

**api.js**:
```javascript
export const API_BASE_URL = 'http://your-backend-url:3000/api';
```

### Permissions
The app requires the following permissions:
- Location access (for report location and map features)
- Camera access (for taking photos of issues)
- Photo library access (for selecting existing photos)

## API Integration

The app integrates with the Setshaba Connect backend API with the following endpoints:

- **Authentication**: `/auth/register`, `/auth/login`
- **User Management**: `/users/me`, `/users/:id`
- **Reports**: `/reports`, `/reports/mine`, `/reports/:id`
- **Municipalities**: `/municipalities`, `/municipalities/:id`
- **Upvotes**: `/reports/:id/upvote`
- **Status Updates**: `/reports/:reportId/status`

## Features in Detail

### Report Creation
- Auto-detect user location for report positioning
- Category selection with intuitive icons
- Photo attachment from camera or gallery
- Address auto-completion using reverse geocoding

### Community Engagement
- Upvote system to prioritize important issues
- View report details with status timeline
- Filter reports by category, status, or location

### Map Integration
- Municipality boundary visualization
- Report clustering for better performance
- Interactive markers with report previews
- User location tracking

### Profile Management
- Update personal information
- View report history and statistics
- Secure logout functionality

## Development

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Component-based architecture with reusable components

### Testing
- Unit tests for utility functions
- Integration tests for API services
- Component testing with React Native Testing Library

### Performance Optimizations
- Lazy loading of screens and components
- Image optimization and caching
- Efficient list rendering with FlatList
- Debounced search and filtering

## Deployment

### App Store Deployment
1. Configure app signing in `app.json`
2. Build production bundle with `expo build`
3. Submit to app stores using Expo's submission service

### Over-the-Air Updates
- Use Expo Updates for instant app updates
- Configure update channels for staging and production
- Automatic update checking and installation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

Built with ❤️ for better community engagement and municipal service delivery.