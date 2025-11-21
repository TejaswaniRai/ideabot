import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { suggestTechStack } from '../services/api';
import Footer from '../components/Footer';
import './TechStackSuggestor.css';

const TechStackSuggestor = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    idea: '',
    domain: '',
    preferredLanguages: '',
    roadmap: ''
  });
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill from navigation state if available
    if (location.state?.idea) {
      setFormData(prev => ({
        ...prev,
        idea: `${location.state.idea.title}\n\n${location.state.idea.description}`,
        domain: location.state.idea.domain || ''
      }));
    }
    if (location.state?.roadmap) {
      const roadmapText = JSON.stringify(location.state.roadmap, null, 2);
      setFormData(prev => ({
        ...prev,
        roadmap: roadmapText
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.idea.trim()) {
      setError('Please provide your project idea');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const result = await suggestTechStack(formData);
      setSuggestion(result);
    } catch (err) {
      setError(err.message || 'Failed to generate tech stack suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Tech Stack & Architecture Suggestor</h1>
        <p className="page-subtitle">
          Get AI-powered recommendations for the best technologies and architecture for your hackathon project
        </p>

        <form onSubmit={handleSubmit} className="tech-form">
          <div className="form-group">
            <label htmlFor="idea">Project Idea *</label>
            <textarea
              id="idea"
              name="idea"
              value={formData.idea}
              onChange={handleChange}
              placeholder="Describe your hackathon project idea..."
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="domain">Domain *</label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
              >
                <option value="">Select a domain</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Social Impact">Social Impact</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Environment">Environment</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity">Productivity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferredLanguages">Preferred Languages/Frameworks (Optional)</label>
              <input
                type="text"
                id="preferredLanguages"
                name="preferredLanguages"
                value={formData.preferredLanguages}
                onChange={handleChange}
                placeholder="e.g., React, Python, Node.js"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="roadmap">Roadmap (Optional)</label>
            <textarea
              id="roadmap"
              name="roadmap"
              value={formData.roadmap}
              onChange={handleChange}
              placeholder="Paste your project roadmap or development plan..."
              rows="4"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Generate Tech Stack'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {suggestion && (
          <div className="suggestion-results">
            <h2>Your Tech Stack Recommendation</h2>

            {/* Tech Stack Table */}
            <div className="tech-stack-section">
              <h3>Recommended Tech Stack</h3>
              <div className="stack-table">
                <div className="stack-row stack-header">
                  <div className="stack-category">Category</div>
                  <div className="stack-technology">Technology</div>
                  <div className="stack-reason">Why This Choice</div>
                </div>

                {suggestion.techStack?.frontend && (
                  <div className="stack-row">
                    <div className="stack-category">Frontend</div>
                    <div className="stack-technology">
                      {Array.isArray(suggestion.techStack.frontend) 
                        ? suggestion.techStack.frontend.join(', ')
                        : suggestion.techStack.frontend}
                    </div>
                    <div className="stack-reason">{suggestion.techStack.frontendReason}</div>
                  </div>
                )}

                {suggestion.techStack?.backend && (
                  <div className="stack-row">
                    <div className="stack-category">Backend</div>
                    <div className="stack-technology">
                      {Array.isArray(suggestion.techStack.backend) 
                        ? suggestion.techStack.backend.join(', ')
                        : suggestion.techStack.backend}
                    </div>
                    <div className="stack-reason">{suggestion.techStack.backendReason}</div>
                  </div>
                )}

                {suggestion.techStack?.database && (
                  <div className="stack-row">
                    <div className="stack-category">Database</div>
                    <div className="stack-technology">
                      {Array.isArray(suggestion.techStack.database) 
                        ? suggestion.techStack.database.join(', ')
                        : suggestion.techStack.database}
                    </div>
                    <div className="stack-reason">{suggestion.techStack.databaseReason}</div>
                  </div>
                )}

                {suggestion.techStack?.aiModels && (
                  <div className="stack-row">
                    <div className="stack-category">AI/ML</div>
                    <div className="stack-technology">
                      {Array.isArray(suggestion.techStack.aiModels) 
                        ? suggestion.techStack.aiModels.join(', ')
                        : suggestion.techStack.aiModels}
                    </div>
                    <div className="stack-reason">{suggestion.techStack.aiReason}</div>
                  </div>
                )}

                {suggestion.techStack?.cloudServices && (
                  <div className="stack-row">
                    <div className="stack-category">Cloud/Deploy</div>
                    <div className="stack-technology">
                      {Array.isArray(suggestion.techStack.cloudServices) 
                        ? suggestion.techStack.cloudServices.join(', ')
                        : suggestion.techStack.cloudServices}
                    </div>
                    <div className="stack-reason">{suggestion.techStack.cloudReason}</div>
                  </div>
                )}
              </div>
            </div>

            {/* API & Tools Recommendations */}
            {suggestion.apiRecommendations && (
              <div className="api-section">
                <h3>Recommended APIs & Tools</h3>
                <div className="api-grid">
                  {suggestion.apiRecommendations.map((api, idx) => (
                    <div key={idx} className="api-card">
                      <h4>{api.name}</h4>
                      <p className="api-purpose">{api.purpose}</p>
                      <div className="api-details">
                        <span className="api-type">{api.type}</span>
                        {api.pricing && <span className="api-pricing">{api.pricing}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Architecture */}
            {suggestion.architecture && (
              <div className="architecture-section">
                <h3>System Architecture</h3>
                
                <div className="architecture-overview">
                  <h4>Architecture Overview</h4>
                  <p>{suggestion.architecture.overview}</p>
                </div>

                <div className="architecture-details">
                  <div className="architecture-card">
                    <h4>Architecture Pattern</h4>
                    <p className="pattern-type">{suggestion.architecture.pattern}</p>
                    <p className="pattern-reason">{suggestion.architecture.patternReason}</p>
                  </div>

                  {suggestion.architecture.dataFlow && (
                    <div className="architecture-card">
                      <h4>Data Flow</h4>
                      <ol className="data-flow-list">
                        {suggestion.architecture.dataFlow.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {suggestion.architecture.externalServices && (
                    <div className="architecture-card">
                      <h4>External Service Integration</h4>
                      <ul className="services-list">
                        {suggestion.architecture.externalServices.map((service, idx) => (
                          <li key={idx}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestion.architecture.realTimeCommunication && (
                    <div className="architecture-card">
                      <h4>Real-time Communication</h4>
                      <p>{suggestion.architecture.realTimeCommunication}</p>
                    </div>
                  )}

                  {suggestion.architecture.aiIntegration && (
                    <div className="architecture-card highlight">
                      <h4>AI Integration Points</h4>
                      <p>{suggestion.architecture.aiIntegration}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Folder Structure */}
            {suggestion.folderStructure && (
              <div className="folder-section">
                <h3>Recommended Folder Structure</h3>
                <pre className="folder-structure">
                  <code>{suggestion.folderStructure}</code>
                </pre>
              </div>
            )}

            {/* Development Requirements */}
            {suggestion.development && (
              <div className="development-section">
                <h3>Development Requirements</h3>

                {suggestion.development.libraries && (
                  <div className="dev-card">
                    <h4>Libraries & Dependencies</h4>
                    <div className="libraries-grid">
                      {suggestion.development.libraries.map((lib, idx) => (
                        <div key={idx} className="library-item">
                          <code>{lib}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="dev-info-grid">
                  {suggestion.development.whyThisStack && (
                    <div className="dev-card">
                      <h4>Why This Stack?</h4>
                      <p>{suggestion.development.whyThisStack}</p>
                    </div>
                  )}

                  {suggestion.development.scalability && (
                    <div className="dev-card">
                      <h4>Scalability Potential</h4>
                      <p>{suggestion.development.scalability}</p>
                    </div>
                  )}

                  {suggestion.development.estimatedTime && (
                    <div className="dev-card">
                      <h4>Estimated Development Time</h4>
                      <p className="time-estimate">{suggestion.development.estimatedTime}</p>
                    </div>
                  )}
                </div>

                {suggestion.development.setupSteps && (
                  <div className="dev-card">
                    <h4>Quick Setup Steps</h4>
                    <ol className="setup-steps">
                      {suggestion.development.setupSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Additional Recommendations */}
            {suggestion.recommendations && suggestion.recommendations.length > 0 && (
              <div className="final-recommendations">
                <h3>Expert Recommendations</h3>
                <ul>
                  {suggestion.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TechStackSuggestor;
