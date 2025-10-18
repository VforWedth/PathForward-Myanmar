/**
 * Environment Variable Validator
 *
 * Validates required environment variables at build time and runtime
 * Provides clear error messages for misconfigurations
 */

interface EnvConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_SERVER_URL: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a URL format
 */
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates all required environment variables
 */
export const validateEnvironment = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Check if required variables are set
  if (!apiUrl) {
    warnings.push('NEXT_PUBLIC_API_URL is not set. Using fallback: http://localhost:5000/api');
  }

  if (!serverUrl) {
    warnings.push('NEXT_PUBLIC_SERVER_URL is not set. Using fallback: http://localhost:5000');
  }

  // Validate URL formats
  if (apiUrl && !isValidUrl(apiUrl)) {
    errors.push(
      `NEXT_PUBLIC_API_URL is not a valid URL: "${apiUrl}"\n` +
      `  Expected format: https://your-backend.up.railway.app/api\n` +
      `  Make sure to include the protocol (https://)`
    );
  }

  if (serverUrl && !isValidUrl(serverUrl)) {
    errors.push(
      `NEXT_PUBLIC_SERVER_URL is not a valid URL: "${serverUrl}"\n` +
      `  Expected format: https://your-backend.up.railway.app\n` +
      `  Make sure to include the protocol (https://)`
    );
  }

  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    if (apiUrl && !apiUrl.startsWith('https://')) {
      errors.push(
        `NEXT_PUBLIC_API_URL must use HTTPS in production. Current: "${apiUrl}"`
      );
    }

    if (serverUrl && !serverUrl.startsWith('https://')) {
      errors.push(
        `NEXT_PUBLIC_SERVER_URL must use HTTPS in production. Current: "${serverUrl}"`
      );
    }

    // Check for localhost in production
    if (apiUrl && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'))) {
      errors.push(
        'NEXT_PUBLIC_API_URL points to localhost in production. This will not work for deployed applications.'
      );
    }

    if (serverUrl && (serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1'))) {
      errors.push(
        'NEXT_PUBLIC_SERVER_URL points to localhost in production. This will not work for deployed applications.'
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Logs validation results to console
 */
export const logValidationResults = (result: ValidationResult): void => {
  if (result.warnings.length > 0) {
    console.group('⚠️  Environment Variable Warnings:');
    result.warnings.forEach(warning => console.warn(`  • ${warning}`));
    console.groupEnd();
  }

  if (result.errors.length > 0) {
    console.group('❌ Environment Variable Errors:');
    result.errors.forEach(error => console.error(`  • ${error}`));
    console.groupEnd();
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ All environment variables are properly configured');
  }
};

/**
 * Gets the current environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'
  };
};

/**
 * Validates environment and logs results (call this on app initialization)
 */
export const validateAndLogEnv = (): void => {
  // Only run in browser
  if (typeof window === 'undefined') return;

  const result = validateEnvironment();
  logValidationResults(result);

  // In development, also log the current configuration
  if (process.env.NODE_ENV === 'development') {
    console.group('🔧 Current Environment Configuration:');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || '(not set)');
    console.log('Server URL:', process.env.NEXT_PUBLIC_SERVER_URL || '(not set)');
    console.log('Environment:', process.env.NODE_ENV);
    console.groupEnd();
  }
};

export default {
  validateEnvironment,
  logValidationResults,
  getEnvConfig,
  validateAndLogEnv
};
