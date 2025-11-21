const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetAudience: String,
  impact: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: String,
  votes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Idea', IdeaSchema);
