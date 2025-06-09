const { validationResult } = require('express-validator');
const User = require('../models/User');
const Quest = require('../models/Quest');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const allowedFields = ['profile'];
    const fieldsToUpdate = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        fieldsToUpdate[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    // Soft delete - deactivate account instead of removing
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get additional stats from quests
    const questStats = await Quest.aggregate([
      {
        $match: {
          'participants.user': user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalJoined: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [
                { $in: ['completed', '$participants.status'] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = {
      ...user.stats.toObject(),
      questsJoined: questStats[0]?.totalJoined || 0,
      completionRate: questStats[0]?.totalJoined 
        ? Math.round((questStats[0].completed / questStats[0].totalJoined) * 100)
        : 0,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user achievements
// @route   GET /api/users/achievements
// @access  Private
const getUserAchievements = async (req, res, next) => {
  try {
    // TODO: Implement achievements system
    const achievements = [
      {
        id: 'first_quest',
        name: 'First Steps',
        description: 'Complete your first quest',
        icon: '🎯',
        earned: true,
        earnedAt: new Date(),
      },
      {
        id: 'level_5',
        name: 'Rising Star',
        description: 'Reach level 5',
        icon: '⭐',
        earned: req.user.stats.level >= 5,
        earnedAt: req.user.stats.level >= 5 ? new Date() : null,
      },
    ];

    res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activity
// @route   GET /api/users/activity
// @access  Private
const getUserActivity = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's quest activities
    const activities = await Quest.find({
      'participants.user': req.user.id,
    })
    .populate('creator', 'username profile.firstName profile.lastName')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('title category difficulty participants createdAt updatedAt');

    const formattedActivities = activities.map(quest => {
      const userParticipation = quest.participants.find(
        p => p.user.toString() === req.user.id.toString()
      );
      
      return {
        type: 'quest_activity',
        quest: {
          id: quest._id,
          title: quest.title,
          category: quest.category,
          difficulty: quest.difficulty,
          creator: quest.creator,
        },
        status: userParticipation?.status,
        progress: userParticipation?.progress,
        startedAt: userParticipation?.startedAt,
        completedAt: userParticipation?.completedAt,
        updatedAt: quest.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedActivities,
      pagination: {
        page,
        limit,
        hasMore: activities.length === limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
const getPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');
    
    res.status(200).json({
      success: true,
      data: user.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body },
      { new: true, runValidators: true }
    ).select('preferences');

    res.status(200).json({
      success: true,
      data: user.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (with optional auth for more details)
const getUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.params.id)
      .select('-email -passwordResetToken -emailVerificationToken');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If requesting own profile or admin, show more details
    const isOwnProfile = req.user && req.user.id === req.params.id;
    const isAdmin = req.user && ['admin', 'moderator'].includes(req.user.role);

    let userData = {
      id: user._id,
      username: user.username,
      profile: user.profile,
      stats: user.stats,
      createdAt: user.createdAt,
    };

    if (isOwnProfile || isAdmin) {
      userData.email = user.email;
      userData.role = user.role;
      userData.lastLogin = user.lastLogin;
      userData.isEmailVerified = user.isEmailVerified;
    }

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quests
// @route   GET /api/users/:id/quests
// @access  Public
const getUserQuests = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quests = await Quest.find({
      creator: req.params.id,
      isPublic: true,
      isActive: true,
    })
    .populate('creator', 'username profile.firstName profile.lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.status(200).json({
      success: true,
      data: quests,
      pagination: {
        page,
        limit,
        hasMore: quests.length === limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats by ID
// @route   GET /api/users/:id/stats
// @access  Public
const getUserStatsById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.params.id).select('stats');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const timeframe = req.query.timeframe || 'all-time';

    let matchCondition = { isActive: true };

    // Add time-based filtering if needed
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
      .select('username profile stats createdAt')
      .sort({ 'stats.totalPoints': -1, 'stats.level': -1 })
      .limit(limit);

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

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
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

    const { q } = req.query;
    const limit = parseInt(req.query.limit) || 20;

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
    .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      query: q,
    });
  } catch (error) {
    next(error);
  }
};

// Admin routes
// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Moderator)
const getAllUsers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role;

    let filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password -passwordResetToken -emailVerificationToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private (Admin/Moderator)
const updateUserStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  getUserStats,
  getUserAchievements,
  getUserActivity,
  getPreferences,
  updatePreferences,
  getUserById,
  getUserQuests,
  getUserStatsById,
  getLeaderboard,
  searchUsers,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
};
