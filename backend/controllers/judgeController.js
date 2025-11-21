const { predictJudgeScore } = require('../services/openRouterAI');
const logger = require('../config/logger');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Predict judge scores for a hackathon project
 */
exports.predictScore = asyncHandler(async (req, res) => {
  const { idea, roadmap, techStack, teamSize } = req.body;

  const projectData = {
    idea: idea.trim(),
    roadmap: roadmap?.trim() || '',
    techStack: techStack?.trim() || '',
    teamSize: teamSize ? parseInt(teamSize) : null,
  };

  logger.info('Predicting judge scores for project');
  const prediction = await predictJudgeScore(projectData);
  logger.info('Successfully generated judge prediction');

  res.json({
    success: true,
    prediction,
  });
});
