const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'like_blog',
      'like_comment', 
      'comment_blog',
      'reply_comment',
      'follow_user',
      'mention_comment',
      'new_follower',
      'blog_published',
      'comment_approved',
      'system_message'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    url: String,
    extra: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// Pre-save middleware to set readAt when marked as read
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Static method to create notification
notificationSchema.statics.createNotification = function(data) {
  return this.create(data);
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = function(recipientId, notificationIds = null) {
  const query = { recipient: recipientId, isRead: false };
  
  if (notificationIds) {
    query._id = { $in: notificationIds };
  }
  
  return this.updateMany(query, { 
    isRead: true, 
    readAt: new Date() 
  });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(recipientId) {
  return this.countDocuments({ 
    recipient: recipientId, 
    isRead: false, 
    isDeleted: false 
  });
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to soft delete
notificationSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
