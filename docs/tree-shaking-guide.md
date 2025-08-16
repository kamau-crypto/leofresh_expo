# Tree Shaking Configuration Guide

## Overview
Tree shaking has been configured to remove unused code and optimize bundle size in your Expo project.

## Configuration Files

### 1. Metro Configuration (`metro.config.js`)
- Enables dead code elimination
- Configures minification settings
- Optimizes resolver for ES modules
- Removes console.logs in production

### 2. Babel Configuration (`babel.config.js`)
- Enables ES module preservation for tree shaking
- Adds lodash tree shaking support
- Removes console statements in production
- Enables dead code elimination plugins

### 3. EAS Build Configuration (`eas.json`)
- Enables Hermes engine for better optimization
- Enables ProGuard for Android builds
- Enables resource shrinking

## Best Practices for Tree Shaking

### 1. Use Named Imports
```javascript
// ✅ Good - allows tree shaking
import { Button } from 'react-native-paper';

// ❌ Bad - imports entire library
import * as Paper from 'react-native-paper';
```

### 2. Use ES Modules
```javascript
// ✅ Good - ES module export
export const myFunction = () => {};

// ❌ Bad - CommonJS export
module.exports = { myFunction };
```

### 3. Avoid Side Effects in Modules
```javascript
// ✅ Good - pure module
export const utils = {
  format: (text) => text.trim()
};

// ❌ Bad - has side effects
console.log('Module loaded'); // This prevents tree shaking
export const utils = {
  format: (text) => text.trim()
};
```

### 4. Use Conditional Imports
```javascript
// ✅ Good - conditional import
if (__DEV__) {
  const { logger } = await import('./dev-logger');
  logger.init();
}
```

### 5. Mark Pure Functions
```javascript
// ✅ Good - marked as pure
/*#__PURE__*/ const expensiveCalculation = () => {
  return heavyComputation();
};
```

## Library-Specific Optimizations

### React Native Paper
Already configured with `react-native-paper/babel` plugin for optimal tree shaking.

### Lodash
Configured with `babel-plugin-lodash` for automatic tree shaking:
```javascript
// ✅ This will only import the debounce function
import { debounce } from 'lodash';
```

### Date-fns
Use specific imports:
```javascript
// ✅ Good
import { format } from 'date-fns';

// ❌ Bad
import * as dateFns from 'date-fns';
```

## Verification

### 1. Bundle Analysis
Use Expo Atlas to analyze your bundle:
```bash
npx expo-atlas
```

### 2. Build Size Comparison
Compare build sizes before and after tree shaking:
```bash
# Build with tree shaking
eas build --profile production --platform android

# Check APK size in the build artifacts
```

### 3. Metro Bundle Visualization
Enable bundle visualization in development:
```bash
npx expo start --dev-client
# Open http://localhost:8081/symbolicate in browser
```

## Environment Variables

Tree shaking behavior is controlled by:
- `NODE_ENV=production` - Enables production optimizations
- `EXPO_USE_HERMES=true` - Enables Hermes engine optimizations
- `EXPO_USE_METRO_SERIALIZER=true` - Enables Metro serializer optimizations

## Troubleshooting

### Common Issues

1. **Module not tree-shaken**: Check if module has side effects
2. **Build errors**: Ensure all babel plugins are installed
3. **Large bundle size**: Use bundle analyzer to identify heavy imports

### Debug Tree Shaking
Add this to your metro config for debugging:
```javascript
// In metro.config.js
config.transformer.minifierConfig.keep_fnames = true; // Keep function names for debugging
```

## Performance Impact

Expected improvements:
- 20-40% reduction in bundle size
- Faster app startup times
- Reduced memory usage
- Better performance on low-end devices