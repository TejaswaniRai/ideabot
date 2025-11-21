const fetch = require('node-fetch');

// Security: Load API key from environment variables only
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'x-ai/grok-4.1-fast:free';

// Validate API key on module load
if (!OPENROUTER_API_KEY) {
  console.error('ERROR: OPENROUTER_API_KEY is not set in environment variables');
  console.error('Please create a .env file in the backend directory with OPENROUTER_API_KEY=your-key-here');
}

/**
 * Call OpenRouter API with reasoning enabled
 */
async function callOpenRouter(messages, enableReasoning = true) {
  // Security check: Ensure API key exists before making request
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured. Please set it in your .env file.');
  }

  try {
    const requestBody = {
      model: MODEL,
      messages: messages,
    };

    // Add reasoning parameter only if enabled
    if (enableReasoning) {
      requestBody.reasoning = { enabled: true };
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0].message;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
}

/**
 * Generate hackathon ideas based on domain
 */
async function generateIdea(domain, userContext = '') {
  // Extract tech stack from user context if provided
  const techStackMatch = userContext.match(/Tech Stack:\s*([^,]+(?:,[^,]+)*?)(?:,\s*Experience:|$)/i);
  const userTechStack = techStackMatch ? techStackMatch[1].trim() : '';
  
  const skillsMatch = userContext.match(/Skills:\s*([^,]+(?:,[^,]+)*?)(?:,\s*Tech Stack:|$)/i);
  const userSkills = skillsMatch ? skillsMatch[1].trim() : '';
  
  const experienceMatch = userContext.match(/Experience:\s*(\w+)/i);
  const userExperience = experienceMatch ? experienceMatch[1] : 'Intermediate';
  
  const teamSizeMatch = userContext.match(/Size:\s*(\d+)/i);
  const teamSize = teamSizeMatch ? parseInt(teamSizeMatch[1]) : 3;

  let techStackInstruction = '';
  if (userTechStack) {
    techStackInstruction = `\nIMPORTANT: The user's tech stack is: ${userTechStack}
You MUST build the idea around these technologies. The "techStack" field should primarily use these technologies: ${userTechStack}.
You can add 1-2 complementary technologies if absolutely necessary, but the core stack MUST be: ${userTechStack}`;
  }

  let skillsInstruction = '';
  if (userSkills) {
    skillsInstruction = `\nUser's skills: ${userSkills}
Ensure the idea leverages these skills.`;
  }

  const prompt = `You are an expert hackathon mentor and cutting-edge technology advisor. Generate a highly innovative, advanced hackathon project idea for the "${domain}" domain.

CRITICAL: Before generating the idea, THINK DEEPLY about:
- Team size: ${teamSize} members
- Skill level: ${userExperience}
- Tech stack: ${userTechStack || 'flexible'}
- Hackathon duration: 24-48 hours
- Domain/theme: ${domain}
- What would make judges say "WOW!"

${userContext ? `User context: ${userContext}` : ''}
${techStackInstruction}
${skillsInstruction}

Provide a response in the following JSON format:
{
  "title": "Project Title",
  "problemStatement": {
    "problem": "What problem exists and why it matters",
    "impact": "Scale and significance of the impact",
    "existingSolutions": "Why existing solutions fail or are inadequate",
    "statistics": "Relevant stats or examples that highlight the problem's urgency"
  },
  "description": "Detailed description highlighting technical innovation and complexity (3-4 sentences)",
  "targetAudience": "Who will benefit from this",
  "whyThisCanWin": [
    "Uniqueness: Why this stands out from typical hackathon projects",
    "Innovation: What cutting-edge approach or technology makes this special",
    "Real-world demand: Market need and practical applications",
    "Judges' appeal: Why judges will be impressed (technical depth, impact, presentation potential)",
    "Feasibility: Why this is achievable in ${teamSize === 1 ? 'a solo' : teamSize + '-person team'} within 24-48 hours",
    "Scalability: Post-hackathon potential and growth opportunities",
    "X-factor: The unique element that could make this a winning project"
  ],
  "impact": "Expected impact and benefits - be specific about scale and significance",
  "techStack": ${userTechStack ? `["${userTechStack.split(',').map(t => t.trim()).join('", "')}"]` : '["Technology 1", "Technology 2", "Technology 3"]'} (use the user's tech stack),
  "difficulty": "${userExperience}",
  "estimatedTime": "Realistic time breakdown for ${teamSize}-person team (e.g., '24 hours: 6hrs planning, 14hrs dev, 4hrs polish')",
  "innovationFactor": "What makes this idea cutting-edge and unique",
  "winningProbability": "High/Medium - brief justification based on innovation, feasibility, and impact"
}

${userTechStack ? `CRITICAL: Your response MUST use the technologies from this tech stack: ${userTechStack}. Do not suggest different technologies.` : ''}

Focus on:
- Using the user's specified tech stack (${userTechStack || 'any modern technologies'})
- ${userExperience === 'Advanced' ? 'Complex, ambitious ideas that push boundaries' : userExperience === 'Beginner' ? 'Achievable yet innovative ideas with clear milestones' : 'Moderately challenging innovative ideas that balance ambition with feasibility'}
- Ideas that solve REAL problems with measurable impact
- Projects that can realistically be built by a ${teamSize}-person team in a hackathon
- Technical sophistication appropriate for ${userExperience} level
- Elements that make judges excited: innovation + impact + execution

Make it technically sophisticated, intellectually challenging, and highly innovative while respecting the user's technology choices and team constraints.`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callOpenRouter(messages);
  
  try {
    // Try to parse JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const ideaData = JSON.parse(jsonMatch[0]);
      return {
        domain,
        ...ideaData,
        createdAt: new Date().toISOString(),
      };
    }
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError);
  }

  // Fallback: return raw response in a structured format
  return {
    domain,
    title: `${domain} Innovation Project`,
    description: response.content,
    targetAudience: 'General users',
    impact: 'Positive social impact',
    techStack: ['Modern web technologies'],
    difficulty: 'Intermediate',
    estimatedTime: '24-48 hours',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Suggest topics based on team profile
 */
async function suggestTopics(teamProfile) {
  const { teamSize, skills, experience, interests } = teamProfile;

  const prompt = `You are a hackathon coach. Based on this team profile, suggest 5 specific project topics they should consider:

Team Size: ${teamSize} members
Skills: ${skills?.join(', ') || 'Not specified'}
Experience Level: ${experience || 'Not specified'}
Interests: ${interests || 'Not specified'}

Provide 5 specific project topics as a JSON array:
[
  {
    "title": "Topic Title",
    "description": "Why this topic suits the team (1-2 sentences)",
    "difficulty": "Beginner/Intermediate/Advanced",
    "requiredSkills": ["Skill 1", "Skill 2"]
  }
]

Make suggestions realistic for their skill level and interests.`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callOpenRouter(messages);

  try {
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const topics = JSON.parse(jsonMatch[0]);
      return topics;
    }
  } catch (parseError) {
    console.error('Failed to parse topics response:', parseError);
  }

  // Fallback topics
  return [
    {
      title: 'AI-Powered Solution',
      description: 'Build something with AI based on your team interests',
      difficulty: experience || 'Intermediate',
      requiredSkills: skills || ['Programming'],
    },
  ];
}

