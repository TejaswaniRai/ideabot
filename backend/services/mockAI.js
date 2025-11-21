// Mock AI service - Replace with OpenAI API when key is available

class MockAIService {
  constructor() {
    this.problemStatements = {
      'healthcare': [
        {
          title: 'Smart Patient Monitoring System',
          description: 'Develop an IoT-based real-time patient monitoring system that tracks vital signs and alerts healthcare providers of critical changes. Integrate ML for predictive health analytics.',
          targetAudience: 'Hospitals, clinics, and home healthcare providers',
          impact: 'Reduces response time to medical emergencies and enables proactive healthcare'
        },
        {
          title: 'AI-Powered Mental Health Companion',
          description: 'Create a conversational AI chatbot that provides mental health support, mood tracking, and connects users with professional therapists when needed.',
          targetAudience: 'Young adults, students, and working professionals',
          impact: 'Makes mental health support accessible 24/7 and reduces stigma'
        },
        {
          title: 'Medicine Authenticity Verification System',
          description: 'Build a blockchain-based platform to verify medicine authenticity using QR codes, preventing counterfeit drugs from reaching patients.',
          targetAudience: 'Pharmacies, hospitals, and consumers',
          impact: 'Eliminates counterfeit medicines and ensures patient safety'
        }
      ],
      'education': [
        {
          title: 'Adaptive Learning Platform',
          description: 'Design an AI-driven learning platform that adapts content difficulty and teaching style based on individual student performance and learning patterns.',
          targetAudience: 'Students, educators, and online learning platforms',
          impact: 'Personalizes education and improves learning outcomes'
        },
        {
          title: 'AR-Based Interactive Lab Simulator',
          description: 'Create an augmented reality application for conducting virtual science experiments, enabling hands-on learning without physical lab equipment.',
          targetAudience: 'Schools and colleges with limited lab resources',
          impact: 'Democratizes access to practical science education'
        },
        {
          title: 'Peer-to-Peer Skill Exchange Network',
          description: 'Build a platform where students can teach and learn from each other, earning credits and building portfolios.',
          targetAudience: 'College students and lifelong learners',
          impact: 'Creates collaborative learning communities and skill development'
        }
      ],
      'fintech': [
        {
          title: 'Micro-Investment Platform for Students',
          description: 'Develop a mobile app that allows students to invest spare change from daily transactions into diversified portfolios with educational content.',
          targetAudience: 'College students and young adults',
          impact: 'Builds financial literacy and early investment habits'
        },
        {
          title: 'Smart Expense Tracker with AI Insights',
          description: 'Create an intelligent expense management app that categorizes spending, predicts future expenses, and provides personalized savings recommendations.',
          targetAudience: 'Individuals and small businesses',
          impact: 'Improves financial awareness and helps achieve savings goals'
        },
        {
          title: 'Decentralized Lending Platform',
          description: 'Build a blockchain-based peer-to-peer lending platform with smart contracts for transparent, low-fee microloans.',
          targetAudience: 'Underbanked populations and small entrepreneurs',
          impact: 'Increases access to credit without traditional banking barriers'
        }
      ],
      'sustainability': [
        {
          title: 'Carbon Footprint Tracker & Offset Marketplace',
          description: 'Design an app that calculates individual carbon footprints and connects users with verified carbon offset projects.',
          targetAudience: 'Environmentally conscious individuals and corporations',
          impact: 'Enables measurable climate action and supports green projects'
        },
        {
          title: 'Smart Waste Segregation System',
          description: 'Create an AI-powered waste bin that automatically segregates recyclable, compostable, and non-recyclable waste using computer vision.',
          targetAudience: 'Smart cities, residential complexes, and commercial buildings',
          impact: 'Increases recycling rates and reduces landfill waste'
        },
        {
          title: 'Community Solar Energy Sharing Platform',
          description: 'Build a platform for neighborhoods to share solar energy through a peer-to-peer grid with transparent billing.',
          targetAudience: 'Residential communities and solar panel owners',
          impact: 'Maximizes renewable energy utilization and reduces electricity costs'
        }
      ],
      'agriculture': [
        {
          title: 'AI Crop Disease Detection App',
          description: 'Develop a mobile app using computer vision to identify crop diseases from photos and suggest organic treatment methods.',
          targetAudience: 'Small and medium-scale farmers',
          impact: 'Reduces crop loss and pesticide usage'
        },
        {
          title: 'Smart Irrigation System',
          description: 'Create an IoT-based precision irrigation system that optimizes water usage based on soil moisture, weather forecasts, and crop requirements.',
          targetAudience: 'Farmers in water-scarce regions',
          impact: 'Conserves water and increases crop yield'
        },
        {
          title: 'Farm-to-Consumer Direct Marketplace',
          description: 'Build a platform connecting farmers directly with consumers, eliminating middlemen and ensuring fair prices.',
          targetAudience: 'Farmers and urban consumers',
          impact: 'Increases farmer income and provides fresh produce to consumers'
        }
      ],
      'social-impact': [
        {
          title: 'Disaster Relief Coordination Platform',
          description: 'Design a real-time platform for coordinating disaster relief efforts, connecting volunteers, NGOs, and affected communities.',
          targetAudience: 'NGOs, government agencies, and volunteers',
          impact: 'Streamlines disaster response and saves lives'
        },
        {
          title: 'Accessibility Assistant for Visually Impaired',
          description: 'Create an AI-powered mobile app that describes surroundings, reads text, and assists navigation for visually impaired users.',
          targetAudience: 'Visually impaired individuals',
          impact: 'Enhances independence and quality of life'
        },
        {
          title: 'Community Service Hours Tracking & Matching',
          description: 'Build a platform that matches volunteers with local community service opportunities and tracks verified service hours.',
          targetAudience: 'Students, volunteers, and non-profit organizations',
          impact: 'Increases volunteer engagement and community support'
        }
      ]
    };

    this.topicSuggestions = {
      '1-2': {
        'beginner': ['Web apps with simple CRUD', 'Mobile apps with basic features', 'Chrome extensions', 'Discord/Slack bots'],
        'intermediate': ['Full-stack web applications', 'RESTful APIs with authentication', 'Real-time chat applications', 'Data visualization dashboards'],
        'advanced': ['Microservices architecture', 'Real-time collaboration tools', 'ML-integrated applications', 'Blockchain smart contracts']
      },
      '3-4': {
        'beginner': ['Team collaboration tools', 'Event management systems', 'Simple e-commerce platforms', 'Portfolio generators'],
        'intermediate': ['Social networking features', 'Payment integration systems', 'Content management systems', 'Analytics platforms'],
        'advanced': ['Distributed systems', 'IoT dashboards', 'AI-powered recommendation engines', 'Cloud-native applications']
      },
      '5+': {
        'beginner': ['Multi-user project management', 'Online learning platforms', 'Community forums', 'Booking systems'],
        'intermediate': ['Marketplace platforms', 'Video streaming services', 'Multi-tenant SaaS applications', 'Real-time gaming platforms'],
        'advanced': ['Enterprise-scale platforms', 'AI/ML pipelines', 'Cross-platform ecosystems', 'High-performance computing solutions']
      }
    };
  }

