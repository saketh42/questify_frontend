const express = require('express');
const { body, param, query } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
];

const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

// Public routes
router.get('/leaderboard', userController.getLeaderboard);
router.get('/search', [
  query('q')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search query must be between 1 and 50 characters'),
], userController.searchUsers);

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);
router.delete('/account', userController.deleteAccount);

// User stats and achievements
router.get('/stats', userController.getUserStats);
router.get('/achievements', userController.getUserAchievements);
router.get('/activity', userController.getUserActivity);

// User preferences
router.get('/preferences', userController.getPreferences);
router.put('/preferences', [
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification preference must be boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification preference must be boolean'),
], userController.updatePreferences);

// Public user profiles (with authentication to show more details if logged in)
router.get('/:id', userIdValidation, userController.getUserById);
router.get('/:id/quests', userIdValidation, userController.getUserQuests);
router.get('/:id/stats', userIdValidation, userController.getUserStatsById);

// Admin routes
router.use(authorize('admin', 'moderator')); // Admin/Moderator only routes

router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role filter'),
], userController.getAllUsers);

router.put('/:id/role', userIdValidation, [
  body('role')
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role'),
], userController.updateUserRole);

router.put('/:id/status', userIdValidation, [
  body('isActive')
    .isBoolean()
    .withMessage('Status must be boolean'),
], userController.updateUserStatus);

module.exports = router;
