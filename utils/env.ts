import Constants from 'expo-constants';

// Environment configuration
export const ENV = {
  // Get environment variables from process.env or expo constants
  NODE_ENV: process.env.NODE_ENV || Constants.expoConfig?.extra?.NODE_ENV || 'development',
  API_BASE_URL: process.env.API_BASE_URL || Constants.expoConfig?.extra?.API_BASE_URL || 'https://api.hillfresh.com',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true' || Constants.expoConfig?.extra?.DEBUG_MODE === 'true',
  LOG_LEVEL: process.env.LOG_LEVEL || Constants.expoConfig?.extra?.LOG_LEVEL || 'info',
  APP_VARIANT: process.env.APP_VARIANT || Constants.expoConfig?.extra?.APP_VARIANT || 'production',
};

// Helper functions
export const isDevelopment = () => ENV.NODE_ENV === 'development';
export const isProduction = () => ENV.NODE_ENV === 'production';
export const isPreview = () => ENV.APP_VARIANT === 'preview';

// Debug logging
export const debugLog = (...args: any[]) => {
  if (ENV.DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
};

export default ENV;