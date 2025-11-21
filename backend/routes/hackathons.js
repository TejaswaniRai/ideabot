const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');
const { validateAddHackathon } = require('../middleware/validation');

router.get('/', hackathonController.getHackathons);
router.post('/add', validateAddHackathon, hackathonController.addHackathon);

module.exports = router;
