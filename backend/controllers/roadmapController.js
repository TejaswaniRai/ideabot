const { generateRoadmap } = require('../services/openRouterAI');
const logger = require('../config/logger');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate roadmap based on idea and team using OpenRouter AI
exports.generateRoadmap = asyncHandler(async (req, res) => {
  const { idea, team, projectIdea, teamProfile } = req.body;

  // Support both old and new parameter names
  const projectData = projectIdea || idea;
  const teamData = teamProfile || team;

  logger.info('Generating roadmap for project');

  // Generate roadmap using OpenRouter AI (no database)
  const roadmapData = await generateRoadmap(projectData, teamData);
  logger.info('Successfully generated roadmap');

  res.json({
    ...roadmapData,
    projectIdea: projectData,
    teamProfile: teamData,
    createdAt: new Date().toISOString()
  });
});

// Update task completion status (stateless mode)
exports.updateTask = asyncHandler(async (req, res) => {
  const { roadmapId, phaseIndex, taskIndex, completed } = req.body;

  logger.debug(`Task updated - Phase: ${phaseIndex}, Task: ${taskIndex}, Completed: ${completed}`);

  // Return success without database persistence
  res.json({ 
    message: 'Task updated',
    phaseIndex,
    taskIndex,
    completed
  });
});
