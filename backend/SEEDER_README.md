# Database Seeder

This seeder script populates the database with sample data to test all the features of the blogging platform.

## What it creates:

### 👥 Users (5 sample users)
- **John Doe** (john.doe@example.com) - Tech enthusiast and software developer
- **Jane Smith** (jane.smith@example.com) - UX/UI designer
- **Mike Johnson** (mike.johnson@example.com) - Full-stack developer
- **Sarah Wilson** (sarah.wilson@example.com) - Content strategist
- **Alex Brown** (alex.brown@example.com) - Data scientist

**Password for all users:** `password123`

### 📝 Blogs (5 sample blogs)
1. **Getting Started with React: A Complete Beginner's Guide**
2. **The Future of Artificial Intelligence in 2024**
3. **Designing Beautiful User Interfaces: Principles and Best Practices**
4. **Building Scalable Web Applications with Node.js**
5. **The Complete Guide to Digital Marketing in 2024**

### 💬 Comments & Social Interactions
- 2-6 comments per blog
- Random likes on blogs and comments
- Random bookmarks
- User following relationships
- Sample notifications

## How to run:

### Prerequisites
1. Make sure MongoDB is running
2. Set up your `.env` file with `MONGODB_URI`
3. Install dependencies: `npm install`

### Run the seeder
```bash
cd backend
npm run seed
```

### What happens:
1. **Clears existing data** from all collections
2. **Creates users** with hashed passwords
3. **Creates blogs** distributed among the users
4. **Creates comments** with random authors
5. **Adds social interactions** (likes, bookmarks, follows)
6. **Creates notifications** for various activities

## Testing the features:

### Login with any user:
- Email: `john.doe@example.com` (or any other user)
- Password: `password123`

### Test features:
- ✅ Browse blogs on homepage
- ✅ Read individual blog posts
- ✅ Like and bookmark blogs
- ✅ Add comments and replies
- ✅ Follow other users
- ✅ View user profiles
- ✅ Check notifications
- ✅ Search for blogs

## Sample data includes:
- **Realistic content** with proper HTML formatting
- **High-quality images** from Unsplash
- **SEO metadata** for each blog
- **Social media links** for users
- **Realistic engagement** (views, likes, comments)
- **Proper timestamps** (within last 30 days)

## Reset data:
To reset the database and start fresh, simply run the seeder again:
```bash
npm run seed
```

This will clear all existing data and create new sample data.
