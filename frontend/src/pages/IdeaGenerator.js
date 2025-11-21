import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateIdea } from '../services/api';
import Footer from '../components/Footer';
import './IdeaGenerator.css';

const IdeaGenerator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Team profile
  const [teamData, setTeamData] = useState({
    name: '',
    size: 3,
    skills: '',
    techStack: '',
    experience: 'Intermediate',
    interests: ''
  });

  // Step 2: Domain selection
  const [domain, setDomain] = useState('');

  // Step 3: Generated idea
  const [generatedIdea, setGeneratedIdea] = useState(null);

  const domains = [
    { value: 'healthcare', label: '🏥 Healthcare', icon: '🏥' },
    { value: 'education', label: '📚 Education', icon: '📚' },
    { value: 'fintech', label: '💰 FinTech', icon: '💰' },
    { value: 'sustainability', label: '🌱 Sustainability', icon: '🌱' },
    { value: 'agriculture', label: '🌾 Agriculture', icon: '🌾' },
    { value: 'social-impact', label: '🤝 Social Impact', icon: '🤝' }
  ];

  const handleTeamSubmit = () => {
    if (!teamData.name || teamData.size < 1) {
      setError('Please fill in team name and size');
      return;
    }
    setError('');
    setStep(2); // Move to domain selection
  };

  const handleGenerateIdea = async () => {
    setLoading(true);
    setError('');

    try {
      // Build context from team profile
      const context = `Team: ${teamData.name}, Size: ${teamData.size} members, Skills: ${teamData.skills}, Tech Stack: ${teamData.techStack}, Experience: ${teamData.experience}${teamData.interests ? `, Interests: ${teamData.interests}` : ''}`;
      
      const response = await generateIdea(domain, context);
      setGeneratedIdea(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = () => {
    navigate('/roadmap', { 
      state: { 
        idea: generatedIdea, 
        team: {
          ...teamData,
          skills: teamData.skills.split(',').map(s => s.trim()).filter(Boolean),
          techStack: teamData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        }
      } 
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Generate Your Hackathon Idea</h1>
        
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Team Profile</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Choose Domain</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Generate Idea</div>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Step 1: Team Profile */}
        {step === 1 && (
          <div className="step-content">
            <h2>Build Your Team Profile</h2>
            <p className="step-description">Tell us about your team to get personalized recommendations</p>

            <div className="input-group">
              <label>Team Name</label>
              <input
                type="text"
                placeholder="e.g., Code Crushers"
                value={teamData.name}
                onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Team Size</label>
              <input
                type="number"
                min="1"
                max="10"
                value={teamData.size}
                onChange={(e) => setTeamData({ ...teamData, size: parseInt(e.target.value) })}
              />
            </div>

            <div className="input-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, Python, UI/UX"
                value={teamData.skills}
                onChange={(e) => setTeamData({ ...teamData, skills: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Tech Stack (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., MongoDB, Express, React, Node.js"
                value={teamData.techStack}
                onChange={(e) => setTeamData({ ...teamData, techStack: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Experience Level</label>
              <select
                value={teamData.experience}
                onChange={(e) => setTeamData({ ...teamData, experience: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleTeamSubmit}>
              Continue to Domain Selection →
            </button>
          </div>
        )}

        {/* Step 2: Domain Selection */}
        {step === 2 && (
          <div className="step-content">
            <h2>Select Your Domain</h2>
            <p className="step-description">Choose the area where you want to make an impact</p>
            
            <div className="domain-grid">
              {domains.map(d => (
                <div
                  key={d.value}
                  className={`domain-card ${domain === d.value ? 'selected' : ''}`}
                  onClick={() => setDomain(d.value)}
                >
                  <div className="domain-icon">{d.icon}</div>
                  <div className="domain-label">{d.label}</div>
                </div>
              ))}
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back to Team Profile
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!domain) {
                    setError('Please select a domain');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                disabled={!domain}
              >
                Continue to Idea Generation →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generate Idea */}
        {step === 3 && (
          <div className="step-content">
            <h2>Generate Your Hackathon Idea</h2>
            <p className="step-description">
              Based on your team profile and selected domain ({domains.find(d => d.value === domain)?.label})
            </p>

            {!generatedIdea ? (
              <div className="generate-section">
                <div className="team-summary">
                  <h3>Team Summary</h3>
                  <p><strong>Team:</strong> {teamData.name}</p>
                  <p><strong>Size:</strong> {teamData.size} members</p>
                  <p><strong>Skills:</strong> {teamData.skills || 'Not specified'}</p>
                  <p><strong>Tech Stack:</strong> {teamData.techStack || 'Not specified'}</p>
                  <p><strong>Experience:</strong> {teamData.experience}</p>
                </div>

                <button 
                  className="btn btn-primary btn-large" 
                  onClick={handleGenerateIdea}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Generating Your Winning Idea...
                    </>
                  ) : (
                    '✨ Generate Hackathon Idea'
                  )}
                </button>
              </div>
            ) : (
              <div className="idea-result">
                <h3>{generatedIdea.title}</h3>
                
                {generatedIdea.problemStatement && (
                  <div className="detail-section problem-statement">
                    <h4>🎯 Problem Statement</h4>
                    <p><strong>The Problem:</strong> {generatedIdea.problemStatement.problem}</p>
                    <p><strong>Impact:</strong> {generatedIdea.problemStatement.impact}</p>
                    <p><strong>Why Existing Solutions Fail:</strong> {generatedIdea.problemStatement.existingSolutions}</p>
                    {generatedIdea.problemStatement.statistics && (
                      <p><strong>Key Statistics:</strong> {generatedIdea.problemStatement.statistics}</p>
                    )}
                  </div>
                )}
                
                <p className="idea-description">{generatedIdea.description}</p>
                
                {generatedIdea.whyThisCanWin && (
                  <div className="detail-section winning-factors">
                    <h4>Why This Can Win</h4>
                    <ul>
                      {generatedIdea.whyThisCanWin.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="idea-details">
                  <div className="detail-section">
                    <h4>Target Audience</h4>
                    <p>{generatedIdea.targetAudience}</p>
                  </div>
                  <div className="detail-section">
                    <h4>Impact</h4>
                    <p>{generatedIdea.impact}</p>
                  </div>
                  {generatedIdea.innovationFactor && (
                    <div className="detail-section">
                      <h4>Innovation Factor</h4>
                      <p>{generatedIdea.innovationFactor}</p>
                    </div>
                  )}
                  {generatedIdea.techStack && (
                    <div className="detail-section">
                      <h4>Tech Stack</h4>
                      <div className="tech-tags">
                        {generatedIdea.techStack.map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="detail-section-row">
                    {generatedIdea.difficulty && (
                      <div className="detail-section">
                        <h4>📊 Difficulty</h4>
                        <span className={`badge badge-${generatedIdea.difficulty.toLowerCase()}`}>
                          {generatedIdea.difficulty}
                        </span>
                      </div>
                    )}
                    {generatedIdea.estimatedTime && (
                      <div className="detail-section">
                        <h4>⏱️ Estimated Time</h4>
                        <p>{generatedIdea.estimatedTime}</p>
                      </div>
                    )}
                    {generatedIdea.winningProbability && (
                      <div className="detail-section">
                        <h4>🎯 Winning Probability</h4>
                        <p>{generatedIdea.winningProbability}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="button-group">
                  <button className="btn btn-secondary" onClick={() => {
                    setGeneratedIdea(null);
                    setStep(2);
                  }}>
                    ← Change Domain
                  </button>
                  <button className="btn btn-secondary" onClick={() => setGeneratedIdea(null)}>
                    🔄 Generate Another Idea
                  </button>
                  <button className="btn btn-primary" onClick={handleGenerateRoadmap}>
                    Generate Roadmap →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default IdeaGenerator;
