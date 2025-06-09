const express = require('express');
const { body, param, query } = require('express-validator');
const questController = require('../controllers/questController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createQuestValidation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('category')
    .isIn(['fitness', 'learning', 'creativity', 'productivity', 'social', 'health', 'career', 'hobby', 'travel', 'other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Invalid difficulty level'),
  body('type')
    .isIn(['daily', 'weekly', 'monthly', 'one-time', 'habit'])
    .withMessage('Invalid quest type'),
  body('points')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Points must be between 1 and 10000'),
  body('duration.estimated')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
];

const questIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid quest ID'),
];

const participantValidation = [
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'failed', 'abandoned'])
    .withMessage('Invalid status'),
];

// Public routes (with optional authentication for personalized results)
router.get('/', optionalAuth, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('category')
    .optional()
    .isIn(['fitness', 'learning', 'creativity', 'productivity', 'social', 'health', 'career', 'hobby', 'travel', 'other'])
    .withMessage('Invalid category'),
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Invalid difficulty'),
  query('type')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'one-time', 'habit'])
    .withMessage('Invalid type'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
], questController.getQuests);

router.get('/featured', optionalAuth, questController.getFeaturedQuests);
router.get('/trending', optionalAuth, questController.getTrendingQuests);
router.get('/categories', questController.getCategories);

router.get('/:id', questIdValidation, optionalAuth, questController.getQuestById);

// Protected routes
router.use(protect); // All routes below require authentication

// Quest management
router.post('/', createQuestValidation, questController.createQuest);
router.put('/:id', questIdValidation, createQuestValidation, questController.updateQuest);
router.delete('/:id', questIdValidation, questController.deleteQuest);

// Quest participation
router.post('/:id/join', questIdValidation, questController.joinQuest);
router.post('/:id/leave', questIdValidation, questController.leaveQuest);
router.put('/:id/progress', questIdValidation, participantValidation, questController.updateProgress);

// Quest interactions
router.post('/:id/rate', questIdValidation, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters'),
], questController.rateQuest);

router.post('/:id/report', questIdValidation, [
  body('reason')
    .isIn(['inappropriate', 'spam', 'misleading', 'copyright', 'other'])
    .withMessage('Invalid report reason'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
], questController.reportQuest);

// User's quest history
router.get('/my/created', questController.getMyCreatedQuests);
router.get('/my/joined', questController.getMyJoinedQuests);
router.get('/my/completed', questController.getMyCompletedQuests);

// Admin/Moderator routes
router.use(authorize('admin', 'moderator'));

router.put('/:id/feature', questIdValidation, [
  body('featured')
    .isBoolean()
    .withMessage('Featured status must be boolean'),
], questController.toggleFeatured);

router.put('/:id/moderate', questIdValidation, [
  body('action')
    .isIn(['approve', 'reject', 'suspend'])
    .withMessage('Invalid moderation action'),
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
], questController.moderateQuest);

router.get('/reports/pending', questController.getPendingReports);

module.exports = router;
