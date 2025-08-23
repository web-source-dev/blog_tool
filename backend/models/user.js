const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6 
  },
  
  // Profile Information
  username: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true 
  },
  bio: { 
    type: String, 
    maxlength: 500 
  },
  avatar: { 
    type: String 
  },
  coverImage: { 
    type: String 
  },
  
  // Social Links
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    github: String,
    instagram: String
  },
  
  // Role and Permissions
  role: { 
    type: String, 
    enum: ['reader', 'writer', 'admin'], 
    default: 'reader' 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Authentication
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // OAuth Information
  oauthProvider: { 
    type: String, 
    enum: ['local', 'google', 'github'] 
  },
  oauthId: String,
  
  // Preferences
  preferences: {
    emailNotifications: { 
      type: Boolean, 
      default: true 
    },
    pushNotifications: { 
      type: Boolean, 
      default: true 
    },
    newsletter: { 
      type: Boolean, 
      default: false 
    },
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'auto'], 
      default: 'auto' 
    }
  },
  
  // Statistics
  stats: {
    totalArticles: { 
      type: Number, 
      default: 0 
    },
    totalViews: { 
      type: Number, 
      default: 0 
    },
    totalLikes: { 
      type: Number, 
      default: 0 
    },
    followers: { 
      type: Number, 
      default: 0 
    },
    following: { 
      type: Number, 
      default: 0 
    }
  },
  
  // Reading History
  readingHistory: [{
    blog: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Blog' 
    },
    readAt: { 
      type: Date, 
      default: Date.now 
    },
    progress: { 
      type: Number, 
      min: 0, 
      max: 100, 
      default: 0 
    }
  }],
  
  // Bookmarks
  bookmarks: [{
    blog: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Blog' 
    },
    bookmarkedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  
  // Followers/Following
  followers: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    followedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  
  following: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    followedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.username || this.fullName;
});

// Index for search
userSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  username: 'text', 
  bio: 'text' 
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate username if not provided
userSchema.pre('save', function(next) {
  if (!this.username && this.firstName && this.lastName) {
    const baseUsername = `${this.firstName.toLowerCase()}${this.lastName.toLowerCase()}`;
    this.username = baseUsername;
  }
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    bio: this.bio,
    avatar: this.avatar,
    socialLinks: this.socialLinks,
    role: this.role,
    isVerified: this.isVerified,
    stats: this.stats,
    createdAt: this.createdAt
  };
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

// Instance method to follow a user
userSchema.methods.followUser = function(userIdToFollow) {
  if (this._id.equals(userIdToFollow)) {
    return Promise.reject(new Error('Cannot follow yourself'));
  }
  
  if (!this.following.some(follow => follow.user.equals(userIdToFollow))) {
    this.following.push({ user: userIdToFollow });
    this.stats.following += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to unfollow a user
userSchema.methods.unfollowUser = function(userIdToUnfollow) {
  this.following = this.following.filter(follow => !follow.user.equals(userIdToUnfollow));
  this.stats.following = Math.max(0, this.stats.following - 1);
  return this.save();
};

// Instance method to add follower
userSchema.methods.addFollower = function(userId) {
  if (!this.followers.some(follower => follower.user.equals(userId))) {
    this.followers.push({ user: userId });
    this.stats.followers += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove follower
userSchema.methods.removeFollower = function(userId) {
  this.followers = this.followers.filter(follower => !follower.user.equals(userId));
  this.stats.followers = Math.max(0, this.stats.followers - 1);
  return this.save();
};

// Instance method to add bookmark
userSchema.methods.addBookmark = function(blogId) {
  if (!this.bookmarks.some(bookmark => bookmark.blog.equals(blogId))) {
    this.bookmarks.push({ blog: blogId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove bookmark
userSchema.methods.removeBookmark = function(blogId) {
  this.bookmarks = this.bookmarks.filter(bookmark => !bookmark.blog.equals(blogId));
  return this.save();
};

// Instance method to add reading history
userSchema.methods.addReadingHistory = function(blogId, progress = 0) {
  const existingIndex = this.readingHistory.findIndex(history => history.blog.equals(blogId));
  
  if (existingIndex >= 0) {
    this.readingHistory[existingIndex].readAt = new Date();
    this.readingHistory[existingIndex].progress = progress;
  } else {
    this.readingHistory.push({ blog: blogId, progress });
  }
  
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
