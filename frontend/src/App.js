import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import IdeaGenerator from './pages/IdeaGenerator';
import Roadmap from './pages/Roadmap';
import Hackathons from './pages/Hackathons';
import JudgePredictor from './pages/JudgePredictor';
import TechStackSuggestor from './pages/TechStackSuggestor';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<IdeaGenerator />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/judge" element={<JudgePredictor />} />
          <Route path="/tech-stack" element={<TechStackSuggestor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
