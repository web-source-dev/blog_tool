const mongoose = require('mongoose')


const BlogSchema = new mongoose.Schema({
  // Basic Info
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: "Writer", required: true },
  image: { type: String },
  imageAlt: { type: String },
  url: { type: String },

  // Status & Visibility
  isActive: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  scheduledFor: { type: Date }, // Future publishing date
  publishedAt: { type: Date }, // Actual publication date
  status: { type: String, enum: ['draft', 'published', 'archived','scheduled'], default: 'draft' },

  // Categorization
  category: { type: String, default: 'Uncategorized' },
  tags: [{ type: String }],

  // Slug
  slug: { type: String, unique: true, sparse: true },

  // Engagement
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  shares: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

  // SEO Metadata
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: [{ type: String }],
  canonicalUrl: { type: String },
  noIndex: { type: Boolean, default: false }, // Useful for drafts or private blogs

  // Social Media Meta
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogImage: { type: String },
  twitterTitle: { type: String },
  twitterDescription: { type: String },
  twitterImage: { type: String },

  // Additional Features
  estimatedReadTime: { type: Number }, // In minutes
  wordCount: { type: Number },
  language: { type: String, default: "en" }, // For localization

  // Revision History
  revisions: [{
    updatedAt: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changes: { type: String }, // Could store a diff or summary
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate slug from title if not provided
BlogSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual for like count
BlogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for bookmark count
BlogSchema.virtual('bookmarkCount').get(function() {
  return this.bookmarks.length;
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Instance method to add like
BlogSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove like
BlogSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

// Instance method to add bookmark
BlogSchema.methods.addBookmark = function(userId) {
  if (!this.bookmarks.includes(userId)) {
    this.bookmarks.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove bookmark
BlogSchema.methods.removeBookmark = function(userId) {
  this.bookmarks = this.bookmarks.filter(id => !id.equals(userId));
  return this.save();
};

// Instance method to add comment
BlogSchema.methods.addComment = function(commentId) {
  if (!this.comments.includes(commentId)) {
    this.comments.push(commentId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove comment
BlogSchema.methods.removeComment = function(commentId) {
  this.comments = this.comments.filter(id => !id.equals(commentId));
  return this.save();
};

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = { Blog };