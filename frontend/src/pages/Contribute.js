import React from 'react';
import Footer from '../components/Footer';
import './Contribute.css';

const Contribute = () => {
  return (
    <div>
      <div className="container">
        <div className="card">
        <h1 className="page-title">Contribute to IdeaBot</h1>
        <p className="page-subtitle">
          Join our open source community and help shape the future of hackathon innovation. Your contributions make a real difference in helping teams worldwide build amazing projects.
        </p>

        <section className="contribute-section">
          <h2>🚀 Why Contribute?</h2>
          <div className="grid">
            <div className="contribute-card">
              <div className="contribute-icon">💻</div>
              <h3>Learn & Grow</h3>
              <p>Enhance your skills by working on real-world features</p>
            </div>
            <div className="contribute-card">
              <div className="contribute-icon">🤝</div>
              <h3>Build Network</h3>
              <p>Connect with developers and hackathon enthusiasts</p>
            </div>
            <div className="contribute-card">
              <div className="contribute-icon">🏆</div>
              <h3>Get Recognition</h3>
              <p>Earn contributor badges and leaderboard rankings</p>
            </div>
          </div>
        </section>

        <section className="contribute-section">
          <h2>📝 How to Contribute</h2>
          <div className="steps-vertical">
            <div className="step-vertical">
              <div className="step-num">1</div>
              <div className="step-details">
                <h3>Fork the Repository</h3>
                <p>Start by forking our GitHub repository to your account</p>
                <code>git clone https://github.com/your-username/ideabot.git</code>
              </div>
            </div>

            <div className="step-vertical">
              <div className="step-num">2</div>
              <div className="step-details">
                <h3>Choose an Issue</h3>
                <p>Browse open issues or propose a new feature</p>
                <ul>
                  <li>🐛 Bug fixes</li>
                  <li>✨ New features</li>
                  <li>📚 Documentation</li>
                  <li>🎨 UI/UX improvements</li>
                </ul>
              </div>
            </div>

            <div className="step-vertical">
              <div className="step-num">3</div>
              <div className="step-details">
                <h3>Create a Branch</h3>
                <p>Create a new branch for your contribution</p>
                <code>git checkout -b feature/your-feature-name</code>
              </div>
            </div>

            <div className="step-vertical">
              <div className="step-num">4</div>
              <div className="step-details">
                <h3>Make Changes</h3>
                <p>Write clean, well-documented code following our guidelines</p>
              </div>
            </div>

            <div className="step-vertical">
              <div className="step-num">5</div>
              <div className="step-details">
                <h3>Submit Pull Request</h3>
                <p>Push your changes and create a pull request</p>
                <code>git push origin feature/your-feature-name</code>
              </div>
            </div>
          </div>
        </section>

        <section className="contribute-section">
          <h2>💡 Contribution Ideas</h2>
          <div className="ideas-grid">
            <div className="idea-card">
              <h4>🤖 AI Improvements</h4>
              <p>Enhance idea generation prompts and suggestions</p>
            </div>
            <div className="idea-card">
              <h4>📊 Hackathon Tracking</h4>
              <p>Add integrations with DevPost, MLH, etc.</p>
            </div>
            <div className="idea-card">
              <h4>🎨 Frontend Features</h4>
              <p>Improve UI/UX and add new components</p>
            </div>
            <div className="idea-card">
              <h4>🔧 Backend APIs</h4>
              <p>Build new endpoints and optimize existing ones</p>
            </div>
            <div className="idea-card">
              <h4>📱 Mobile Support</h4>
              <p>Enhance mobile responsiveness and PWA features</p>
            </div>
            <div className="idea-card">
              <h4>🔌 Plugins</h4>
              <p>Create roadmap templates and collaboration tools</p>
            </div>
          </div>
        </section>

        <section className="contribute-section">
          <h2>🏅 Contributor Benefits</h2>
          <ul className="benefits-list">
            <li>✅ Featured on our contributors leaderboard</li>
            <li>✅ Exclusive contributor badge on profile</li>
            <li>✅ Early access to new features</li>
            <li>✅ Certificate of contribution</li>
            <li>✅ Networking opportunities with tech community</li>
            <li>✅ Guidance from experienced mentors</li>
          </ul>
        </section>

        <section className="contribute-section cta-section">
          <h2>Ready to Contribute?</h2>
          <p>Visit our GitHub repository to get started</p>
          <div className="cta-buttons">
            <a 
              href="https://github.com/your-repo/ideabot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              🔗 View on GitHub
            </a>
            <a 
              href="https://github.com/your-repo/ideabot/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              📋 Browse Issues
            </a>
          </div>
        </section>

        <section className="contribute-section">
          <h2>📧 Contact</h2>
          <p>Have questions? Reach out to us:</p>
          <div className="contact-info">
            <p>📧 Email: contribute@ideabot.dev</p>
            <p>💬 Discord: discord.gg/ideabot</p>
            <p>🐦 Twitter: @ideabot_dev</p>
          </div>
        </section>
      </div>
    </div>
      
      <Footer />
    </div>
  );
};

export default Contribute;
