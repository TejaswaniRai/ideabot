import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ideas API
export const generateIdea = (domain, context = '') => api.post('/ideas/generate', { domain, context });
export const getIdeas = () => api.get('/ideas');
export const voteIdea = (id) => api.post(`/ideas/${id}/vote`);

// Teams API
export const createTeam = (teamData) => api.post('/teams/create', teamData);
export const suggestTopics = (teamData) => api.post('/teams/suggest-topics', teamData);

// Roadmaps API
export const generateRoadmap = (idea, team) => api.post('/roadmaps/generate', { idea, team });
export const updateTask = (data) => api.put('/roadmaps/update-task', data);

// Hackathons API
export const getHackathons = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/hackathons?${params}`);
};
export const addHackathon = (hackathonData) => api.post('/hackathons/add', hackathonData);

// Judge Predictor API
export const predictJudgeScore = async (projectData) => {
  const response = await api.post('/judge/predict', projectData);
  return response.data.prediction;
};

// Tech Stack Suggestor API
export const suggestTechStack = async (projectData) => {
  const response = await api.post('/tech-stack/suggest', projectData);
  return response.data.suggestion;
};

export default api;
