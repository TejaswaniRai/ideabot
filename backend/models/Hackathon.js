const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  organizer: String,
  startDate: Date,
  endDate: Date,
  location: String,
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid']
  },
  themes: [String],
  prizes: String,
  registrationLink: String,
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  region: {
    type: String,
    enum: ['india', 'global'],
    default: 'india'
  }
});

module.exports = mongoose.model('Hackathon', HackathonSchema);
