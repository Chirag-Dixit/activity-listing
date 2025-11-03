# Activity Listing Page

A cross-platform activity listing application for an online learning platform, built with React Native and Expo. This application displays learning activities (Classes and Assessments) with comprehensive filtering, sorting, and search capabilities.

## Features

### Core Functionality
- **Activity List**: Scrollable list of activities (Classes, Assignments, Quizzes, Discussions)
- **Activity Details**: 
  - **Classes**: Instructor name, date/time, duration, status (upcoming, live, completed, missed)
  - **Assessments**: Type, due date, submission status, progress indicator, points/grade
- **Filters**: 
  - Filter by activity type (Class, Assignment, Quiz, Discussion)
  - Filter by status (Upcoming, Live, In Progress, Completed, Overdue, Not Started)
  - Filter by program/course (AI & Machine Learning, Cloud Computing)
  - Search functionality
- **Sorting**: Sort by date, status, or type (ascending/descending)
- **Activity Statistics**: Overview dashboard showing counts by status and type
- **Pull-to-Refresh**: Refresh activity list on mobile devices
- **Dark/Light Mode**: Toggle between light and dark themes

### Visual Features
- **Status Indicators**: Color-coded chips for different activity statuses
- **Urgency Indicators**: Visual alerts for activities due within 24 hours
- **Progress Bars**: Visual progress indicators for in-progress activities
- **Responsive Design**: Works seamlessly on mobile and web devices

## Tech Stack

### Core Technologies
- **React Native** (v0.81.5): Cross-platform mobile framework
- **Expo** (v54.0.20): Development platform and tooling
- **React Native Web** (v0.21.0): Web support for React Native components
- **React Native Paper** (v5.14.5): Material Design component library for both web and native

### Why These Choices?
- **Expo**: Simplifies development and deployment across platforms. Provides excellent developer experience with hot reloading, easy asset management, and built-in tooling.
- **React Native Paper**: 
  - ✅ Supports both web and native platforms out of the box
  - ✅ Material Design components that look native on both platforms
  - ✅ Built-in theming (light/dark mode) support
  - ✅ Accessible components
- **React Native Web**: Enables code reuse between web and mobile, maintaining consistent behavior and appearance.

### Additional Libraries
- **React Navigation**: Navigation library for React Native
- **Axios**: HTTP client for API calls
- **Jest & React Native Testing Library**: Testing framework

### Tradeoffs

#### Expo vs Bare React Native
**Chosen: Expo**
- ✅ Faster setup and development
- ✅ Easier dependency management
- ✅ Built-in tooling for web and native builds
- ⚠️ Limited access to some native modules (not an issue for this project)

#### React Native Paper vs Other UI Libraries
**Chosen: React Native Paper**
- ✅ Excellent cross-platform support (web + native)
- ✅ Material Design provides familiar UX
- ✅ Comprehensive component set
- ✅ Built-in theming
- ⚠️ Slightly larger bundle size (acceptable tradeoff for feature richness)

#### State Management: Context API vs Redux
**Chosen: Context API**
- ✅ Simpler for this use case (filter state only)
- ✅ No additional dependencies
- ✅ Sufficient for current requirements
- ⚠️ Could migrate to Redux/Zustand if state becomes more complex

## Project Structure

```
activity-listing/
├── src/
│   ├── components/
│   │   ├── ActivityCard.js      # Individual activity card component
│   │   ├── FiltersBar.js        # Filter controls and search
│   │   └── ActivityStats.js     # Statistics overview component
│   ├── screens/
│   │   └── ActivitiesScreen.js  # Main screen with activity list
│   ├── contexts/
│   │   └── FiltersContext.js    # Filter state management
│   ├── api/
│   │   └── mockActivities.json  # Mock data for activities
│   ├── theme/
│   │   └── theme.js              # Light/dark theme configuration
│   └── __tests__/
│       ├── ActivityCard.test.js  # Component tests
│       └── ActivitiesScreen.test.js
├── App.js                        # Root component
├── index.js                      # Entry point
└── package.json                  # Dependencies and scripts
```

## Architecture Decisions

### Component Architecture
- **Component-based**: Each UI element is a reusable component
- **Separation of Concerns**: 
  - Components handle UI rendering
  - Context handles state management
  - Screens orchestrate components

