// Removed database dependency - using static data

// Sample hackathon data
const sampleHackathons = [
  {
    name: 'Smart India Hackathon 2025',
    organizer: 'Government of India',
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-03'),
    location: 'Multiple cities across India',
    mode: 'hybrid',
    themes: ['Smart Education', 'Healthcare', 'Agriculture', 'Clean Energy'],
    prizes: '₹1 Lakh for winners',
    registrationLink: 'https://sih.gov.in',
    status: 'upcoming',
    region: 'india'
  },
  {
    name: 'HackMIT 2025',
    organizer: 'Massachusetts Institute of Technology',
    startDate: new Date('2025-11-25'),
    endDate: new Date('2025-11-27'),
    location: 'Cambridge, MA',
    mode: 'online',
    themes: ['AI/ML', 'Blockchain', 'IoT', 'Web3'],
    prizes: '$10,000 in prizes',
    registrationLink: 'https://hackmit.org',
    status: 'upcoming',
    region: 'global'
  },
  {
    name: 'DevJams 2025',
    organizer: 'Major League Hacking',
    startDate: new Date('2025-11-22'),
    endDate: new Date('2025-11-24'),
    location: 'Online',
    mode: 'online',
    themes: ['Open Innovation', 'Gaming', 'Developer Tools'],
    prizes: 'Swag and prizes',
    registrationLink: 'https://mlh.io',
    status: 'ongoing',
    region: 'global'
  },
  {
    name: 'Code for Good',
    organizer: 'JP Morgan Chase',
    startDate: new Date('2025-12-10'),
    endDate: new Date('2025-12-12'),
    location: 'Mumbai, Bangalore',
    mode: 'offline',
    themes: ['Social Impact', 'Financial Inclusion', 'Education'],
    prizes: 'Job opportunities + prizes',
    registrationLink: 'https://careers.jpmorgan.com',
    status: 'upcoming',
    region: 'india'
  }
];

// Get all hackathons with filters
exports.getHackathons = async (req, res) => {
  try {
    const { status, region, mode } = req.query;

    try {
      let query = {};
      if (status) query.status = status;
      if (region) query.region = region;
      if (mode) query.mode = mode;

      const hackathons = await Hackathon.find(query).sort({ startDate: 1 });
      
      // If no hackathons in DB, return sample data
      if (hackathons.length === 0) {
        let filtered = sampleHackathons;
        if (status) filtered = filtered.filter(h => h.status === status);
        if (region) filtered = filtered.filter(h => h.region === region);
        if (mode) filtered = filtered.filter(h => h.mode === mode);
        return res.json(filtered);
      }

      res.json(hackathons);
    } catch (dbError) {
      console.log('Database not connected, returning sample hackathons');
      let filtered = sampleHackathons;
      if (status) filtered = filtered.filter(h => h.status === status);
      if (region) filtered = filtered.filter(h => h.region === region);
      if (mode) filtered = filtered.filter(h => h.mode === mode);
      res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new hackathon (for admin/community contributions)
exports.addHackathon = async (req, res) => {
  try {
    const hackathonData = req.body;

    try {
      const hackathon = new Hackathon(hackathonData);
      await hackathon.save();
      res.json(hackathon);
    } catch (dbError) {
      console.log('Database not connected, returning hackathon data without saving');
      res.json(hackathonData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
