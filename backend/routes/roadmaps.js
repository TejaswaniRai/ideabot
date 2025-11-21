const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { validateGenerateRoadmap } = require('../middleware/validation');

router.post('/generate', validateGenerateRoadmap, roadmapController.generateRoadmap);
router.put('/update-task', roadmapController.updateTask);

module.exports = router;
