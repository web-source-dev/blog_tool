const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ author: 1, createdAt: -1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Ensure virtuals are serialized
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

// Pre-save middleware to handle mentions
commentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Extract mentions from content (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(this.content)) !== null) {
      // This will be populated when saving
      mentions.push(match[1]);
    }
    
    this.mentions = mentions;
  }
  next();
});

// Instance method to add like
commentSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove like
commentSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

// Instance method to add reply
commentSchema.methods.addReply = function(replyId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to soft delete
commentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.content = '[This comment has been deleted]';
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);
