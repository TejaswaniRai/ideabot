const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

/**
 * Validation rules for generating ideas
 */
const validateGenerateIdea = [
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Domain must be between 2 and 100 characters'),
  body('context')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Context must not exceed 1000 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for creating teams
 */
const validateCreateTeam = [
  body('teamSize')
    .isInt({ min: 1, max: 20 })
    .withMessage('Team size must be between 1 and 20'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('experience')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Experience must be Beginner, Intermediate, or Advanced'),
  body('interests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Interests must not exceed 500 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for generating roadmaps
 */
const validateGenerateRoadmap = [
  body('idea')
    .trim()
    .notEmpty()
    .withMessage('Idea is required')
    .isLength({ max: 5000 })
    .withMessage('Idea must not exceed 5000 characters'),
  body('team')
    .optional()
    .isObject()
    .withMessage('Team must be an object'),
  handleValidationErrors,
];

/**
 * Validation rules for judge prediction
 */
const validateJudgePrediction = [
  body('idea')
    .trim()
    .notEmpty()
    .withMessage('Idea is required')
    .isLength({ max: 5000 })
    .withMessage('Idea must not exceed 5000 characters'),
  body('roadmap')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Roadmap must not exceed 5000 characters'),
  body('techStack')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Tech stack must not exceed 500 characters'),
  body('teamSize')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Team size must be between 1 and 20'),
  handleValidationErrors,
];

/**
 * Validation rules for tech stack suggestions
 */
const validateTechStackSuggestion = [
  body('idea')
    .trim()
    .notEmpty()
    .withMessage('Idea is required')
    .isLength({ max: 5000 })
    .withMessage('Idea must not exceed 5000 characters'),
  body('domain')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Domain must not exceed 100 characters'),
  body('preferredLanguages')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Preferred languages must not exceed 500 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for adding hackathons
 */
const validateAddHackathon = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('url')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL must be valid'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  handleValidationErrors,
];

module.exports = {
  validateGenerateIdea,
  validateCreateTeam,
  validateGenerateRoadmap,
  validateJudgePrediction,
  validateTechStackSuggestion,
  validateAddHackathon,
  handleValidationErrors,
};
