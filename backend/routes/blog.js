const express = require('express');
const router = express.Router();
const { Blog, Comment } = require('../models/blog');
const { 
  blogImageUpload, 
  contentImageUpload, 
  socialImageUpload, 
  deleteImageFromCloudinary 
} = require('../config/cloudinary');

// Upload image for blog content (inline images)
router.post('/upload/images', contentImageUpload.single('image'), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Cloudinary returns the URL directly
    const imageUrl = req.file.path;
    
    res.status(201).json({
      url: imageUrl,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload social media image for blog
router.post('/upload/social-image', socialImageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Cloudinary returns the URL directly
    const imageUrl = req.file.path;

    res.status(201).json({
      url: imageUrl,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create blog (admin only)
router.post('/', blogImageUpload.single('image'), async (req, res) => {
  try {
    // Basic blog details
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      writer: req.body.writer,
      image: req.file ? req.file.path : null,
      imageAlt: req.body.imageAlt || '',
      url: req.body.url || '',
      
      // Status & Visibility
      isActive: req.body.isActive === 'true',
      isFeatured: req.body.isFeatured === 'true',
      status: req.body.status || 'draft',
      scheduledFor: req.body.scheduledFor ? new Date(req.body.scheduledFor) : null,
      
      // Categorization
      category: req.body.category || 'Uncategorized',
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      slug: req.body.slug,
      
      // SEO Metadata
      seoTitle: req.body.seoTitle || req.body.title,
      seoDescription: req.body.seoDescription || req.body.description,
      seoKeywords: req.body.seoKeywords ? JSON.parse(req.body.seoKeywords) : [],
      canonicalUrl: req.body.canonicalUrl,
      noIndex: req.body.noIndex === 'true',
      
      // Social Media Meta
      ogTitle: req.body.ogTitle || req.body.title,
      ogDescription: req.body.ogDescription || req.body.description,
      ogImage: req.body.ogImage,
      twitterTitle: req.body.twitterTitle || req.body.title,
      twitterDescription: req.body.twitterDescription || req.body.description,
      twitterImage: req.body.twitterImage,
      
      // Additional Features
      estimatedReadTime: req.body.estimatedReadTime ? parseInt(req.body.estimatedReadTime) : null,
      wordCount: req.body.wordCount ? parseInt(req.body.wordCount) : null,
      language: req.body.language || "en",
      
      // Initialize revisions with creation record
      revisions: [{
        updatedAt: new Date(),
        updatedBy: req.body.writer,
        changes: 'Initial creation'
      }]
    });
    console.log(blog);
    await blog.save();
    


    res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const query = { isActive: true };
    const { category, tag, featured } = req.query;
    
    // Apply filters if provided
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const blogs = await Blog.find(query)
      .populate('writer', 'name email image bio')
      .populate('comments')
      .sort({ createdAt: -1 });

    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all blogs (admin)
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('writer', 'name email image bio')
      .populate('comments')
      .sort({ createdAt: -1 });

    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured blogs
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const blogs = await Blog.find({ 
      isActive: true, 
      isFeatured: true,
      status: 'published'
    })
      .populate('writer', 'name email image bio')
      .populate('comments')
      .sort({ publishedAt: -1 })
      .limit(limit);
      
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trending blogs
router.get('/trending', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      status: 'published',
      isActive: true 
    })
      .populate('writer', 'name email image bio')
      .sort({ views: -1, likes: -1 })
      .limit(6);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent blogs
router.get('/recent', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      status: 'published',
      isActive: true 
    })
      .populate('writer', 'name email image bio')
      .sort({ publishedAt: -1 })
      .limit(6);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blog by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isActive: true 
    }).populate('writer', 'name email image bio socialLinks');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    // Add social interaction data if user is authenticated
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { User } = require('../models/user');
        const user = await User.findById(decoded.userId);
        
        if (user) {
          // Add user interaction status
          blog.isLiked = blog.likes.includes(user._id);
          blog.isBookmarked = user.bookmarks.some(bookmark => bookmark.blog.equals(blog._id));
          blog.isFollowing = user.following.some(follow => follow.user.equals(blog.writer._id));
          
          // Add reading progress
          const readingHistory = user.readingHistory.find(history => history.blog.equals(blog._id));
          blog.readingProgress = readingHistory ? readingHistory.progress : 0;
          
          // Update reading history
          await user.addReadingHistory(blog._id, 0);
        }
      } catch (error) {
        // Token invalid or expired, continue without user data
        console.log('Token validation failed:', error.message);
      }
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get related blogs
router.get('/related/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      status: 'published',
      isActive: true
    })
      .populate('writer', 'name email image bio')
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json(relatedBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blogs by user
router.get('/user/:userId', async (req, res) => {
  try {
    const blogs = await Blog.find({
      writer: req.params.userId,
      status: 'published',
      isActive: true
    })
      .populate('writer', 'name email image bio')
      .sort({ publishedAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search blogs
router.get('/search', async (req, res) => {
  try {
    const { q, category, sort, date, readTime, page = 1, limit = 12 } = req.query;
    
    let query = { status: 'published', isActive: true };
    
    // Search query
    if (q) {
      query.$text = { $search: q };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Date filter
    if (date) {
      const now = new Date();
      let dateFilter;
      
      switch (date) {
        case 'day':
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = null;
      }
      
      if (dateFilter) {
        query.publishedAt = { $gte: dateFilter };
      }
    }
    
    // Read time filter
    if (readTime) {
      switch (readTime) {
        case 'short':
          query.estimatedReadTime = { $lt: 5 };
          break;
        case 'medium':
          query.estimatedReadTime = { $gte: 5, $lte: 15 };
          break;
        case 'long':
          query.estimatedReadTime = { $gt: 15 };
          break;
      }
    }
    
    // Sort options
    let sortOption = { publishedAt: -1 };
    if (sort) {
      switch (sort) {
        case 'date':
          sortOption = { publishedAt: -1 };
          break;
        case 'views':
          sortOption = { views: -1 };
          break;
        case 'likes':
          sortOption = { likes: -1 };
          break;
        case 'readTime':
          sortOption = { estimatedReadTime: 1 };
          break;
        case 'relevance':
          if (q) {
            sortOption = { score: { $meta: 'textScore' } };
          }
          break;
      }
    }
    
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find(query)
      .populate('writer', 'name email image bio')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
      { $project: { _id: 0, name: '$_id', count: 1 } }
    ]);
    
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blog by slug or id
router.get('/admin/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('writer', 'name email image bio')
      .populate('revisions.updatedBy', 'firstName lastName name avatar')
      .populate('comments');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or inactive' });
    }

    res.json(blog);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
});

// Get blog by slug or id
router.get('/:slugOrId', async (req, res) => {
  try {
    const slugOrId = req.params.slugOrId;
    
    // First try to find by slug
    let blog = await Blog.findOne({
      slug : slugOrId,
      isActive: true
    });
    
    // If not found by slug, try by ID
    if (!blog) {
      blog = await Blog.findOneAndUpdate(
        { slug: slugOrId, isActive: true },
        { $inc: { views: 1 } },
        { new: true }
      );
    } else {
      // Update views
      blog.views += 1;
      await blog.save();
    }
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or inactive' });
    }
    
    // Populate writer and comments
    await blog.populate('writer', 'name email image bio');
    await blog.populate('comments');

    res.json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get related blogs
router.get('/:id/related', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const limit = parseInt(req.query.limit) || 3;
    
    // Find blogs with same category or tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      isActive: true,
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags } }
      ]
    })
    .populate('writer', 'name email image bio')
    .populate('comments')
    .sort({ createdAt: -1 })
    .limit(limit);
    
    res.json(relatedBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle blog status
router.put('/:id/toggleStatus', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle featured status
router.put('/:id/toggleFeatured', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      { isFeatured: req.body.isFeatured }, 
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update blog (admin only)
router.patch('/:id', blogImageUpload.single('image'), async (req, res) => {
  try {
    // Get the existing blog
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Create an updates object
    const updates = {};
    
    // Handle basic fields
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.tags !== undefined) updates.tags = JSON.parse(req.body.tags);
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
    if (req.body.isFeatured !== undefined) updates.isFeatured = req.body.isFeatured;
    if (req.body.imageAlt !== undefined) updates.imageAlt = req.body.imageAlt;
    if (req.body.url !== undefined) updates.url = req.body.url;
    if (req.body.slug !== undefined && req.body.slug.trim() !== '') {
      updates.slug = req.body.slug.trim();
    }
    
    // Handle date objects
    if (req.body.scheduledFor) {
      updates.scheduledFor = new Date(req.body.scheduledFor);
    } else if (req.body.scheduledFor === '') {
      // If empty string is provided, remove the scheduled date
      updates.scheduledFor = null;
    }
    
    // Handle SEO fields
    if (req.body.seoTitle !== undefined) updates.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription !== undefined) updates.seoDescription = req.body.seoDescription;
    if (req.body.canonicalUrl !== undefined) updates.canonicalUrl = req.body.canonicalUrl;
    if (req.body.noIndex !== undefined) updates.noIndex = req.body.noIndex === 'true';
    if (req.body.seoKeywords !== undefined) updates.seoKeywords = JSON.parse(req.body.seoKeywords);
    
    // Handle Social Media fields
    if (req.body.ogTitle !== undefined) updates.ogTitle = req.body.ogTitle;
    if (req.body.ogDescription !== undefined) updates.ogDescription = req.body.ogDescription;
    if (req.body.ogImage !== undefined) updates.ogImage = req.body.ogImage;
    if (req.body.twitterTitle !== undefined) updates.twitterTitle = req.body.twitterTitle;
    if (req.body.twitterDescription !== undefined) updates.twitterDescription = req.body.twitterDescription;
    if (req.body.twitterImage !== undefined) updates.twitterImage = req.body.twitterImage;
    
    // Handle Additional Features
    if (req.body.estimatedReadTime !== undefined) updates.estimatedReadTime = parseInt(req.body.estimatedReadTime);
    if (req.body.wordCount !== undefined) updates.wordCount = parseInt(req.body.wordCount);
    if (req.body.language !== undefined) updates.language = req.body.language;
    
    // Handle main image upload
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingBlog.image && existingBlog.image.includes('cloudinary.com')) {
        try {
          await deleteImageFromCloudinary(existingBlog.image);
        } catch (deleteError) {
          console.error('Error deleting old image from Cloudinary:', deleteError);
          // Continue with update even if old image deletion fails
        }
      }
      updates.image = req.file.path;
    }
    
    // Add a revision record
    const revision = {
      updatedAt: new Date(),
      updatedBy: req.body.writer,
      changes: 'Updated blog content and settings'
    };
    
    // Use $push to add a new revision
    updates.$push = { revisions: revision };
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    );
    
    
    
    res.json(blog);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Delete blog (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Delete image from Cloudinary if it exists
    if (blog.image && blog.image.includes('cloudinary.com')) {
      try {
        await deleteImageFromCloudinary(blog.image);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Continue with deletion even if image deletion fails
      }
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, isActive: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or inactive' });
    }
    
    const comment = new Comment({
      blog: blog._id,
      content: req.body.content
    });
    
    await comment.save();

    blog.comments.push(comment._id);
    await blog.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like blog
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

 
      blog.likes += 1;
    
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.log('Error in like route:', error);
    res.status(500).json({ message: error.message });
  }
});



// Add share functionality
router.post('/:id/share', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.shares += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;
