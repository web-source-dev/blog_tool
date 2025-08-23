const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { Blog } = require('../models/blog');
const { User } = require('../models/user');
const Comment = require('../models/comment');
const Notification = require('../models/notification');

// ===== COMMENTS =====

// Get comments for a blog
router.get('/comments/:blogId', optionalAuth, async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    
    const skip = (page - 1) * limit;
    let sortOption = {};
    
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'likes':
        sortOption = { 'likes.length': -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const comments = await Comment.find({ 
      blog: blogId, 
      parentComment: null,
      isDeleted: false 
    })
    .populate('author', 'firstName lastName username avatar')
    .populate({
      path: 'replies',
      match: { isDeleted: false },
      populate: {
        path: 'author',
        select: 'firstName lastName username avatar'
      },
      options: { sort: { createdAt: 1 } }
    })
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Comment.countDocuments({ 
      blog: blogId, 
      parentComment: null,
      isDeleted: false 
    });
    
    // Mark if user liked each comment
    if (req.user) {
      comments.forEach(comment => {
        comment.isLiked = comment.likes.includes(req.user._id);
        if (comment.replies) {
          comment.replies.forEach(reply => {
            reply.isLiked = reply.likes.includes(req.user._id);
          });
        }
      });
    }
    
    res.json({
      comments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + comments.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment
router.post('/comments', authenticateToken, async (req, res) => {
  try {
    const { blogId, content, parentCommentId } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    const commentData = {
      blog: blogId,
      author: req.user._id,
      content: content.trim()
    };
    
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
      commentData.parentComment = parentCommentId;
    }
    
    const comment = new Comment(commentData);
    await comment.save();
    
    // Add comment to blog
    await blog.addComment(comment._id);
    
    // Populate author info
    await comment.populate('author', 'firstName lastName username avatar');
    
    // Create notification for blog author
    if (blog.writer.toString() !== req.user._id.toString()) {
      await Notification.createNotification({
        recipient: blog.writer,
        sender: req.user._id,
        type: 'comment_blog',
        title: 'New Comment',
        message: `${req.user.firstName} commented on your blog "${blog.title}"`,
        data: {
          blog: blog._id,
          comment: comment._id,
          url: `/blog/${blog.slug}#comment-${comment._id}`
        }
      });
    }
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a comment
router.put('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    // Store edit history
    comment.editHistory.push({
      content: comment.content,
      editedAt: new Date()
    });
    
    comment.content = content.trim();
    comment.isEdited = true;
    await comment.save();
    
    await comment.populate('author', 'firstName lastName username avatar');
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    await comment.softDelete();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike a comment
router.post('/comments/:commentId/like', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    const isLiked = comment.likes.includes(req.user._id);
    
    if (isLiked) {
      await comment.removeLike(req.user._id);
    } else {
      await comment.addLike(req.user._id);
      
      // Create notification for comment author
      if (comment.author.toString() !== req.user._id.toString()) {
        await Notification.createNotification({
          recipient: comment.author,
          sender: req.user._id,
          type: 'like_comment',
          title: 'Comment Liked',
          message: `${req.user.firstName} liked your comment`,
          data: {
            comment: comment._id,
            url: `/blog/${comment.blog}#comment-${comment._id}`
          }
        });
      }
    }
    
    res.json({ 
      isLiked: !isLiked,
      likeCount: comment.likes.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== BLOG LIKES =====

// Like/Unlike a blog
router.post('/blogs/:blogId/like', authenticateToken, async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    const isLiked = blog.likes.includes(req.user._id);
    
    if (isLiked) {
      await blog.removeLike(req.user._id);
    } else {
      await blog.addLike(req.user._id);
      
      // Create notification for blog author
      if (blog.writer.toString() !== req.user._id.toString()) {
        await Notification.createNotification({
          recipient: blog.writer,
          sender: req.user._id,
          type: 'like_blog',
          title: 'Blog Liked',
          message: `${req.user.firstName} liked your blog "${blog.title}"`,
          data: {
            blog: blog._id,
            url: `/blog/${blog.slug}`
          }
        });
      }
    }
    
    res.json({ 
      isLiked: !isLiked,
      likeCount: blog.likes.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== BOOKMARKS =====

// Bookmark/Unbookmark a blog
router.post('/blogs/:blogId/bookmark', authenticateToken, async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    const user = await User.findById(req.user._id);
    const isBookmarked = user.bookmarks.some(bookmark => bookmark.blog.equals(blogId));
    
    if (isBookmarked) {
      await user.removeBookmark(blogId);
      await blog.removeBookmark(req.user._id);
    } else {
      await user.addBookmark(blogId);
      await blog.addBookmark(req.user._id);
    }
    
    res.json({ 
      isBookmarked: !isBookmarked,
      bookmarkCount: blog.bookmarks.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookmarks
router.get('/bookmarks', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks.blog',
        populate: {
          path: 'writer',
          select: 'firstName lastName username'
        }
      })
      .sort({ 'bookmarks.bookmarkedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = user.bookmarks.length;
    
    res.json({
      bookmarks: user.bookmarks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + user.bookmarks.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== FOLLOWS =====

// Follow/Unfollow a user
router.post('/users/:userId/follow', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.some(follow => follow.user.equals(userId));
    
    if (isFollowing) {
      await currentUser.unfollowUser(userId);
      await userToFollow.removeFollower(req.user._id);
    } else {
      await currentUser.followUser(userId);
      await userToFollow.addFollower(req.user._id);
      
      // Create notification
      await Notification.createNotification({
        recipient: userId,
        sender: req.user._id,
        type: 'new_follower',
        title: 'New Follower',
        message: `${req.user.firstName} started following you`,
        data: {
          url: `/profile/${req.user.username}`
        }
      });
    }
    
    res.json({ 
      isFollowing: !isFollowing,
      followersCount: userToFollow.stats.followers 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's followers
router.get('/users/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(userId)
      .populate({
        path: 'followers.user',
        select: 'firstName lastName username avatar bio'
      })
      .sort({ 'followers.followedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const total = user.stats.followers;
    
    res.json({
      followers: user.followers,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + user.followers.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's following
router.get('/users/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(userId)
      .populate({
        path: 'following.user',
        select: 'firstName lastName username avatar bio'
      })
      .sort({ 'following.followedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const total = user.stats.following;
    
    res.json({
      following: user.following,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + user.following.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== NOTIFICATIONS =====

// Get user's notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { recipient: req.user._id, isDeleted: false };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', 'firstName lastName username avatar')
      .populate('data.blog', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    
    res.json({
      notifications,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + notifications.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notifications as read
router.put('/notifications/read', authenticateToken, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    if (notificationIds && notificationIds.length > 0) {
      await Notification.markAsRead(req.user._id, notificationIds);
    } else {
      await Notification.markAsRead(req.user._id);
    }
    
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread notification count
router.get('/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
