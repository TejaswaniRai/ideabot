const { suggestTopics } = require('../services/openRouterAI');

// Create team profile (stateless - just return the data)
exports.createTeam = async (req, res) => {
  try {
    const { name, size, skills, techStack, experience, interests } = req.body;

    if (!name || !size) {
      return res.status(400).json({ error: 'Name and size are required' });
    }

    // Return team data with timestamp (no database)
    res.json({ 
      name, 
      size, 
      skills: skills || [], 
      techStack: techStack || [], 
      experience: experience || 'Intermediate',
      interests: interests || '',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get topic suggestions based on team profile using OpenRouter AI
exports.suggestTopics = async (req, res) => {
  try {
    const teamProfile = req.body;

    if (!teamProfile.teamSize && !teamProfile.size) {
      return res.status(400).json({ error: 'Team size is required' });
    }

    // Normalize the team profile
    const normalizedProfile = {
      teamSize: teamProfile.teamSize || teamProfile.size,
      skills: teamProfile.skills || [],
      experience: teamProfile.experience || 'Intermediate',
      interests: teamProfile.interests || ''
    };

    // Generate topics using OpenRouter AI
    const topics = await suggestTopics(normalizedProfile);

    res.json({ topics });
  } catch (error) {
    console.error('Error suggesting topics:', error);
    res.status(500).json({ error: error.message });
  }
};
