const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { validateCreateTeam } = require('../middleware/validation');

router.post('/create', validateCreateTeam, teamController.createTeam);
router.post('/suggest-topics', validateCreateTeam, teamController.suggestTopics);

module.exports = router;
