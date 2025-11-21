/**
 * Environment validation utility
 * Validates that all required environment variables are set before starting the server
 */

const logger = require('./logger');

const requiredEnvVars = [
  {
    name: 'OPENROUTER_API_KEY',
    description: 'OpenRouter API key for AI features',
    critical: true,
  },
];

const optionalEnvVars = [
  {
    name: 'PORT',
    description: 'Server port',
    default: '5000',
  },
  {
    name: 'NODE_ENV',
    description: 'Environment mode (development, production, test)',
    default: 'development',
  },
  {
    name: 'CORS_ORIGIN',
    description: 'Allowed CORS origins',
    default: '*',
    productionWarning: 'Should be set to specific domain in production, not "*"',
  },
  {
    name: 'RATE_LIMIT_MAX',
    description: 'Maximum requests per 15 minutes per IP',
    default: '100',
  },
  {
    name: 'LOG_LEVEL',
    description: 'Logging level (debug, info, warn, error)',
    default: 'info',
  },
  {
    name: 'MONGODB_URI',
    description: 'MongoDB connection string (optional)',
    default: null,
  },
];

/**
 * Validate required environment variables
 * @returns {boolean} true if all required vars are set
 */
function validateEnv() {
  let isValid = true;
  const errors = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(({ name, description, critical }) => {
    if (!process.env[name]) {
      if (critical) {
        errors.push(`❌ Missing required env var: ${name} (${description})`);
        isValid = false;
      } else {
        warnings.push(`⚠️  Optional env var not set: ${name} (${description})`);
      }
    } else {
      logger.info(`✅ ${name} is configured`);
    }
  });

  // Check optional variables and set defaults
  optionalEnvVars.forEach(({ name, description, default: defaultValue, productionWarning }) => {
    if (!process.env[name]) {
      if (defaultValue !== null) {
        process.env[name] = defaultValue;
        logger.info(`ℹ️  ${name} not set, using default: ${defaultValue}`);
      }
    } else {
      // Check for production warnings
      if (productionWarning && process.env.NODE_ENV === 'production' && process.env[name] === defaultValue) {
        warnings.push(`⚠️  ${name}: ${productionWarning}`);
      }
    }
  });

  // Log warnings
  if (warnings.length > 0) {
    logger.warn('\nEnvironment Warnings:');
    warnings.forEach(warning => logger.warn(warning));
  }

  // Log errors
  if (errors.length > 0) {
    logger.error('\nEnvironment Errors:');
    errors.forEach(error => logger.error(error));
    logger.error('\nPlease check your .env file and ensure all required variables are set.');
    logger.error('Refer to .env.example for the required configuration.\n');
  }

  return isValid;
}

/**
 * Log environment configuration summary
 */
function logEnvSummary() {
  logger.info('\n=== Environment Configuration ===');
  logger.info(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Server Port: ${process.env.PORT || '5000'}`);
  logger.info(`CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);
  logger.info(`Rate Limit: ${process.env.RATE_LIMIT_MAX || '100'} requests/15min`);
  logger.info(`Log Level: ${process.env.LOG_LEVEL || 'info'}`);
  logger.info(`Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured (using stateless mode)'}`);
  logger.info('================================\n');
}

module.exports = {
  validateEnv,
  logEnvSummary,
};
