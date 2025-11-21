const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { validateGenerateIdea } = require('../middleware/validation');

router.post('/generate', validateGenerateIdea, ideaController.generateIdea);
router.get('/', ideaController.getIdeas);
router.post('/:id/vote', ideaController.voteIdea);

module.exports = router;
