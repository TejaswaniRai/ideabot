const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const { validateJudgePrediction } = require('../middleware/validation');

/**
 * POST /api/judge/predict
 * Predict judge scores for a hackathon project
 */
router.post('/predict', validateJudgePrediction, judgeController.predictScore);

module.exports = router;
