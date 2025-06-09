const { validationResult } = require('express-validator');
const Quest = require('../models/Quest');
const User = require('../models/User');

// @desc    Get all quests
// @route   GET /api/quests
// @access  Public (with optional auth)
const getQuests = async (req, res, next) => {
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

    // Build filter object
    let filter = { isPublic: true, isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } },
      ];
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default: newest first

    if (req.query.sort) {
      switch (req.query.sort) {
        case 'popular':
          sort = { 'stats.totalParticipants': -1 };
          break;
        case 'rating':
          sort = { 'stats.averageRating': -1 };
          break;
        case 'points':
          sort = { points: -1 };
          break;
        case 'difficulty':
          sort = { difficulty: 1 };
          break;
      }
    }

    const quests = await Quest.find(filter)
      .populate('creator', 'username profile.firstName profile.lastName profile.avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Quest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: quests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + quests.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured quests
// @route   GET /api/quests/featured
// @access  Public
const getFeaturedQuests = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const quests = await Quest.find({
      isPublic: true,
      isActive: true,
      'metadata.featured': true,
    })
    .populate('creator', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ 'stats.averageRating': -1, 'stats.totalParticipants': -1 })
    .limit(limit);

    res.status(200).json({
      success: true,
      data: quests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending quests
// @route   GET /api/quests/trending
// @access  Public
const getTrendingQuests = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get quests created in the last 7 days with high participation
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const quests = await Quest.find({
      isPublic: true,
      isActive: true,
      createdAt: { $gte: weekAgo },
    })
    .populate('creator', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ 'stats.totalParticipants': -1, createdAt: -1 })
    .limit(limit);

    res.status(200).json({
      success: true,
      data: quests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest categories
// @route   GET /api/quests/categories
// @access  Public
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

    // Get quest counts for each category
    const categoryCounts = await Quest.aggregate([
      {
        $match: { isPublic: true, isActive: true },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryMap = categoryCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const categoriesWithCounts = categories.map(category => ({
      ...category,
      count: categoryMap[category.value] || 0,
    }));

    res.status(200).json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quest by ID
// @route   GET /api/quests/:id
// @access  Public (with optional auth)
const getQuestById = async (req, res, next) => {
  try {
    const quest = await Quest.findById(req.params.id)
      .populate('creator', 'username profile.firstName profile.lastName profile.avatar stats')
      .populate('participants.user', 'username profile.firstName profile.lastName profile.avatar');

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    // Check if quest is accessible
    if (!quest.isPublic && (!req.user || quest.creator._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Quest is private',
      });
    }

    // Add user participation status if authenticated
    let userParticipation = null;
    if (req.user) {
      const participation = quest.participants.find(
        p => p.user._id.toString() === req.user.id
      );
      if (participation) {
        userParticipation = {
          status: participation.status,
          progress: participation.progress,
          startedAt: participation.startedAt,
          completedAt: participation.completedAt,
          notes: participation.notes,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...quest.toObject(),
        userParticipation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quest
// @route   POST /api/quests
// @access  Private
const createQuest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const questData = {
      ...req.body,
      creator: req.user.id,
    };

    const quest = await Quest.create(questData);
    await quest.populate('creator', 'username profile.firstName profile.lastName profile.avatar');

    res.status(201).json({
      success: true,
      data: quest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quest
// @route   PUT /api/quests/:id
// @access  Private (Creator only)
const updateQuest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    // Check if user is the creator or admin
    if (quest.creator.toString() !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quest',
      });
    }

    // Don't allow updating certain fields if quest has participants
    if (quest.stats.totalParticipants > 0) {
      const restrictedFields = ['points', 'difficulty', 'type'];
      const hasRestrictedChanges = restrictedFields.some(field => 
        req.body[field] && req.body[field] !== quest[field]
      );

      if (hasRestrictedChanges) {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify points, difficulty, or type after users have joined',
        });
      }
    }

    const updatedQuest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creator', 'username profile.firstName profile.lastName profile.avatar');

    res.status(200).json({
      success: true,
      data: updatedQuest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quest
// @route   DELETE /api/quests/:id
// @access  Private (Creator only)
const deleteQuest = async (req, res, next) => {
  try {
    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    // Check if user is the creator or admin
    if (quest.creator.toString() !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quest',
      });
    }

    // Soft delete - deactivate instead of removing
    quest.isActive = false;
    await quest.save();

    res.status(200).json({
      success: true,
      message: 'Quest deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join quest
// @route   POST /api/quests/:id/join
// @access  Private
const joinQuest = async (req, res, next) => {
  try {
    const quest = await Quest.findById(req.params.id);

    if (!quest || !quest.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found or inactive',
      });
    }

    if (!quest.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Quest is private',
      });
    }

    // Check if user is already participating
    const existingParticipation = quest.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (existingParticipation) {
      return res.status(400).json({
        success: false,
        message: 'Already participating in this quest',
      });
    }

    // Add user to participants
    quest.participants.push({
      user: req.user.id,
      status: 'in-progress',
      startedAt: new Date(),
    });

    quest.stats.totalParticipants += 1;
    await quest.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined quest',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave quest
// @route   POST /api/quests/:id/leave
// @access  Private
const leaveQuest = async (req, res, next) => {
  try {
    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    const participantIndex = quest.participants.findIndex(
      p => p.user.toString() === req.user.id
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Not participating in this quest',
      });
    }

    // Update status to abandoned instead of removing
    quest.participants[participantIndex].status = 'abandoned';
    await quest.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left quest',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quest progress
// @route   PUT /api/quests/:id/progress
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    const participant = quest.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'Not participating in this quest',
      });
    }

    // Update progress
    if (req.body.progress !== undefined) {
      participant.progress = req.body.progress;
    }

    if (req.body.status) {
      participant.status = req.body.status;
      
      if (req.body.status === 'completed' && !participant.completedAt) {
        participant.completedAt = new Date();
        quest.stats.completedCount += 1;
        
        // Award experience points to user
        const user = await User.findById(req.user.id);
        const leveledUp = user.addExperience(quest.points);
        await user.save();

        if (leveledUp) {
          // TODO: Send level up notification
          console.log(`User ${user.username} leveled up to ${user.stats.level}!`);
        }
      }
    }

    if (req.body.notes) {
      participant.notes = req.body.notes;
    }

    await quest.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: participant.progress,
        status: participant.status,
        notes: participant.notes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate quest
// @route   POST /api/quests/:id/rate
// @access  Private
const rateQuest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    // Check if user has completed the quest
    const participant = quest.participants.find(
      p => p.user.toString() === req.user.id && p.status === 'completed'
    );

    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'You must complete the quest before rating it',
      });
    }

    // Update quest rating
    const totalScore = quest.stats.averageRating * quest.stats.totalRatings + req.body.rating;
    quest.stats.totalRatings += 1;
    quest.stats.averageRating = totalScore / quest.stats.totalRatings;

    await quest.save();

    res.status(200).json({
      success: true,
      message: 'Quest rated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report quest
// @route   POST /api/quests/:id/report
// @access  Private
const reportQuest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    quest.metadata.reportCount += 1;
    await quest.save();

    // TODO: Store report details in a separate collection
    console.log(`Quest ${quest._id} reported by user ${req.user.id}: ${req.body.reason}`);

    res.status(200).json({
      success: true,
      message: 'Quest reported successfully',
    });
  } catch (error) {
    next(error);
  }
};

// User's quest history methods
const getMyCreatedQuests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quests = await Quest.find({ creator: req.user.id })
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

const getMyJoinedQuests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quests = await Quest.find({
      'participants.user': req.user.id,
      'participants.status': { $in: ['pending', 'in-progress'] },
    })
    .populate('creator', 'username profile.firstName profile.lastName')
    .sort({ updatedAt: -1 })
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

const getMyCompletedQuests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quests = await Quest.find({
      'participants.user': req.user.id,
      'participants.status': 'completed',
    })
    .populate('creator', 'username profile.firstName profile.lastName')
    .sort({ 'participants.completedAt': -1 })
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

// Admin methods
const toggleFeatured = async (req, res, next) => {
  try {
    const quest = await Quest.findByIdAndUpdate(
      req.params.id,
      { 'metadata.featured': req.body.featured },
      { new: true }
    );

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    res.status(200).json({
      success: true,
      data: quest,
    });
  } catch (error) {
    next(error);
  }
};

const moderateQuest = async (req, res, next) => {
  try {
    const { action, reason } = req.body;
    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found',
      });
    }

    switch (action) {
      case 'approve':
        quest.isActive = true;
        break;
      case 'reject':
      case 'suspend':
        quest.isActive = false;
        break;
    }

    await quest.save();

    // TODO: Notify quest creator
    console.log(`Quest ${quest._id} ${action}ed by ${req.user.username}: ${reason}`);

    res.status(200).json({
      success: true,
      message: `Quest ${action}ed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingReports = async (req, res, next) => {
  try {
    const quests = await Quest.find({
      'metadata.reportCount': { $gt: 0 },
    })
    .populate('creator', 'username profile.firstName profile.lastName')
    .sort({ 'metadata.reportCount': -1 });

    res.status(200).json({
      success: true,
      data: quests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuests,
  getFeaturedQuests,
  getTrendingQuests,
  getCategories,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  joinQuest,
  leaveQuest,
  updateProgress,
  rateQuest,
  reportQuest,
  getMyCreatedQuests,
  getMyJoinedQuests,
  getMyCompletedQuests,
  toggleFeatured,
  moderateQuest,
  getPendingReports,
};
