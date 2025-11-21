import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      {/* Floating decorative elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
      
      {/* Animated particles */}
      <div className="particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
      </div>
      
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Transform Your Vision Into Award-Winning Hackathon Projects
          </h1>
          <p className="hero-subtitle">
            <span className="sliding-text">Generate innovative ideas, get tailored roadmaps, and discover hackathons worldwide with AI-powered insights.</span>
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/generate')}>
              Generate Idea
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/hackathons')}>
              Explore Hackathons
            </button>
          </div>
        </div>
      </section>

      <section className="features" ref={featuresRef}>
        <div className="container">
          <h2 className="section-title">Why Choose IdeaBot?</h2>
          <div className="grid">
          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>AI-Powered Idea Generation</h3>
            <p>Generate unique, competition-ready concepts using advanced ML algorithms trained on thousands of winning hackathon projects.</p>
          </div>
            <div className="feature-card">
              <div className="feature-icon">◆</div>
              <h3>Personalized Strategy</h3>
              <p>Get tailored recommendations aligned with your team's skills, tech stack, and experience level for maximum success potential.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">◇</div>
              <h3>Strategic Roadmaps</h3>
              <p>Follow comprehensive execution blueprints with task breakdowns, milestone tracking, and time estimates optimized for hackathons.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">◉</div>
              <h3>Global Opportunities</h3>
              <p>Discover curated hackathons worldwide. Filter by location, prize pool, tech stack, and difficulty to find your perfect match.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" ref={stepsRef}>
        <div className="container">
          <h2 className="section-title">Your Journey to Victory</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <h3>Define Your Domain</h3>
                <p>Select your area of interest from healthcare, education, finance, sustainability, agriculture, or social impact.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>
            <h3>Receive AI-Curated Concepts</h3>
            <p>Get innovative project ideas with problem statements, impact assessments, and competitive advantage analysis.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>
            <h3>Configure Team Parameters</h3>
            <p>Share your team's size, skills, tech stack, and experience level for hyper-personalized recommendations.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div>
            <h3>Access Strategic Blueprint</h3>
            <p>Get a detailed roadmap with development phases, tasks, resources, milestones, and time allocations for 24-48 hour hackathons.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <div>
                <h3>Build and Triumph</h3>
                <p>Execute confidently with milestone tracking, resource access, and team sync to deliver an impressive, judge-ready project.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta" ref={ctaRef}>
        <div className="container">
          <h2>Transform Ideas Into Reality</h2>
          <p>Join thousands of innovators leveraging AI-powered insights to build award-winning projects. Start your journey to hackathon success today with intelligent guidance, strategic planning, and data-driven recommendations that set you apart from the competition.</p>
          <button className="btn btn-primary" onClick={() => navigate('/generate')}>
            Get Started
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
