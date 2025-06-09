const express = require('express');
const { query } = require('express-validator');
const apiController = require('../controllers/apiController');

const router = express.Router();

// API routes that require API key authentication
// These routes are specifically designed for frontend-backend communication

// API Information
router.get('/info', apiController.getApiInfo);

// Health check with detailed information
router.get('/health', apiController.getHealthCheck);

// Statistics endpoints
router.get('/stats/overview', apiController.getOverviewStats);
router.get('/stats/users', apiController.getUserStats);
router.get('/stats/quests', apiController.getQuestStats);

// Data endpoints for frontend
router.get('/data/categories', apiController.getCategories);
router.get('/data/difficulties', apiController.getDifficulties);
router.get('/data/quest-types', apiController.getQuestTypes);

// Search and filtering
router.get('/search/quests', [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('category')
    .optional()
    .isIn(['fitness', 'learning', 'creativity', 'productivity', 'social', 'health', 'career', 'hobby', 'travel', 'other'])
    .withMessage('Invalid category'),
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Invalid difficulty'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
], apiController.searchQuests);

router.get('/search/users', [
  query('q')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search query must be between 1 and 50 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
], apiController.searchUsers);

// Recommendations
router.get('/recommendations/quests', [
  query('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
], apiController.getQuestRecommendations);

// Leaderboards
router.get('/leaderboard/users', [
  query('timeframe')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'all-time'])
    .withMessage('Invalid timeframe'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
], apiController.getUserLeaderboard);

router.get('/leaderboard/quests', [
  query('sortBy')
    .optional()
    .isIn(['popular', 'rating', 'recent', 'completion-rate'])
    .withMessage('Invalid sort criteria'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
], apiController.getQuestLeaderboard);

// Analytics endpoints (for dashboard)
router.get('/analytics/user-growth', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Invalid period'),
], apiController.getUserGrowthAnalytics);

router.get('/analytics/quest-completion', [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('Invalid period'),
], apiController.getQuestCompletionAnalytics);

router.get('/analytics/category-popularity', apiController.getCategoryPopularityAnalytics);

// Bulk operations
router.get('/bulk/quests', [
  query('ids')
    .isString()
    .withMessage('Quest IDs must be provided as comma-separated string'),
], apiController.getBulkQuests);

router.get('/bulk/users', [
  query('ids')
    .isString()
    .withMessage('User IDs must be provided as comma-separated string'),
], apiController.getBulkUsers);

// Configuration endpoints
router.get('/config/app', apiController.getAppConfig);
router.get('/config/features', apiController.getFeatureFlags);

module.exports = router;