### Data Flow
1. Activities are fetched from API (or mock data as fallback)
2. Activities are filtered based on user selections in FiltersContext
3. Filtered activities are sorted according to user preferences
4. Activities are rendered in a virtualized FlatList for performance

### Performance Optimizations
- **Virtualization**: FlatList only renders visible items
- **Memoization**: useMemo for filtered/sorted activities
- **Lazy Rendering**: initialNumToRender limits initial items
- **Platform-specific optimizations**: removeClippedSubviews on native

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- For iOS: Xcode (macOS only)
- For Android: Android Studio with Android SDK

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd activity-listing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running on Web

```bash
npm run web
```

This will:
- Start the Expo development server
- Open the app in your default browser
- Enable hot reloading for development

**Note**: The app will attempt to connect to `http://localhost:4000/activities` for API data. If json-server is not running, it will fall back to the bundled mock data.

### Running on Mobile

#### iOS (macOS only)

```bash
npm run ios
```

This will:
- Build and launch the iOS simulator
- Install the app automatically
- Start with hot reloading

#### Android

```bash
npm run android
```

Prerequisites:
- Android Studio installed
- Android SDK configured
- Android emulator running OR physical device connected with USB debugging enabled

This will:
- Build and install the app on the connected device/emulator
- Start the Metro bundler
- Enable hot reloading

### Optional: Using JSON Server for API Data

To use a live API server instead of mock data:

1. **Install json-server globally** (if not already installed)
   ```bash
   npm install -g json-server
   ```

2. **Start the mock API server**
   ```bash
   npm run mock:api
   ```

3. **The app will automatically connect to** `http://localhost:4000/activities`

## Building for Production

### Web Build

```bash
expo build:web
```

This creates an optimized production build in the `web-build` directory that can be deployed to any static hosting service.

### Mobile Builds

#### iOS
```bash
expo build:ios
```

Or use EAS Build:
```bash
eas build --platform ios
```

#### Android
```bash
expo build:android
```

Or use EAS Build:
```bash
eas build --platform android
```

## Testing

Run tests with:
```bash
npm test
```

The project includes:
- Component tests using Jest and React Native Testing Library
- Tests for ActivityCard component covering various activity types and states
- Mock data for testing scenarios

## Limitations

1. **API Integration**: Currently uses mock data. Real API integration would require:
   - Authentication handling
   - Error handling for network failures
   - Caching strategies
   - Pagination for large datasets

2. **Navigation**: Basic navigation structure. Full implementation would include:
   - Activity detail screens
   - Profile/settings screens
   - Deep linking

3. **Offline Support**: No offline caching or sync capabilities

4. **Real-time Updates**: No WebSocket or real-time activity status updates

5. **Accessibility**: Basic accessibility features. Could be enhanced with:
   - Screen reader optimizations
   - Keyboard navigation improvements
   - High contrast mode support

6. **Performance**: For very large datasets (1000+ activities), consider:
   - Pagination
   - Virtual scrolling optimizations
   - Index-based filtering

## Future Improvements

### Short-term
- [ ] Activity detail screen with full information
- [ ] Mark activities as favorite/bookmark
- [ ] Calendar view for activities
- [ ] Notification integration for upcoming activities
- [ ] Export activity list (PDF/CSV)

### Medium-term
- [ ] User authentication and personalization
- [ ] Real-time activity status updates
- [ ] Offline mode with local caching
- [ ] Advanced filtering (date ranges, tags)
- [ ] Activity recommendations based on progress

### Long-term
- [ ] Multi-language support
- [ ] Integration with learning management systems
- [ ] Analytics dashboard for learning progress
- [ ] Social features (peer discussions, group activities)
- [ ] AI-powered activity suggestions

## Troubleshooting

### Web: Activities not loading
- Check browser console for errors
- Verify mock data file exists at `src/api/mockActivities.json`
- If using json-server, ensure it's running on port 4000

### iOS: Build fails
- Ensure Xcode is installed and up to date
- Run `cd ios && pod install` to install CocoaPods dependencies
- Check that iOS simulator is available

### Android: Build fails
- Ensure Android SDK is properly configured
- Check that ANDROID_HOME environment variable is set
- Verify emulator or device is connected: `adb devices`

### General Issues
- Clear cache: `expo start -c`
- Reset node_modules: `rm -rf node_modules && npm install`
- Check Expo CLI version: `expo --version`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created for assessment purposes.

## Contact

For questions or issues, please open an issue in the GitHub repository.

