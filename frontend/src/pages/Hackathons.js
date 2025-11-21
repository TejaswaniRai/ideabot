import React, { useState, useEffect, useCallback } from 'react';
import { getHackathons } from '../services/api';
import Footer from '../components/Footer';
import './Hackathons.css';

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    region: '',
    mode: ''
  });

  const fetchHackathons = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getHackathons(filters);
      setHackathons(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch hackathons');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ongoing': return 'badge-success';
      case 'upcoming': return 'badge-primary';
      case 'completed': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  return (
    <div>
      <div className="container">
        <div className="card">
        <h1 className="page-title">Discover Hackathons</h1>
        <p className="page-subtitle">
          Find the perfect hackathon to showcase your skills and compete
        </p>

        <div className="filters">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Region</label>
            <select 
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All</option>
              <option value="india">India</option>
              <option value="global">Global</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Mode</label>
            <select 
              value={filters.mode}
              onChange={(e) => handleFilterChange('mode', e.target.value)}
            >
              <option value="">All</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading hackathons...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {!loading && hackathons.length === 0 && (
          <div className="no-results">
            <p>No hackathons found matching your filters</p>
          </div>
        )}

        {!loading && hackathons.length > 0 && (
          <div className="hackathons-grid">
            {hackathons.map((hackathon, index) => (
              <div key={index} className="hackathon-card">
                <div className="hackathon-header">
                  <h3>{hackathon.name}</h3>
                  <span className={`badge ${getStatusBadgeClass(hackathon.status)}`}>
                    {hackathon.status}
                  </span>
                </div>

                <div className="hackathon-info">
                  <div className="info-item">
                    <span className="info-icon">👥</span>
                    <span>{hackathon.organizer}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span>{hackathon.location}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span>
                      {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">🌐</span>
                    <span className="mode-badge">{hackathon.mode}</span>
                  </div>

                  {hackathon.prizes && (
                    <div className="info-item">
                      <span className="info-icon">💰</span>
                      <span>{hackathon.prizes}</span>
                    </div>
                  )}
                </div>

                {hackathon.themes && hackathon.themes.length > 0 && (
                  <div className="themes">
                    <strong>Themes:</strong>
                    <div className="theme-tags">
                      {hackathon.themes.map((theme, idx) => (
                        <span key={idx} className="badge badge-info">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hackathon.registrationLink && (
                  <a 
                    href={hackathon.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary hackathon-btn"
                  >
                    Register Now →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      
      <Footer />
    </div>
  );
};

export default Hackathons;
