# 🚀 IdeaBot - Your AI Hackathon Assistant

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/TejaswaniRai/IdeaBot-your-AI-Hackathon-Assistant)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Empowering hackathon participants with AI-powered idea generation, personalized roadmaps, and smart project planning.

---

## 📖 About IdeaBot

IdeaBot is an AI-powered platform that revolutionizes the hackathon experience by helping teams:
- 💡 **Generate innovative project ideas** tailored to your team's skills and chosen domain
- 🗺️ **Create personalized roadmaps** with phase-wise execution plans and time estimates
- 🎯 **Get tech stack recommendations** based on team expertise and project requirements
- 🏆 **Discover hackathons** worldwide with filters for mode, region, and themes
- 🤖 **Predict judge scores** to refine your project before submission

**Key Highlights:**
- ✅ No login required - completely accessible
- ✅ Works without database - uses AI in real-time
- ✅ Free to use - open source platform
- ✅ Intelligent insights - powered by OpenRouter AI (Grok 4.1)

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    IdeaBot Workflow                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Team Profile                    Step 2: Domain Selection
┌──────────────────────┐                ┌──────────────────────┐
│ • Team Name          │                │ 🏥 Healthcare        │
│ • Team Size          │   ────────►    │ 📚 Education         │
│ • Skills & Tech      │                │ 💰 FinTech           │
│ • Experience Level   │                │ 🌱 Sustainability    │
└──────────────────────┘                └──────────┬───────────┘
                                                   │
                    ┌──────────────────────────────▼───────────┐
                    │   Step 3: AI Idea Generation             │
                    │   ┌────────────────────────────────────┐ │
                    │   │ 🤖 OpenRouter AI (Grok 4.1)       │ │
                    │   │ Generates unique project ideas    │ │
                    │   │ with description, tech stack,     │ │
                    │   │ target audience & impact          │ │
                    │   └────────────────────────────────────┘ │
                    └──────────────┬───────────────────────────┘
                                   │
        ┌──────────────────────────▼──────────────────────────┐
        │   Step 4: Personalized Roadmap                      │
        │   ┌───────────────────────────────────────────────┐ │
        │   │ Phase 1: Ideation (2-3 hrs)                  │ │
        │   │ Phase 2: Design (3-4 hrs)                    │ │
        │   │ Phase 3: Development (12-16 hrs)             │ │
        │   │ Phase 4: Testing (2-3 hrs)                   │ │
        │   │ Phase 5: Deployment (2-3 hrs)                │ │
        │   │ + Tech recommendations & resources           │ │
        │   └───────────────────────────────────────────────┘ │
        └─────────────────────────────────────────────────────┘
```

**Architecture:**
```
Frontend (React)  ──HTTP──►  Backend (Express)  ──API──►  OpenRouter AI
     ↑                              │
     │                              ▼
     └─────────── JSON ─────── AI Response
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI framework with hooks
- **React Router 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP requests
- **CSS3** - Advanced styling with animations & glassmorphism

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **MongoDB (Optional)** - Database for persistence
- **Mongoose 8.0.3** - ODM for MongoDB

### AI Integration
- **AI API** - AI gateway for multiple models

---

## 📥 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/TejaswaniRai/IdeaBot-your-AI-Hackathon-Assistant.git
cd IdeaBot-your-AI-Hackathon-Assistant
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "API_KEY=your_api_key_here" >> .env
echo "NODE_ENV=development" >> .env

# Start server
npm start
```
Backend runs on `http://localhost:5000`

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

---

## 🚀 Future Scope

### Planned Features
- 🔐 **User Authentication** - Save and track project history
- 💾 **Database Integration** - Persistent storage for ideas and roadmaps
- 🤝 **Team Collaboration** - Real-time collaboration tools
- 📊 **Analytics Dashboard** - Track team progress and productivity
- 🎨 **Custom Themes** - Personalized UI themes
- 📱 **Mobile App** - Native iOS/Android applications
- 🔔 **Notifications** - Hackathon reminders and deadlines
- 🏅 **Gamification** - Badges, points, and leaderboards
- 🌐 **Multi-language Support** - Internationalization
- 🔗 **API Access** - Public API for third-party integrations
- 🎯 **ML Model Training** - Custom AI models trained on winning projects
- 📝 **Pitch Deck Generator** - AI-powered presentation creation

### Areas to Improve
- Enhanced error handling and validation
- Better caching for API responses
- Offline mode support
- Advanced filtering for hackathons
- Integration with GitHub, DevPost, and other platforms
- Voice-based idea generation
- Video demo creation assistance

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👩‍💻 Developer

<div align="center">

### **Tejaswani Rai**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin)](https://www.linkedin.com/in/tejaswani-rai/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?logo=github)](https://github.com/TejaswaniRai)

*Building tools to empower the next generation of innovators* 🚀

---

**Made with ❤️ for hackathon enthusiasts worldwide**

⭐ Star this repo if you find it helpful!

</div>