/**
 * Generate project roadmap
 */
async function generateRoadmap(projectIdea, teamProfile = {}) {
  const { teamSize = 3, experience = 'Intermediate' } = teamProfile;

  const prompt = `You are a hackathon project manager. Create a detailed 5-phase roadmap for this project:

Project: ${projectIdea.title || projectIdea}
Description: ${projectIdea.description || 'Build this project'}
Team Size: ${teamSize} members
Experience: ${experience}

Create a roadmap with 5 phases (Ideation, Design, Development, Testing, Deployment). 
Provide response as JSON with this EXACT structure:
{
  "phases": [
    {
      "name": "Phase Name",
      "duration": "Time estimate",
      "description": "What to do in this phase",
      "tasks": [
        {"title": "Task name", "description": "Task details", "completed": false}
      ],
      "deliverables": ["Deliverable 1", "Deliverable 2"]
    }
  ],
  "totalEstimate": "Overall time estimate",
  "recommendations": ["Tip 1", "Tip 2", "Tip 3"],
  "resources": ["Resource 1", "Resource 2"],
  "techStack": ["Tech 1", "Tech 2", "Tech 3"]
}

Be realistic for a hackathon timeline (24-48 hours). Each phase should have 3-4 tasks with title and description.`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callOpenRouter(messages);

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const roadmapData = JSON.parse(jsonMatch[0]);
      
      // Ensure tasks have correct structure
      if (roadmapData.phases) {
        roadmapData.phases = roadmapData.phases.map(phase => ({
          ...phase,
          name: phase.name || phase.phase,
          tasks: Array.isArray(phase.tasks) 
            ? phase.tasks.map(task => 
                typeof task === 'string' 
                  ? { title: task, description: '', completed: false }
                  : { ...task, completed: task.completed || false }
              )
            : []
        }));
      }
      
      return roadmapData;
    }
  } catch (parseError) {
    console.error('Failed to parse roadmap response:', parseError);
  }

  // Fallback roadmap
  return {
    phases: [
      {
        name: 'Ideation',
        duration: '2-3 hours',
        description: 'Define problem and solution',
        tasks: [
          { title: 'Research the problem', description: 'Understand user needs and pain points', completed: false },
          { title: 'Define core features', description: 'List must-have features for MVP', completed: false },
          { title: 'Create wireframes', description: 'Sketch basic UI layout', completed: false }
        ],
        deliverables: ['Problem statement', 'Feature list'],
      },
      {
        name: 'Design',
        duration: '3-4 hours',
        description: 'Design UI/UX and architecture',
        tasks: [
          { title: 'Create mockups', description: 'Design visual interface in Figma/Adobe XD', completed: false },
          { title: 'Design database schema', description: 'Plan data models and relationships', completed: false },
          { title: 'Plan API endpoints', description: 'Define backend routes and data flow', completed: false }
        ],
        deliverables: ['UI mockups', 'Architecture diagram'],
      },
      {
        name: 'Development',
        duration: '12-16 hours',
        description: 'Build the application',
        tasks: [
          { title: 'Set up project structure', description: 'Initialize frontend and backend', completed: false },
          { title: 'Implement core features', description: 'Build main functionality', completed: false },
          { title: 'Integrate components', description: 'Connect frontend with backend', completed: false }
        ],
        deliverables: ['Working prototype'],
      },
      {
        name: 'Testing',
        duration: '2-3 hours',
        description: 'Test and fix bugs',
        tasks: [
          { title: 'Test all features', description: 'Check functionality across different scenarios', completed: false },
          { title: 'Fix critical bugs', description: 'Address any issues found during testing', completed: false },
          { title: 'Optimize performance', description: 'Improve load times and responsiveness', completed: false }
        ],
        deliverables: ['Tested application'],
      },
      {
        name: 'Deployment & Presentation',
        duration: '2-3 hours',
        description: 'Deploy and present',
        tasks: [
          { title: 'Deploy application', description: 'Host on Vercel/Netlify/Heroku', completed: false },
          { title: 'Prepare presentation', description: 'Create slides and demo script', completed: false },
          { title: 'Create demo video', description: 'Record walkthrough of key features', completed: false }
        ],
        deliverables: ['Live application', 'Presentation', 'Demo video'],
      },
    ],
    totalEstimate: '24-30 hours',
    recommendations: [
      'Start with MVP features only',
      'Test early and often',
      'Keep the demo simple and impactful',
      'Practice your pitch before presenting'
    ],
    resources: ['Documentation', 'Stack Overflow', 'GitHub', 'Team collaboration tools'],
    techStack: projectIdea.techStack || ['React', 'Node.js', 'MongoDB'],
  };
}

