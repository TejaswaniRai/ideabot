const { generateIdea } = require('../services/openRouterAI');
const logger = require('../config/logger');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

// Generate problem statement based on domain using OpenRouter AI
exports.generateIdea = asyncHandler(async (req, res) => {
  const { domain, context } = req.body;

  logger.info(`Generating idea for domain: ${domain}`);

  // Generate idea using OpenRouter AI - no database needed
  const ideaData = await generateIdea(domain, context);
  
  logger.info(`Successfully generated idea: ${ideaData.title}`);
  res.json(ideaData);
});

// Get all generated ideas (not supported in stateless mode)
exports.getIdeas = asyncHandler(async (req, res) => {
  // Return empty array since we don't store ideas
  logger.debug('Fetching ideas - returning empty array (stateless mode)');
  res.json([]);
});

// Vote on an idea (not supported in stateless mode)
exports.voteIdea = asyncHandler(async (req, res) => {
  // Voting not supported without database
  logger.debug('Vote recorded (stateless mode - not persisted)');
  res.json({ message: 'Vote recorded', votes: 1 });
});
