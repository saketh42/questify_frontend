const { validationResult } = require('express-validator');
const User = require('../models/User');
const Quest = require('../models/Quest');

// @desc    Get API information
// @route   GET /api/v1/info
// @access  Private (API Key required)
const getApiInfo = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        name: 'Questify API',
        version: '1.0.0',
        description: 'Backend API for Questify application',
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          quests: '/api/quests',
          protected: '/api/v1',
        },
        documentation: 'https://api.questify.com/docs',
        support: 'support@questify.com',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed health check
// @route   GET /api/v1/health
// @access  Private (API Key required)
const getHealthCheck = async (req, res, next) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
        services: {
          database: dbStatus,
          api: 'operational',
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check database connection
const checkDatabaseConnection = async () => {
  try {
    await User.findOne().limit(1);
    return 'connected';
  } catch (error) {
    return 'disconnected';
  }
};

// @desc    Get overview statistics
// @route   GET /api/v1/stats/overview
// @access  Private (API Key required)
const getOverviewStats = async (req, res, next) => {
  try {
    const [userStats, questStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
            verifiedUsers: { $sum: { $cond: ['$isEmailVerified', 1, 0] } },
            totalExperience: { $sum: '$stats.experience' },
            totalQuestsCompleted: { $sum: '$stats.questsCompleted' },
          },
        },
      ]),
      Quest.aggregate([
        {
          $group: {
            _id: null,
            totalQuests: { $sum: 1 },
            activeQuests: { $sum: { $cond: ['$isActive', 1, 0] } },
            publicQuests: { $sum: { $cond: ['$isPublic', 1, 0] } },
            totalParticipants: { $sum: '$stats.totalParticipants' },
            totalCompletions: { $sum: '$stats.completedCount' },
          },
        },
      ]),
    ]);

    const overview = {
      users: userStats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        totalExperience: 0,
        totalQuestsCompleted: 0,
      },
      quests: questStats[0] || {
        totalQuests: 0,
        activeQuests: 0,
        publicQuests: 0,
        totalParticipants: 0,
        totalCompletions: 0,
      },
    };

    // Calculate completion rate
    overview.completionRate = overview.quests.totalParticipants > 0
      ? Math.round((overview.quests.totalCompletions / overview.quests.totalParticipants) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/v1/stats/users
// @access  Private (API Key required)
const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          averageLevel: { $avg: '$stats.level' },
          averageExperience: { $avg: '$stats.experience' },
        },
      },
    ]);

    const levelDistribution = await User.aggregate([
      {
        $group: {
          _id: '$stats.level',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        roleDistribution: stats,
        levelDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest statistics
// @route   GET /api/v1/stats/quests
// @access  Private (API Key required)
const getQuestStats = async (req, res, next) => {
  try {
    const categoryStats = await Quest.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averageRating: { $avg: '$stats.averageRating' },
          totalParticipants: { $sum: '$stats.totalParticipants' },
        },
      },
    ]);

    const difficultyStats = await Quest.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          averagePoints: { $avg: '$points' },
          completionRate: {
            $avg: {
              $cond: [
                { $gt: ['$stats.totalParticipants', 0] },
                { $divide: ['$stats.completedCount', '$stats.totalParticipants'] },
                0,
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        categoryStats,
        difficultyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with metadata
// @route   GET /api/v1/data/categories
// @access  Private (API Key required)
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      { value: 'fitness', label: 'Fitness', icon: '💪', color: '#ef4444' },
      { value: 'learning', label: 'Learning', icon: '📚', color: '#3b82f6' },
      { value: 'creativity', label: 'Creativity', icon: '🎨', color: '#8b5cf6' },
      { value: 'productivity', label: 'Productivity', icon: '⚡', color: '#f59e0b' },
      { value: 'social', label: 'Social', icon: '👥', color: '#10b981' },
      { value: 'health', label: 'Health', icon: '🏥', color: '#06b6d4' },
      { value: 'career', label: 'Career', icon: '💼', color: '#6366f1' },
      { value: 'hobby', label: 'Hobby', icon: '🎯', color: '#ec4899' },
      { value: 'travel', label: 'Travel', icon: '✈️', color: '#14b8a6' },
      { value: 'other', label: 'Other', icon: '📝', color: '#6b7280' },
    ];

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get difficulty levels
// @route   GET /api/v1/data/difficulties
// @access  Private (API Key required)
const getDifficulties = async (req, res, next) => {
  try {
    const difficulties = [
      { value: 'easy', label: 'Easy', color: '#10b981', pointsRange: '1-100' },
      { value: 'medium', label: 'Medium', color: '#f59e0b', pointsRange: '101-500' },
      { value: 'hard', label: 'Hard', color: '#ef4444', pointsRange: '501-1000' },
      { value: 'expert', label: 'Expert', color: '#8b5cf6', pointsRange: '1000+' },
    ];

    res.status(200).json({
      success: true,
      data: difficulties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest types
// @route   GET /api/v1/data/quest-types
// @access  Private (API Key required)
const getQuestTypes = async (req, res, next) => {
  try {
    const questTypes = [
      { value: 'daily', label: 'Daily', description: 'Complete once per day' },
      { value: 'weekly', label: 'Weekly', description: 'Complete once per week' },
      { value: 'monthly', label: 'Monthly', description: 'Complete once per month' },
      { value: 'one-time', label: 'One-time', description: 'Complete once' },
      { value: 'habit', label: 'Habit', description: 'Ongoing habit tracking' },
    ];

    res.status(200).json({
      success: true,
      data: questTypes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search quests
// @route   GET /api/v1/search/quests
// @access  Private (API Key required)
const searchQuests = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { q, category, difficulty, limit = 20 } = req.query;

    let filter = { isPublic: true, isActive: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const quests = await Quest.find(filter)
      .populate('creator', 'username profile.firstName profile.lastName')
      .sort({ 'stats.averageRating': -1, 'stats.totalParticipants': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: quests,
      query: { q, category, difficulty },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/v1/search/users
// @access  Private (API Key required)
const searchUsers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const users = await User.find({
      isActive: true,
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.firstName': { $regex: q, $options: 'i' } },
        { 'profile.lastName': { $regex: q, $options: 'i' } },
      ],
    })
    .select('username profile stats')
    .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: users,
      query: q,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest recommendations
// @route   GET /api/v1/recommendations/quests
// @access  Private (API Key required)
const getQuestRecommendations = async (req, res, next) => {
  try {
    const { userId, limit = 10 } = req.query;

    let filter = { isPublic: true, isActive: true };
    let sort = { 'stats.averageRating': -1, 'stats.totalParticipants': -1 };

    // If userId provided, personalize recommendations
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Get user's completed quests to find preferred categories
        const userQuests = await Quest.find({
          'participants.user': userId,
          'participants.status': 'completed',
        }).select('category');

        const preferredCategories = [...new Set(userQuests.map(q => q.category))];
        
        if (preferredCategories.length > 0) {
          filter.category = { $in: preferredCategories };
        }

        // Exclude quests user is already participating in
        filter['participants.user'] = { $ne: userId };
      }
    }

    const quests = await Quest.find(filter)
      .populate('creator', 'username profile.firstName profile.lastName')
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: quests,
      personalized: !!userId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user leaderboard
// @route   GET /api/v1/leaderboard/users
// @access  Private (API Key required)
const getUserLeaderboard = async (req, res, next) => {
  try {
    const { timeframe = 'all-time', limit = 50 } = req.query;

    let matchCondition = { isActive: true };

    if (timeframe !== 'all-time') {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'monthly':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }

      if (startDate) {
        matchCondition.lastLogin = { $gte: startDate };
      }
    }

    const users = await User.find(matchCondition)
      .select('username profile stats')
      .sort({ 'stats.totalPoints': -1, 'stats.level': -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      user: {
        id: user._id,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
      },
    }));

    res.status(200).json({
      success: true,
      data: leaderboard,
      timeframe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest leaderboard
// @route   GET /api/v1/leaderboard/quests
// @access  Private (API Key required)
const getQuestLeaderboard = async (req, res, next) => {
  try {
    const { sortBy = 'popular', limit = 20 } = req.query;

    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { 'stats.totalParticipants': -1 };
        break;
      case 'rating':
        sort = { 'stats.averageRating': -1, 'stats.totalRatings': -1 };
        break;
      case 'recent':
        sort = { createdAt: -1 };
        break;
      case 'completion-rate':
        sort = { completionRate: -1 };
        break;
      default:
        sort = { 'stats.totalParticipants': -1 };
    }

    const quests = await Quest.find({ isPublic: true, isActive: true })
      .populate('creator', 'username profile.firstName profile.lastName')
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: quests,
      sortBy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user growth analytics
// @route   GET /api/v1/analytics/user-growth
// @access  Private (API Key required)
const getUserGrowthAnalytics = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;

    let days;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: userGrowth,
      period,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest completion analytics
// @route   GET /api/v1/analytics/quest-completion
// @access  Private (API Key required)
const getQuestCompletionAnalytics = async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;

    let days;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completionData = await Quest.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $match: {
          'participants.status': 'completed',
          'participants.completedAt': { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$participants.completedAt' },
            month: { $month: '$participants.completedAt' },
            day: { $dayOfMonth: '$participants.completedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: completionData,
      period,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category popularity analytics
// @route   GET /api/v1/analytics/category-popularity
// @access  Private (API Key required)
const getCategoryPopularityAnalytics = async (req, res, next) => {
  try {
    const categoryData = await Quest.aggregate([
      {
        $match: { isPublic: true, isActive: true },
      },
      {
        $group: {
          _id: '$category',
          questCount: { $sum: 1 },
          totalParticipants: { $sum: '$stats.totalParticipants' },
          totalCompletions: { $sum: '$stats.completedCount' },
          averageRating: { $avg: '$stats.averageRating' },
        },
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: ['$totalParticipants', 0] },
              { $divide: ['$totalCompletions', '$totalParticipants'] },
              0,
            ],
          },
        },
      },
      {
        $sort: { totalParticipants: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bulk quests
// @route   GET /api/v1/bulk/quests
// @access  Private (API Key required)
const getBulkQuests = async (req, res, next) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Quest IDs are required',
      });
    }

    const questIds = ids.split(',').filter(id => id.trim());

    if (questIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quest IDs are required',
      });
    }

    const quests = await Quest.find({
      _id: { $in: questIds },
      isPublic: true,
      isActive: true,
    }).populate('creator', 'username profile.firstName profile.lastName');

    res.status(200).json({
      success: true,
      data: quests,
      requested: questIds.length,
      found: quests.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bulk users
// @route   GET /api/v1/bulk/users
// @access  Private (API Key required)
const getBulkUsers = async (req, res, next) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'User IDs are required',
      });
    }

    const userIds = ids.split(',').filter(id => id.trim());

    if (userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid user IDs are required',
      });
    }

    const users = await User.find({
      _id: { $in: userIds },
      isActive: true,
    }).select('username profile stats createdAt');

    res.status(200).json({
      success: true,
      data: users,
      requested: userIds.length,
      found: users.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get app configuration
// @route   GET /api/v1/config/app
// @access  Private (API Key required)
const getAppConfig = async (req, res, next) => {
  try {
    const config = {
      app: {
        name: 'Questify',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
      },
      features: {
        registration: true,
        emailVerification: true,
        passwordReset: true,
        questCreation: true,
        questRating: true,
        leaderboards: true,
        achievements: false, // TODO: Implement achievements
      },
      limits: {
        maxQuestTitleLength: 100,
        maxQuestDescriptionLength: 1000,
        maxQuestPoints: 10000,
        maxQuestRequirements: 10,
        maxQuestTags: 10,
        maxUsernameLength: 30,
        maxBioLength: 500,
      },
      defaults: {
        questsPerPage: 20,
        usersPerPage: 20,
        leaderboardLimit: 50,
      },
    };

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feature flags
// @route   GET /api/v1/config/features
// @access  Private (API Key required)
const getFeatureFlags = async (req, res, next) => {
  try {
    const features = {
      questCreation: true,
      questRating: true,
      questReporting: true,
      userProfiles: true,
      leaderboards: true,
      achievements: false,
      notifications: false,
      fileUploads: false,
      socialFeatures: true,
      adminPanel: true,
      analytics: true,
      apiAccess: true,
    };

    res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApiInfo,
  getHealthCheck,
  getOverviewStats,
  getUserStats,
  getQuestStats,
  getCategories,
  getDifficulties,
  getQuestTypes,
  searchQuests,
  searchUsers,
  getQuestRecommendations,
  getUserLeaderboard,
  getQuestLeaderboard,
  getUserGrowthAnalytics,
  getQuestCompletionAnalytics,
  getCategoryPopularityAnalytics,
  getBulkQuests,
  getBulkUsers,
  getAppConfig,
  getFeatureFlags,
};
