const express = require('express');
const router = express.Router();
const techStackController = require('../controllers/techStackController');
const { validateTechStackSuggestion } = require('../middleware/validation');

/**
 * POST /api/tech-stack/suggest
 * Generate tech stack and architecture recommendations
 */
router.post('/suggest', validateTechStackSuggestion, techStackController.suggest);

module.exports = router;
