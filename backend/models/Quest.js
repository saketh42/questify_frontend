const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quest title is required'],
    trim: true,
    maxlength: [100, 'Quest title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Quest description is required'],
    trim: true,
    maxlength: [1000, 'Quest description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Quest category is required'],
    enum: [
      'fitness',
      'learning',
      'creativity',
      'productivity',
      'social',
      'health',
      'career',
      'hobby',
      'travel',
      'other'
    ],
  },
  difficulty: {
    type: String,
    required: [true, 'Quest difficulty is required'],
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  type: {
    type: String,
    required: [true, 'Quest type is required'],
    enum: ['daily', 'weekly', 'monthly', 'one-time', 'habit'],
    default: 'one-time',
  },
  points: {
    type: Number,
    required: [true, 'Quest points are required'],
    min: [1, 'Quest must have at least 1 point'],
    max: [10000, 'Quest cannot exceed 10000 points'],
  },
  duration: {
    estimated: {
      type: Number, // in minutes
      min: [1, 'Duration must be at least 1 minute'],
    },
    deadline: {
      type: Date,
    },
  },
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement cannot exceed 200 characters'],
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed', 'abandoned'],
      default: 'pending',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    notes: String,
  }],
  stats: {
    totalParticipants: {
      type: Number,
      default: 0,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  rewards: {
    badge: {
      name: String,
      icon: String,
      color: String,
    },
    bonus: {
      type: Number,
      default: 0,
    },
  },
  metadata: {
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
questSchema.index({ category: 1, difficulty: 1 });
questSchema.index({ creator: 1 });
questSchema.index({ tags: 1 });
questSchema.index({ 'stats.averageRating': -1 });
questSchema.index({ createdAt: -1 });
questSchema.index({ 'metadata.featured': -1 });
questSchema.index({ 'metadata.trending': -1 });

// Virtual for completion rate
questSchema.virtual('completionRate').get(function() {
  if (this.stats.totalParticipants === 0) return 0;
  return Math.round((this.stats.completedCount / this.stats.totalParticipants) * 100);
});

// Method to add participant
questSchema.methods.addParticipant = function(userId) {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (existingParticipant) {
    throw new Error('User is already participating in this quest');
  }
  
  this.participants.push({
    user: userId,
    status: 'pending',
    startedAt: new Date(),
  });
  
  this.stats.totalParticipants += 1;
  return this.save();
};

// Method to update participant progress
questSchema.methods.updateParticipantProgress = function(userId, progress, status, notes) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!participant) {
    throw new Error('User is not participating in this quest');
  }
  
  participant.progress = progress;
  if (status) participant.status = status;
  if (notes) participant.notes = notes;
  
  if (status === 'completed' && !participant.completedAt) {
    participant.completedAt = new Date();
    this.stats.completedCount += 1;
  }
  
  return this.save();
};

// Method to calculate average rating
questSchema.methods.updateRating = function(rating) {
  const totalScore = this.stats.averageRating * this.stats.totalRatings + rating;
  this.stats.totalRatings += 1;
  this.stats.averageRating = totalScore / this.stats.totalRatings;
  return this.save();
};

module.exports = mongoose.model('Quest', questSchema);