  generateProblemStatement(domain) {
    const normalizedDomain = domain.toLowerCase().replace(/\s+/g, '-');
    const statements = this.problemStatements[normalizedDomain] || this.problemStatements['social-impact'];
    return statements[Math.floor(Math.random() * statements.length)];
  }

  suggestTopics(teamSize, skills, experience) {
    const sizeCategory = teamSize <= 2 ? '1-2' : teamSize <= 4 ? '3-4' : '5+';
    const topics = this.topicSuggestions[sizeCategory][experience] || this.topicSuggestions[sizeCategory]['intermediate'];
    
    return topics.map(topic => ({
      topic,
      reasoning: `Suitable for ${teamSize} member team with ${experience} experience`,
      difficulty: experience,
      estimatedTime: teamSize <= 2 ? '36-48 hours' : teamSize <= 4 ? '24-36 hours' : '18-24 hours'
    }));
  }

  generateRoadmap(idea, team) {
    const phases = [
      {
        name: 'Ideation & Planning',
        duration: '4-6 hours',
        tasks: [
          { title: 'Define problem statement clearly', description: 'Document the exact problem you are solving' },
          { title: 'Research existing solutions', description: 'Analyze competitors and identify gaps' },
          { title: 'Create user personas', description: 'Define your target audience' },
          { title: 'Sketch wireframes', description: 'Create low-fidelity mockups' },
          { title: 'Define MVP features', description: 'List must-have features for the demo' }
        ]
      },
      {
        name: 'Design & Architecture',
        duration: '3-4 hours',
        tasks: [
          { title: 'Design system architecture', description: 'Define frontend, backend, and database structure' },
          { title: 'Create high-fidelity mockups', description: 'Design UI in Figma or similar tools' },
          { title: 'Set up development environment', description: 'Initialize Git repo and install dependencies' },
          { title: 'Define API contracts', description: 'Document API endpoints and data models' }
        ]
      },
      {
        name: 'Development Sprint',
        duration: '18-24 hours',
        tasks: [
          { title: 'Set up backend server', description: 'Create Express/FastAPI server with basic routes' },
          { title: 'Design database schema', description: 'Create models and seed initial data' },
          { title: 'Implement authentication', description: 'Add user login/signup functionality' },
          { title: 'Build core features', description: 'Develop MVP functionality' },
          { title: 'Create frontend components', description: 'Build React/Vue components' },
          { title: 'Connect frontend to backend', description: 'Integrate API calls' },
          { title: 'Add styling', description: 'Make UI visually appealing' }
        ]
      },
      {
        name: 'Testing & Refinement',
        duration: '3-4 hours',
        tasks: [
          { title: 'Test all user flows', description: 'Ensure features work end-to-end' },
          { title: 'Fix critical bugs', description: 'Resolve blocking issues' },
          { title: 'Optimize performance', description: 'Improve load times and responsiveness' },
          { title: 'Add error handling', description: 'Handle edge cases gracefully' }
        ]
      },
      {
        name: 'Deployment & Presentation',
        duration: '4-6 hours',
        tasks: [
          { title: 'Deploy backend', description: 'Host on Heroku/Render/Railway' },
          { title: 'Deploy frontend', description: 'Host on Vercel/Netlify' },
          { title: 'Create demo video', description: 'Record 2-3 minute product walkthrough' },
          { title: 'Prepare pitch deck', description: 'Create 5-7 slide presentation' },
          { title: 'Write README', description: 'Document setup and features' },
          { title: 'Practice presentation', description: 'Rehearse the demo and pitch' }
        ]
      }
    ];

    const techRecommendations = team.techStack || [
      'React.js for frontend',
      'Node.js + Express for backend',
      'MongoDB for database',
      'Tailwind CSS for styling',
      'JWT for authentication',
      'Axios for API calls'
    ];

    const resources = [
      { title: 'React Documentation', url: 'https://react.dev', type: 'documentation' },
      { title: 'Express.js Guide', url: 'https://expressjs.com', type: 'documentation' },
      { title: 'MongoDB Tutorial', url: 'https://www.mongodb.com/docs', type: 'tutorial' },
      { title: 'Deployment Guide - Vercel', url: 'https://vercel.com/docs', type: 'guide' },
      { title: 'Hackathon Pitch Tips', url: 'https://devpost.com/blog', type: 'article' }
    ];

    return { phases, techRecommendations, resources };
  }
}

module.exports = new MockAIService();
