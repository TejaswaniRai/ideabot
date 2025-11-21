import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { predictJudgeScore } from '../services/api';
import Footer from '../components/Footer';
import './JudgePredictor.css';

const JudgePredictor = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    idea: '',
    roadmap: '',
    techStack: '',
    teamSize: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill from navigation state if available
    if (location.state?.idea) {
      setFormData(prev => ({
        ...prev,
        idea: `${location.state.idea.title}\n\n${location.state.idea.description}`,
        techStack: location.state.idea.techStack?.join(', ') || ''
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
      setError('Please provide your idea');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const result = await predictJudgeScore(formData);
      setPrediction(result);
    } catch (err) {
      setError(err.message || 'Failed to predict scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };

  const getWinningColor = (percentage) => {
    if (percentage >= 70) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Judge Score Predictor</h1>
        <p className="page-subtitle">
          Get AI-powered predictions on how judges might score your hackathon project
        </p>

        <form onSubmit={handleSubmit} className="predictor-form">
          <div className="form-group">
            <label htmlFor="idea">Your Idea *</label>
            <textarea
              id="idea"
              name="idea"
              value={formData.idea}
              onChange={handleChange}
              placeholder="Describe your hackathon idea, including the problem you're solving and your solution..."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roadmap">Roadmap (Optional)</label>
            <textarea
              id="roadmap"
              name="roadmap"
              value={formData.roadmap}
              onChange={handleChange}
              placeholder="Paste your project roadmap or development plan..."
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="techStack">Tech Stack (Optional)</label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB, TensorFlow"
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamSize">Team Size (Optional)</label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="e.g., 4"
                min="1"
                max="10"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Predict Scores'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {prediction && (
          <div className="prediction-results">
            <h2>Your Prediction Results</h2>

            {/* Overall Winning Probability */}
            <div className={`winning-probability ${getWinningColor(prediction.overallWinningProbability)}`}>
              <div className="probability-content">
                <div className="probability-label">Overall Winning Probability</div>
                <div className="probability-score">{prediction.overallWinningProbability}%</div>
                <div className="probability-bar">
                  <div 
                    className="probability-fill" 
                    style={{ width: `${prediction.overallWinningProbability}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Score Cards */}
            <div className="score-grid">
              {/* Innovation Score */}
              <div className={`score-card ${getScoreColor(prediction.innovationScore.score)}`}>
                <div className="score-header">
                  <h3>Innovation</h3>
                  <div className="score-value">{prediction.innovationScore.score}/100</div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${prediction.innovationScore.score}%` }}
                  ></div>
                </div>
                <div className="score-details">
                  <p className="score-reason">{prediction.innovationScore.reason}</p>
                  <p className="score-improvement"><strong>Improvement:</strong> {prediction.innovationScore.improvement}</p>
                </div>
              </div>

              {/* Feasibility Score */}
              <div className={`score-card ${getScoreColor(prediction.feasibilityScore.score)}`}>
                <div className="score-header">
                  <h3>Feasibility</h3>
                  <div className="score-value">{prediction.feasibilityScore.score}/100</div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${prediction.feasibilityScore.score}%` }}
                  ></div>
                </div>
                <div className="score-details">
                  <p className="score-reason">{prediction.feasibilityScore.reason}</p>
                  <p className="score-improvement"><strong>Improvement:</strong> {prediction.feasibilityScore.improvement}</p>
                </div>
              </div>

              {/* Technical Depth Score */}
              <div className={`score-card ${getScoreColor(prediction.technicalDepthScore.score)}`}>
                <div className="score-header">
                  <h3>Technical Depth</h3>
                  <div className="score-value">{prediction.technicalDepthScore.score}/100</div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${prediction.technicalDepthScore.score}%` }}
                  ></div>
                </div>
                <div className="score-details">
                  <p className="score-reason">{prediction.technicalDepthScore.reason}</p>
                  <p className="score-improvement"><strong>Improvement:</strong> {prediction.technicalDepthScore.improvement}</p>
                </div>
              </div>

              {/* Impact Score */}
              <div className={`score-card ${getScoreColor(prediction.impactScore.score)}`}>
                <div className="score-header">
                  <h3>Impact</h3>
                  <div className="score-value">{prediction.impactScore.score}/100</div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${prediction.impactScore.score}%` }}
                  ></div>
                </div>
                <div className="score-details">
                  <p className="score-reason">{prediction.impactScore.reason}</p>
                  <p className="score-improvement"><strong>Improvement:</strong> {prediction.impactScore.improvement}</p>
                </div>
              </div>

              {/* Presentation Score */}
              <div className={`score-card ${getScoreColor(prediction.presentationScore.score)}`}>
                <div className="score-header">
                  <h3>Presentation</h3>
                  <div className="score-value">{prediction.presentationScore.score}/100</div>
                </div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${prediction.presentationScore.score}%` }}
                  ></div>
                </div>
                <div className="score-details">
                  <p className="score-reason">{prediction.presentationScore.reason}</p>
                  <p className="score-improvement"><strong>Improvement:</strong> {prediction.presentationScore.improvement}</p>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="radar-chart-container">
              <h3>Score Visualization</h3>
              <svg viewBox="0 0 400 400" className="radar-chart">
                {/* Background grid */}
                <polygon points="200,50 350,125 350,275 200,350 50,275 50,125" className="radar-grid" opacity="0.2" />
                <polygon points="200,90 310,145 310,255 200,310 90,255 90,145" className="radar-grid" opacity="0.2" />
                <polygon points="200,130 270,165 270,235 200,270 130,235 130,165" className="radar-grid" opacity="0.2" />
                <polygon points="200,170 230,185 230,215 200,230 170,215 170,185" className="radar-grid" opacity="0.2" />
                
                {/* Axis lines */}
                <line x1="200" y1="200" x2="200" y2="50" className="radar-axis" />
                <line x1="200" y1="200" x2="350" y2="125" className="radar-axis" />
                <line x1="200" y1="200" x2="350" y2="275" className="radar-axis" />
                <line x1="200" y1="200" x2="200" y2="350" className="radar-axis" />
                <line x1="200" y1="200" x2="50" y2="275" className="radar-axis" />
                <line x1="200" y1="200" x2="50" y2="125" className="radar-axis" />
                
                {/* Score polygon */}
                <polygon 
                  points={`
                    200,${200 - (prediction.innovationScore.score * 1.5)},
                    ${200 + (prediction.feasibilityScore.score * 1.3)},${200 - (prediction.feasibilityScore.score * 0.75)},
                    ${200 + (prediction.technicalDepthScore.score * 1.3)},${200 + (prediction.technicalDepthScore.score * 0.75)},
                    200,${200 + (prediction.impactScore.score * 1.5)},
                    ${200 - (prediction.presentationScore.score * 1.3)},${200 + (prediction.presentationScore.score * 0.75)},
                    ${200 - (100 * 1.3)},${200 - (100 * 0.75)}
                  `}
                  className="radar-score"
                />
                
                {/* Labels */}
                <text x="200" y="40" className="radar-label" textAnchor="middle">Innovation</text>
                <text x="365" y="130" className="radar-label">Feasibility</text>
                <text x="365" y="280" className="radar-label">Technical</text>
                <text x="200" y="370" className="radar-label" textAnchor="middle">Impact</text>
                <text x="35" y="280" className="radar-label" textAnchor="end">Presentation</text>
              </svg>
            </div>

            {/* Overall Review */}
            {prediction.overallReview && (
              <div className="overall-review">
                <h3>Judge's Perspective</h3>
                <p>{prediction.overallReview}</p>
              </div>
            )}

            {/* Key Recommendations */}
            {prediction.keyRecommendations && prediction.keyRecommendations.length > 0 && (
              <div className="recommendations">
                <h3>Key Recommendations to Increase Winning Chances</h3>
                <ul>
                  {prediction.keyRecommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Best Improvement */}
            {prediction.nextBestImprovement && (
              <div className="next-improvement">
                <h3>🎯 Next Best Improvement</h3>
                <div className="improvement-content">
                  <div className="improvement-header">
                    <div className="improvement-criterion">
                      <span className="label">Focus Area:</span>
                      <span className="value">{prediction.nextBestImprovement.criterion}</span>
                    </div>
                    <div className="improvement-scores">
                      <div className="current-score">
                        <span className="label">Current</span>
                        <span className="score">{prediction.nextBestImprovement.currentScore}</span>
                      </div>
                      <span className="arrow">→</span>
                      <div className="potential-score">
                        <span className="label">Potential</span>
                        <span className="score">{prediction.nextBestImprovement.potentialScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="improvement-action">
                    <h4>Action Plan:</h4>
                    <p>{prediction.nextBestImprovement.action}</p>
                  </div>
                  <div className="improvement-impact">
                    <strong>Expected Impact:</strong> {prediction.nextBestImprovement.expectedImpact}
                  </div>
                </div>
              </div>
            )}

            {/* Competitor Comparison */}
            {prediction.competitorComparison && (
              <div className="competitor-comparison">
                <h3>📊 Competitor Analysis</h3>
                <div className="comparison-grid">
                  <div className="comparison-section">
                    <div className="comparison-header">
                      <h4>Your Score vs Typical Competitors</h4>
                      <div className="score-comparison">
                        <span className="your-score">You: {prediction.overallWinningProbability}%</span>
                        <span className="vs">vs</span>
                        <span className="competitor-score">Average: {prediction.competitorComparison.typicalCompetitorScore}%</span>
                      </div>
                    </div>
                    <p className="standout-factor">{prediction.competitorComparison.standoutFactor}</p>
                  </div>
                  
                  <div className="advantages-grid">
                    <div className="advantages-section your-advantages">
                      <h4>✓ Your Competitive Advantages</h4>
                      <ul>
                        {prediction.competitorComparison.yourAdvantages.map((adv, idx) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="advantages-section competitor-advantages">
                      <h4>⚠ Areas to Strengthen</h4>
                      <ul>
                        {prediction.competitorComparison.competitorAdvantages.map((adv, idx) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Idea Changes to Boost Scores */}
            {prediction.ideaChanges && (
              <div className="idea-changes">
                <h3>💡 Strategic Changes to Boost Your Score</h3>
                
                <div className="changes-section quick-wins">
                  <h4>⚡ Quick Wins (High Impact, Low Effort)</h4>
                  <div className="changes-list">
                    {prediction.ideaChanges.quickWins?.map((win, idx) => (
                      <div key={idx} className="change-item quick-win">
                        <span className="change-number">{idx + 1}</span>
                        <p>{win}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="changes-section pivot-suggestions">
                  <h4>🔄 Major Pivots for Maximum Impact</h4>
                  <div className="changes-list">
                    {prediction.ideaChanges.pivotSuggestions?.map((pivot, idx) => (
                      <div key={idx} className="change-item pivot">
                        <p>{pivot}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="changes-section feature-additions">
                  <h4>➕ Feature Additions That Impress Judges</h4>
                  <div className="changes-list">
                    {prediction.ideaChanges.featureAdditions?.map((feature, idx) => (
                      <div key={idx} className="change-item feature">
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default JudgePredictor;