/**
 * General chat function for conversational AI with reasoning support
 */
async function chat(userMessage, conversationHistory = []) {
  const messages = [
    {
      role: 'system',
      content: 'You are IdeaBot, an AI assistant specialized in helping hackathon participants. You help with idea generation, project planning, technical guidance, and motivation. Be concise, practical, and encouraging.',
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ];

  const response = await callOpenRouter(messages, true);
  
  // Prepare the response with reasoning details preserved
  const assistantMessage = {
    role: 'assistant',
    content: response.content,
  };
  
  // Preserve reasoning_details if present (pass back unmodified for continued reasoning)
  if (response.reasoning_details) {
    assistantMessage.reasoning_details = response.reasoning_details;
  }

  return {
    message: response.content,
    reasoning: response.reasoning_details || null,
    assistantMessage: assistantMessage, // Include full message for conversation continuation
    timestamp: new Date().toISOString(),
  };
}

/**
 * Predict judge scores for a hackathon project
 */
async function predictJudgeScore(projectData) {
  const { idea, roadmap, techStack, teamSize } = projectData;

  const prompt = `You are an experienced hackathon judge evaluating projects. Analyze this hackathon project and provide detailed scoring predictions.

PROJECT DETAILS:
Idea: ${idea}

${roadmap ? `Roadmap: ${roadmap}` : ''}

${techStack ? `Tech Stack: ${techStack}` : ''}

${teamSize ? `Team Size: ${teamSize} members` : ''}

As a judge, evaluate this project on 5 key criteria and provide scores from 0-100:

1. INNOVATION SCORE (0-100):
   - Novelty of the idea
   - Creativity in approach
   - Originality compared to existing solutions
   
2. FEASIBILITY SCORE (0-100):
   - Can it be built in 24-72 hours?
   - Resource requirements
   - Technical difficulty vs team capability
   
3. TECHNICAL DEPTH SCORE (0-100):
   - Architecture complexity
   - Use of advanced technologies (ML/APIs/Cloud)
   - Code quality expectations
   
4. IMPACT SCORE (0-100):
   - Real-world usefulness
   - Social or business value
   - Scalability potential
   
5. PRESENTATION SCORE (0-100):
   - Clarity of problem/solution
   - Pitch potential
   - Demo-friendliness

Provide your evaluation in this EXACT JSON format:
{
  "innovationScore": {
    "score": 85,
    "reason": "Why you gave this score (2-3 sentences)",
    "improvement": "Specific actionable advice to improve this score"
  },
  "feasibilityScore": {
    "score": 75,
    "reason": "Why you gave this score (2-3 sentences)",
    "improvement": "Specific actionable advice to improve this score"
  },
  "technicalDepthScore": {
    "score": 70,
    "reason": "Why you gave this score (2-3 sentences)",
    "improvement": "Specific actionable advice to improve this score"
  },
  "impactScore": {
    "score": 80,
    "reason": "Why you gave this score (2-3 sentences)",
    "improvement": "Specific actionable advice to improve this score"
  },
  "presentationScore": {
    "score": 65,
    "reason": "Why you gave this score (2-3 sentences)",
    "improvement": "Specific actionable advice to improve this score"
  },
  "overallWinningProbability": 75,
  "overallReview": "A comprehensive 3-4 sentence review from a judge's perspective, highlighting strengths and areas for improvement",
  "keyRecommendations": [
    "Top recommendation to increase winning chances",
    "Second most important recommendation",
    "Third recommendation",
    "Fourth recommendation",
    "Fifth recommendation"
  ],
  "nextBestImprovement": {
    "criterion": "Name of the criterion that would have the biggest impact if improved (Innovation/Feasibility/Technical Depth/Impact/Presentation)",
    "currentScore": 70,
    "potentialScore": 85,
    "action": "Specific detailed action to take to improve this score (2-3 sentences)",
    "expectedImpact": "How this would affect the overall winning probability (e.g., 'Would increase overall winning probability from 75% to 82%')"
  },
  "competitorComparison": {
    "typicalCompetitorScore": 65,
    "yourAdvantages": [
      "Specific advantage 1 over typical competitors",
      "Specific advantage 2 over typical competitors",
      "Specific advantage 3 over typical competitors"
    ],
    "competitorAdvantages": [
      "What typical competitors might do better",
      "Another area where competitors might excel",
      "Third competitive weakness to address"
    ],
    "standoutFactor": "What makes this project stand out from 80% of hackathon submissions (1-2 sentences)"
  },
  "ideaChanges": {
    "quickWins": [
      "Small change that would significantly boost scores (takes < 2 hours)",
      "Another quick improvement with high ROI",
      "Third rapid enhancement"
    ],
    "pivotSuggestions": [
      "Major change to raise Innovation score: Specific suggestion with explanation",
      "Major change to raise Impact score: Specific suggestion with explanation",
      "Major change to raise Technical Depth: Specific suggestion with explanation"
    ],
    "featureAdditions": [
      "New feature to add that would impress judges: Description and why it matters",
      "Second feature addition with strong judge appeal",
      "Third feature that increases winning potential"
    ]
  }
}

Be honest, constructive, and specific. Consider:
- What judges look for in winning projects
- Balance between ambition and feasibility
- Technical sophistication vs time constraints
- Real-world applicability and impact
- Presentation and demo quality
- How this compares to typical hackathon submissions
- What single change would have the biggest impact

The overallWinningProbability should be a weighted average considering:
- Innovation: 25%
- Feasibility: 20%
- Technical Depth: 20%
- Impact: 25%
- Presentation: 10%

For nextBestImprovement, identify the ONE criterion where improvement would have the maximum impact on winning probability.

For competitorComparison, compare against typical hackathon projects in the same domain/category.

For ideaChanges, provide concrete, specific suggestions that could realistically improve scores.`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callOpenRouter(messages, true);

  try {
    // Try to parse JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const scoreData = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure all required fields exist
      const requiredFields = ['innovationScore', 'feasibilityScore', 'technicalDepthScore', 'impactScore', 'presentationScore'];
      const hasAllFields = requiredFields.every(field => 
        scoreData[field] && 
        typeof scoreData[field].score === 'number' &&
        scoreData[field].reason &&
        scoreData[field].improvement
      );

      if (hasAllFields && scoreData.overallWinningProbability) {
        return {
          ...scoreData,
          timestamp: new Date().toISOString(),
        };
      }
    }
  } catch (parseError) {
    console.error('Failed to parse judge score response:', parseError);
  }

  // Fallback response if parsing fails
  return {
    innovationScore: {
      score: 70,
      reason: 'The idea shows moderate innovation. It addresses a real problem but may benefit from more unique approaches.',
      improvement: 'Consider adding a unique twist or combining technologies in an unexpected way to stand out.'
    },
    feasibilityScore: {
      score: 75,
      reason: 'The project scope seems achievable within hackathon timeframe with proper planning and task delegation.',
      improvement: 'Break down features into must-haves and nice-to-haves. Focus on core MVP first.'
    },
    technicalDepthScore: {
      score: 65,
      reason: 'Shows good technical foundation but could demonstrate more sophisticated implementations.',
      improvement: 'Consider integrating advanced features like AI, real-time processing, or complex algorithms.'
    },
    impactScore: {
      score: 72,
      reason: 'Has potential for positive impact but scalability and reach could be expanded.',
      improvement: 'Quantify the impact with specific metrics and expand target audience reach.'
    },
    presentationScore: {
      score: 68,
      reason: 'The concept is clear but would benefit from better articulation of the problem and solution.',
      improvement: 'Create a compelling narrative with clear problem statement, solution, and demo flow.'
    },
    overallWinningProbability: 70,
    overallReview: 'This project shows promise with a solid foundation and clear purpose. To increase winning chances, focus on making your innovation stand out, ensure flawless execution within the time limit, and prepare an engaging presentation that clearly demonstrates impact. The technical implementation should showcase depth while remaining achievable.',
    keyRecommendations: [
      'Add a unique innovation factor that makes judges say "I haven\'t seen this before"',
      'Create a working demo that clearly shows the problem and solution in action',
      'Quantify your impact with specific numbers and real-world use cases',
      'Practice your pitch to ensure clarity and confidence during presentation',
      'Document your code well and prepare for technical questions from judges'
    ],
    nextBestImprovement: {
      criterion: 'Innovation',
      currentScore: 70,
      potentialScore: 85,
      action: 'Add a unique feature like AI-powered personalization or real-time collaborative capabilities that competitors typically don\'t implement. This would differentiate your project significantly.',
      expectedImpact: 'Would increase overall winning probability from 70% to 78%'
    },
    competitorComparison: {
      typicalCompetitorScore: 65,
      yourAdvantages: [
        'Clear problem-solution fit with practical applicability',
        'Feasible scope that can be completed within hackathon timeframe',
        'Solid technical foundation with room for enhancement'
      ],
      competitorAdvantages: [
        'May have more innovative or cutting-edge features',
        'Could present more polished demos or presentations',
        'Might have stronger quantifiable impact metrics'
      ],
      standoutFactor: 'Your project is above average but needs a distinctive "wow factor" to break into the top 10%.'
    },
    ideaChanges: {
      quickWins: [
        'Add real-time notifications or live updates to make the demo more engaging',
        'Include data visualization or analytics dashboard to showcase impact',
        'Implement user authentication and personalization for more professional feel'
      ],
      pivotSuggestions: [
        'Innovation: Integrate AI/ML capabilities for predictive features or personalized recommendations',
        'Impact: Expand scope to serve multiple user segments or solve a broader problem',
        'Technical Depth: Add microservices architecture or cloud deployment with auto-scaling'
      ],
      featureAdditions: [
        'AI-powered recommendation engine: Would demonstrate technical sophistication and improve user experience',
        'Real-time collaboration features: Shows advanced technical skills and increases practical utility',
        'Mobile-responsive PWA or native app: Expands accessibility and shows full-stack capabilities'
      ]
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Suggest tech stack and architecture for a hackathon project
 */
async function suggestTechStack(projectData) {
  const { idea, domain, preferredLanguages, roadmap } = projectData;

  const prompt = `You are an expert software architect and hackathon mentor. Analyze this project and provide comprehensive tech stack and architecture recommendations.

PROJECT DETAILS:
Idea: ${idea}
Domain: ${domain}
${preferredLanguages ? `Preferred Technologies: ${preferredLanguages}` : ''}
${roadmap ? `Roadmap: ${roadmap}` : ''}

Provide a COMPLETE technical recommendation in this EXACT JSON format:

{
  "techStack": {
    "frontend": ["React", "TailwindCSS", "Vite"],
    "frontendReason": "Why these frontend technologies are ideal for this project",
    "backend": ["Node.js", "Express.js"],
    "backendReason": "Why this backend stack fits the requirements",
    "database": ["MongoDB"],
    "databaseReason": "Why this database is the best choice",
    "aiModels": ["GPT-4", "Embeddings API"],
    "aiReason": "How AI enhances this project",
    "cloudServices": ["Vercel", "Railway"],
    "cloudReason": "Why these deployment platforms are recommended"
  },
  "apiRecommendations": [
    {
      "name": "OpenAI API",
      "purpose": "Natural language processing and generation",
      "type": "AI/ML",
      "pricing": "Free tier available"
    },
    {
      "name": "Stripe",
      "purpose": "Payment processing",
      "type": "Payments",
      "pricing": "Pay per transaction"
    }
  ],
  "architecture": {
    "overview": "High-level description of the system architecture (2-3 sentences)",
    "pattern": "Monolithic / Microservices / Serverless / JAMstack",
    "patternReason": "Why this architecture pattern is best for this hackathon project",
    "dataFlow": [
      "Step 1: User interaction flow",
      "Step 2: Backend processing",
      "Step 3: Data storage",
      "Step 4: Response delivery"
    ],
    "externalServices": [
      "Service 1: Purpose and integration point",
      "Service 2: Purpose and integration point"
    ],
    "realTimeCommunication": "WebSockets via Socket.io for real-time features / Not required for this project",
    "aiIntegration": "Detailed explanation of where and how AI is integrated into the architecture"
  },
  "folderStructure": "project-root/\\n├── frontend/\\n│   ├── src/\\n│   │   ├── components/\\n│   │   ├── pages/\\n│   │   ├── services/\\n│   │   └── utils/\\n│   ├── public/\\n│   └── package.json\\n├── backend/\\n│   ├── controllers/\\n│   ├── models/\\n│   ├── routes/\\n│   ├── services/\\n│   └── server.js\\n└── README.md",
  "development": {
    "libraries": [
      "npm install react react-dom",
      "npm install express cors",
      "npm install mongoose",
      "npm install openai",
      "npm install socket.io"
    ],
    "whyThisStack": "Comprehensive explanation of why this entire stack is optimal for the project (3-4 sentences)",
    "scalability": "How this architecture can scale post-hackathon (2-3 sentences)",
    "estimatedTime": "24-48 hours with 3-person team - breakdown: 6h setup, 16h core dev, 4h testing",
    "setupSteps": [
      "Clone repository and install dependencies",
      "Set up environment variables for API keys",
      "Initialize database and seed data",
      "Start development servers",
      "Configure deployment pipelines"
    ]
  },
  "recommendations": [
    "Use TypeScript for better type safety in larger projects",
    "Implement CI/CD pipeline with GitHub Actions",
    "Add monitoring with Sentry or LogRocket",
    "Use Docker for consistent development environments",
    "Implement proper error handling and logging"
  ]
}

IMPORTANT GUIDELINES:
${preferredLanguages ? `- PRIORITIZE the user's preferred technologies: ${preferredLanguages}` : '- Suggest modern, hackathon-friendly technologies'}
- Choose technologies that can be learned/implemented quickly
- Recommend tools with good documentation and community support
- Suggest free tier or open-source solutions when possible
- Focus on technologies that judges recognize and respect
- Balance innovation with practicality for hackathon timeline
- Include domain-specific APIs for ${domain}
- Recommend 5-8 relevant APIs/tools based on the project needs
- Provide realistic time estimates for hackathon context (24-72 hours)
- Architecture should be buildable within hackathon constraints
- Folder structure should be clear and professional

Domain-specific considerations for ${domain}:
${domain === 'Healthcare' ? '- HIPAA compliance, secure data handling, health data APIs' : ''}
${domain === 'Finance' ? '- Payment APIs, transaction security, financial data APIs' : ''}
${domain === 'Education' ? '- Learning management features, progress tracking, educational APIs' : ''}
${domain === 'E-commerce' ? '- Payment processing, inventory management, shipping APIs' : ''}
${domain === 'Social Impact' ? '- Accessibility, scalability, community features' : ''}
${domain === 'Agriculture' ? '- IoT integration, weather APIs, sensor data processing' : ''}
${domain === 'Environment' ? '- Data visualization, monitoring APIs, sustainability metrics' : ''}

Be specific, practical, and actionable. Every recommendation should have a clear reason.`;

  const messages = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await callOpenRouter(messages, true);

  try {
    // Try to parse JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const techData = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (techData.techStack && techData.architecture && techData.development) {
        return {
          ...techData,
          timestamp: new Date().toISOString(),
        };
      }
    }
  } catch (parseError) {
    console.error('Failed to parse tech stack response:', parseError);
  }

  // Fallback response if parsing fails
  return {
    techStack: {
      frontend: ['React', 'TailwindCSS', 'Vite'],
      frontendReason: 'React offers fast development with reusable components, TailwindCSS for rapid styling, and Vite for quick build times.',
      backend: ['Node.js', 'Express.js'],
      backendReason: 'Node.js and Express provide a lightweight, fast backend perfect for hackathon MVP development.',
      database: ['MongoDB'],
      databaseReason: 'MongoDB\'s flexible schema is ideal for rapid prototyping and iterating during a hackathon.',
      aiModels: ['OpenAI GPT-4'],
      aiReason: 'GPT-4 provides powerful AI capabilities with simple API integration for intelligent features.',
      cloudServices: ['Vercel', 'MongoDB Atlas'],
      cloudReason: 'Vercel offers free hosting with excellent performance, MongoDB Atlas provides free database tier.'
    },
    apiRecommendations: [
      {
        name: 'OpenAI API',
        purpose: 'AI-powered features and natural language processing',
        type: 'AI/ML',
        pricing: 'Pay-per-use, free trial available'
      },
      {
        name: 'Auth0',
        purpose: 'User authentication and authorization',
        type: 'Authentication',
        pricing: 'Free tier for up to 7,000 users'
      },
      {
        name: 'SendGrid',
        purpose: 'Email notifications and communication',
        type: 'Communication',
        pricing: 'Free tier: 100 emails/day'
      }
    ],
    architecture: {
      overview: 'A modern JAMstack architecture with React frontend, serverless backend functions, and cloud database. This setup enables rapid development and easy deployment.',
      pattern: 'JAMstack',
      patternReason: 'JAMstack is perfect for hackathons - fast development, easy deployment, and excellent performance with minimal infrastructure management.',
      dataFlow: [
        'User interacts with React frontend',
        'Frontend makes API calls to Express backend',
        'Backend processes requests and queries MongoDB',
        'AI features call OpenAI API when needed',
        'Response data flows back to frontend for display'
      ],
      externalServices: [
        'OpenAI API: Integrated in backend for AI-powered features',
        'MongoDB Atlas: Cloud database for data persistence',
        'Vercel: Frontend hosting with automatic deployments'
      ],
      realTimeCommunication: 'Can add Socket.io if real-time features are needed, but not required for basic MVP.',
      aiIntegration: 'AI is integrated through backend API routes that call OpenAI services. Frontend sends user input to backend, which processes it with AI and returns intelligent responses.'
    },
    folderStructure: `project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   └── openai.js
│   ├── config/
│   ├── server.js
│   └── package.json
├── .env
└── README.md`,
    development: {
      libraries: [
        'Frontend: npm install react react-dom react-router-dom',
        'Frontend: npm install axios tailwindcss',
        'Backend: npm install express cors dotenv',
        'Backend: npm install mongoose openai',
        'Dev Tools: npm install nodemon concurrently'
      ],
      whyThisStack: 'This stack is optimized for hackathons: React and TailwindCSS enable rapid UI development, Node.js/Express provides a familiar backend, MongoDB allows flexible data modeling, and all components have excellent documentation and community support. The entire stack can be learned quickly if needed.',
      scalability: 'This architecture can easily scale post-hackathon. The modular design allows adding microservices, the database can scale with MongoDB Atlas, and Vercel handles frontend scaling automatically. Can migrate to containerized deployment with Docker/Kubernetes later.',
      estimatedTime: '24-36 hours for 3-person team: 4h setup & planning, 16h core development, 6h testing & polish, 2h deployment & documentation',
      setupSteps: [
        'Initialize frontend: npx create-vite@latest frontend --template react',
        'Initialize backend: npm init and install dependencies',
        'Set up MongoDB Atlas account and get connection string',
        'Create .env file with API keys (OpenAI, MongoDB)',
        'Start development: run frontend (npm run dev) and backend (npm start) concurrently'
      ]
    },
    recommendations: [
      'Start with a minimal MVP and add features incrementally',
      'Use environment variables for all API keys and secrets',
      'Implement proper error handling for API calls',
      'Test core functionality early and often',
      'Prepare a demo script to showcase features effectively',
      'Document setup steps in README for judges'
    ],
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  generateIdea,
  suggestTopics,
  generateRoadmap,
  chat,
  callOpenRouter,
  predictJudgeScore,
  suggestTechStack,
};
