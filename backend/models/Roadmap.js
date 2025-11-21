const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  phases: [{
    name: String,
    duration: String,
    tasks: [{
      title: String,
      description: String,
      completed: {
        type: Boolean,
        default: false
      }
    }]
  }],
  techRecommendations: [String],
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
