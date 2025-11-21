const { suggestTechStack } = require('../services/openRouterAI');

/**
 * Suggest tech stack and architecture for a project
 */
exports.suggest = async (req, res) => {
  try {
    const { idea, domain, preferredLanguages, roadmap } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Project idea is required',
      });
    }

    if (!domain || !domain.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Domain is required',
      });
    }

    const projectData = {
      idea: idea.trim(),
      domain: domain.trim(),
      preferredLanguages: preferredLanguages?.trim() || '',
      roadmap: roadmap?.trim() || '',
    };

    const suggestion = await suggestTechStack(projectData);

    res.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error('Error suggesting tech stack:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate tech stack suggestions',
    });
  }
};
