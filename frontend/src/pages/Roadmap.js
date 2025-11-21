import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { generateRoadmap } from '../services/api';
import Footer from '../components/Footer';
import './Roadmap.css';

const Roadmap = () => {
  const location = useLocation();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRoadmap = useCallback(async () => {
    if (!location.state?.idea || !location.state?.team) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await generateRoadmap(location.state.idea, location.state.team);
      setRoadmap(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.idea && location.state?.team) {
      handleGenerateRoadmap();
    }
  }, [location.state, handleGenerateRoadmap]);

  const toggleTask = (phaseIndex, taskIndex) => {
    const updatedRoadmap = { ...roadmap };
    updatedRoadmap.phases[phaseIndex].tasks[taskIndex].completed = 
      !updatedRoadmap.phases[phaseIndex].tasks[taskIndex].completed;
    setRoadmap(updatedRoadmap);
  };

  const calculateProgress = () => {
    if (!roadmap || !roadmap.phases) return 0;
    const totalTasks = roadmap.phases.reduce((sum, phase) => sum + (phase.tasks?.length || 0), 0);
    const completedTasks = roadmap.phases.reduce(
      (sum, phase) => sum + (phase.tasks?.filter(task => task.completed).length || 0),
      0
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Generating your personalized roadmap...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap && !location.state?.idea) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="page-title">Hackathon Roadmap</h1>
          <p style={{ textAlign: 'center', color: '#718096' }}>
            Please generate an idea first to create your roadmap.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <div className="card">
        <h1 className="page-title">Your Hackathon Roadmap</h1>
        
        {roadmap && (
          <>
            <div className="roadmap-header">
              <div className="progress-section">
                <div className="progress-label">
                  Overall Progress: {calculateProgress()}%
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="roadmap-content">
              <div className="phases">
                {roadmap.phases && roadmap.phases.length > 0 ? roadmap.phases.map((phase, phaseIndex) => (
                  <div key={phaseIndex} className="phase-card">
                    <div className="phase-header">
                      <h2>{phase.name}</h2>
                      <span className="phase-duration">⏱️ {phase.duration}</span>
                    </div>
                    
                    <div className="tasks-list">
                      {phase.tasks && phase.tasks.length > 0 ? phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="task-item">
                          <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() => toggleTask(phaseIndex, taskIndex)}
                            className="task-checkbox"
                          />
                          <div className="task-content">
                            <h4 className={task.completed ? 'completed' : ''}>
                              {task.title}
                            </h4>
                            <p>{task.description}</p>
                          </div>
                        </div>
                      )) : <p>No tasks available</p>}
                    </div>
                  </div>
                )) : <p>No phases available</p>}
              </div>

              <div className="sidebar">
                <div className="sidebar-section">
                  <h3>💻 Tech Stack</h3>
                  <div className="tech-tags">
                    {(roadmap.techStack || roadmap.techRecommendations || []).map((tech, index) => (
                      <span key={index} className="badge badge-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sidebar-section">
                  <h3>📚 Resources</h3>
                  <ul className="tips-list">
                    {(roadmap.resources || []).map((resource, index) => (
                      <li key={index}>{typeof resource === 'string' ? resource : resource.title}</li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-section">
                  <h3>💡 Recommendations</h3>
                  <ul className="tips-list">
                    {(roadmap.recommendations || []).map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
      
      <Footer />
    </div>
  );
};

export default Roadmap;
