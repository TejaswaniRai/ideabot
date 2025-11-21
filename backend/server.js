const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const logger = require('./config/logger');
const { validateEnv, logEnvSummary } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Validate environment variables before starting
if (!validateEnv()) {
  logger.error('Server cannot start due to missing required environment variables');
  process.exit(1);
}

// Log environment summary
logEnvSummary();

// No database - fully stateless with OpenRouter AI
const ideaRoutes = require('./routes/ideas');
const teamRoutes = require('./routes/teams');
const roadmapRoutes = require('./routes/roadmaps');
const hackathonRoutes = require('./routes/hackathons');
const judgeRoutes = require('./routes/judge');
const techStackRoutes = require('./routes/tech-stack');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware - helmet sets various HTTP headers for security
app.use(helmet());

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Compression middleware to reduce response size
app.use(compression());

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/ideas', ideaRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/tech-stack', techStackRoutes);

// Health check with detailed status
app.get('/api/health', (req, res) => {
  const healthcheck = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    apiKey: process.env.OPENROUTER_API_KEY ? 'configured' : 'missing',
  };
  
  try {
    res.json(healthcheck);
  } catch (error) {
    healthcheck.status = 'error';
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to IdeaBot API',
    version: '1.0.0',
    endpoints: {
      ideas: '/api/ideas',
      teams: '/api/teams',
      roadmaps: '/api/roadmaps',
      hackathons: '/api/hackathons',
      judge: '/api/judge',
      techStack: '/api/tech-stack',
      health: '/api/health'
    }
  });
});

// 404 handler - must be before error handler
app.use(notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing server shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const server = app.listen(PORT, () => {
  logger.info(`🚀 IdeaBot server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API documentation available at http://localhost:${PORT}`);
});

module.exports = app;
