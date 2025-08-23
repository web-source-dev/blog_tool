const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { User } = require('./models/user');
const { Blog } = require('./models/blog');
const Comment = require('./models/comment');
const Notification = require('./models/notification');

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    username: 'johndoe',
    bio: 'Tech enthusiast and software developer. Love writing about web development and new technologies.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    socialLinks: {
      website: 'https://johndoe.dev',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    },
    role: 'writer'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    username: 'janesmith',
    bio: 'UX/UI designer passionate about creating beautiful and functional user experiences.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    socialLinks: {
      website: 'https://janesmith.design',
      twitter: 'https://twitter.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith',
      instagram: 'https://instagram.com/janesmith'
    },
    role: 'writer'
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    password: 'password123',
    username: 'mikejohnson',
    bio: 'Full-stack developer with 8+ years of experience. Specializing in React, Node.js, and cloud technologies.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    socialLinks: {
      website: 'https://mikejohnson.dev',
      twitter: 'https://twitter.com/mikejohnson',
      linkedin: 'https://linkedin.com/in/mikejohnson',
      github: 'https://github.com/mikejohnson'
    },
    role: 'writer'
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    username: 'sarahwilson',
    bio: 'Content strategist and digital marketer. Helping businesses grow through compelling content.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    socialLinks: {
      website: 'https://sarahwilson.com',
      twitter: 'https://twitter.com/sarahwilson',
      linkedin: 'https://linkedin.com/in/sarahwilson'
    },
    role: 'writer'
  },
  {
    firstName: 'Alex',
    lastName: 'Brown',
    email: 'alex.brown@example.com',
    password: 'password123',
    username: 'alexbrown',
    bio: 'Data scientist and AI researcher. Exploring the future of machine learning and artificial intelligence.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    socialLinks: {
      website: 'https://alexbrown.ai',
      twitter: 'https://twitter.com/alexbrown',
      linkedin: 'https://linkedin.com/in/alexbrown',
      github: 'https://github.com/alexbrown'
    },
    role: 'writer'
  }
];

const sampleBlogs = [
  {
    title: 'Getting Started with React: A Complete Beginner\'s Guide',
    slug: 'getting-started-with-react-complete-beginners-guide',
    description: 'Learn the fundamentals of React.js, from components to hooks, with practical examples and best practices.',
    content: `
      <h2>Introduction to React</h2>
      <p>React is a powerful JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular frontend frameworks in the world.</p>
      
      <h3>Why React?</h3>
      <ul>
        <li>Component-based architecture</li>
        <li>Virtual DOM for performance</li>
        <li>Large ecosystem and community</li>
        <li>Reusable components</li>
      </ul>
      
      <h3>Setting Up Your First React Project</h3>
      <p>To get started with React, you'll need Node.js installed on your computer. Then you can create a new React project using Create React App:</p>
      
      <pre><code>npx create-react-app my-app
cd my-app
npm start</code></pre>
      
      <h3>Understanding Components</h3>
      <p>Components are the building blocks of React applications. They are reusable pieces of UI that can accept props and maintain their own state.</p>
      
      <h3>Hooks in React</h3>
      <p>Hooks are functions that allow you to use state and other React features in functional components. The most commonly used hooks are useState and useEffect.</p>
      
      <h3>Conclusion</h3>
      <p>React is an excellent choice for building modern web applications. With its component-based architecture and powerful ecosystem, you can create complex applications with ease.</p>
    `,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    category: 'Technology',
    status: 'published',
    isActive: true,
    isFeatured: true,
    seoTitle: 'React.js Beginner Guide - Learn React Fundamentals',
    seoDescription: 'Complete guide to getting started with React.js. Learn components, hooks, and best practices for building modern web applications.',
    seoKeywords: 'react, javascript, frontend, web development, components, hooks'
  },
  {
    title: 'The Future of Artificial Intelligence in 2024',
    slug: 'future-of-artificial-intelligence-2024',
    description: 'Explore the latest trends and developments in AI technology, from machine learning to natural language processing.',
    content: `
      <h2>The AI Revolution</h2>
      <p>Artificial Intelligence has transformed from a futuristic concept to a present-day reality that's reshaping industries across the globe.</p>
      
      <h3>Machine Learning Breakthroughs</h3>
      <p>Recent advances in machine learning have enabled computers to perform tasks that were once thought impossible. From image recognition to natural language processing, AI systems are becoming increasingly sophisticated.</p>
      
      <h3>Natural Language Processing</h3>
      <p>NLP has seen remarkable progress with models like GPT-4 and BERT. These models can understand and generate human-like text, opening up new possibilities for human-computer interaction.</p>
      
      <h3>AI in Healthcare</h3>
      <p>AI is revolutionizing healthcare with applications in disease diagnosis, drug discovery, and personalized medicine. Machine learning algorithms can analyze medical images and patient data to provide more accurate diagnoses.</p>
      
      <h3>Ethical Considerations</h3>
      <p>As AI becomes more prevalent, we must consider the ethical implications. Issues like bias in algorithms, privacy concerns, and job displacement need to be addressed.</p>
      
      <h3>Looking Ahead</h3>
      <p>The future of AI is bright, but it requires careful consideration of both its potential and its risks. By developing AI responsibly, we can harness its power to solve some of humanity's greatest challenges.</p>
    `,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    tags: ['AI', 'Machine Learning', 'Technology', 'Future'],
    category: 'Technology',
    status: 'published',
    isActive: true,
    isFeatured: true,
    seoTitle: 'AI Future 2024 - Latest Trends and Developments',
    seoDescription: 'Discover the latest trends in artificial intelligence, machine learning breakthroughs, and the future of AI technology.',
    seoKeywords: 'artificial intelligence, machine learning, AI, technology, future'
  },
  {
    title: 'Designing Beautiful User Interfaces: Principles and Best Practices',
    slug: 'designing-beautiful-user-interfaces-principles-best-practices',
    description: 'Learn the fundamental principles of UI design and discover best practices for creating engaging user experiences.',
    content: `
      <h2>Understanding UI Design</h2>
      <p>User Interface design is the process of creating interfaces that are both functional and aesthetically pleasing. It's about finding the perfect balance between form and function.</p>
      
      <h3>Design Principles</h3>
      <ul>
        <li><strong>Hierarchy:</strong> Guide users through content with clear visual hierarchy</li>
        <li><strong>Consistency:</strong> Maintain consistent design patterns throughout the interface</li>
        <li><strong>Simplicity:</strong> Keep designs clean and uncluttered</li>
        <li><strong>Accessibility:</strong> Ensure designs are usable by people with disabilities</li>
      </ul>
      
      <h3>Color Theory in UI Design</h3>
      <p>Colors play a crucial role in UI design. They can evoke emotions, guide attention, and create visual hierarchy. Understanding color theory helps designers make informed decisions about color palettes.</p>
      
      <h3>Typography Matters</h3>
      <p>Typography is more than just choosing fonts. It's about creating readable, scannable text that enhances the user experience. Consider factors like font size, line height, and contrast.</p>
      
      <h3>Responsive Design</h3>
      <p>With the variety of devices available today, responsive design is essential. Interfaces must work seamlessly across desktop, tablet, and mobile devices.</p>
      
      <h3>User Testing</h3>
      <p>No design is complete without user testing. Gather feedback from real users to identify pain points and areas for improvement.</p>
    `,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    tags: ['UI Design', 'UX', 'Design', 'User Experience'],
    category: 'Design',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'UI Design Principles - Best Practices for Beautiful Interfaces',
    seoDescription: 'Learn essential UI design principles and best practices for creating beautiful, functional user interfaces.',
    seoKeywords: 'UI design, UX, user interface, design principles, best practices'
  },
  {
    title: 'Building Scalable Web Applications with Node.js',
    slug: 'building-scalable-web-applications-nodejs',
    description: 'Discover how to build robust, scalable web applications using Node.js and modern development practices.',
    content: `
      <h2>Why Node.js for Scalable Applications?</h2>
      <p>Node.js has become the go-to platform for building scalable web applications. Its event-driven, non-blocking I/O model makes it perfect for handling high concurrent loads.</p>
      
      <h3>Architecture Patterns</h3>
      <p>When building scalable applications, it's important to follow proven architecture patterns. Consider using microservices, load balancing, and caching strategies.</p>
      
      <h3>Database Design</h3>
      <p>Choose the right database for your application. Consider factors like data structure, query patterns, and scalability requirements. MongoDB, PostgreSQL, and Redis are popular choices.</p>
      
      <h3>Performance Optimization</h3>
      <ul>
        <li>Implement caching strategies</li>
        <li>Optimize database queries</li>
        <li>Use CDN for static assets</li>
        <li>Implement proper error handling</li>
      </ul>
      
      <h3>Security Best Practices</h3>
      <p>Security should be a top priority when building web applications. Implement authentication, authorization, input validation, and protect against common vulnerabilities.</p>
      
      <h3>Monitoring and Logging</h3>
      <p>Implement comprehensive monitoring and logging to track application performance and identify issues before they affect users.</p>
    `,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    tags: ['Node.js', 'Backend', 'Web Development', 'Scalability'],
    category: 'Technology',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Node.js Scalable Applications - Building Robust Web Apps',
    seoDescription: 'Learn how to build scalable web applications with Node.js, including architecture patterns and best practices.',
    seoKeywords: 'node.js, scalable applications, web development, backend, architecture'
  },
  {
    title: 'The Complete Guide to Digital Marketing in 2024',
    slug: 'complete-guide-digital-marketing-2024',
    description: 'Master the latest digital marketing strategies, from SEO and content marketing to social media and paid advertising.',
    content: `
      <h2>Digital Marketing Landscape</h2>
      <p>The digital marketing landscape is constantly evolving. To succeed in 2024, marketers need to stay updated with the latest trends and technologies.</p>
      
      <h3>Search Engine Optimization (SEO)</h3>
      <p>SEO remains a cornerstone of digital marketing. Focus on creating high-quality content, optimizing for user experience, and building authoritative backlinks.</p>
      
      <h3>Content Marketing</h3>
      <p>Content is king in digital marketing. Create valuable, relevant content that resonates with your target audience and drives engagement.</p>
      
      <h3>Social Media Marketing</h3>
      <p>Social media platforms offer powerful tools for reaching and engaging with your audience. Develop a comprehensive social media strategy that aligns with your business goals.</p>
      
      <h3>Email Marketing</h3>
      <p>Email marketing continues to deliver the highest ROI among digital marketing channels. Personalization and automation are key to success.</p>
      
      <h3>Paid Advertising</h3>
      <p>Paid advertising can provide immediate results and complement your organic marketing efforts. Platforms like Google Ads and Facebook Ads offer sophisticated targeting options.</p>
      
      <h3>Analytics and Measurement</h3>
      <p>Track and measure your marketing efforts to understand what's working and optimize your strategies accordingly.</p>
    `,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    tags: ['Digital Marketing', 'SEO', 'Content Marketing', 'Social Media'],
    category: 'Marketing',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Digital Marketing Guide 2024 - Complete Strategy Overview',
    seoDescription: 'Comprehensive guide to digital marketing strategies for 2024, including SEO, content marketing, and social media.',
    seoKeywords: 'digital marketing, SEO, content marketing, social media, 2024'
  },
  {
    title: 'Mastering TypeScript: From Beginner to Advanced',
    slug: 'mastering-typescript-beginner-to-advanced',
    description: 'A comprehensive guide to TypeScript, covering everything from basic types to advanced patterns and best practices.',
    content: `
      <h2>Why TypeScript?</h2>
      <p>TypeScript is a superset of JavaScript that adds static typing, making your code more reliable and maintainable. It's become the standard for large-scale JavaScript applications.</p>
      
      <h3>Basic Types</h3>
      <p>TypeScript provides several basic types that help you define the shape of your data:</p>
      <pre><code>let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let hobbies: string[] = ["reading", "coding"];
let user: { name: string; age: number } = { name: "John", age: 30 };</code></pre>
      
      <h3>Interfaces and Types</h3>
      <p>Interfaces and types allow you to define complex data structures:</p>
      <pre><code>interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
}

type UserRole = 'admin' | 'user' | 'guest';</code></pre>
      
      <h3>Advanced Patterns</h3>
      <p>TypeScript supports advanced patterns like generics, utility types, and conditional types that make your code more flexible and reusable.</p>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Use strict mode for better type checking</li>
        <li>Prefer interfaces over types for object shapes</li>
        <li>Use union types for better flexibility</li>
        <li>Leverage TypeScript's built-in utility types</li>
      </ul>
    `,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Web Development'],
    category: 'Technology',
    status: 'published',
    isActive: true,
    isFeatured: true,
    seoTitle: 'TypeScript Mastery - Complete Guide from Beginner to Advanced',
    seoDescription: 'Comprehensive TypeScript guide covering basic types, interfaces, advanced patterns, and best practices for modern web development.',
    seoKeywords: 'typescript, javascript, programming, web development, static typing'
  },
  {
    title: 'The Psychology of Color in Web Design',
    slug: 'psychology-of-color-web-design',
    description: 'Understand how colors influence user behavior and learn to use color psychology to create more effective web designs.',
    content: `
      <h2>Color Psychology Fundamentals</h2>
      <p>Colors have a profound impact on human psychology and behavior. Understanding color psychology is crucial for creating effective web designs that resonate with your audience.</p>
      
      <h3>Primary Colors and Their Meanings</h3>
      <ul>
        <li><strong>Red:</strong> Energy, passion, urgency, excitement</li>
        <li><strong>Blue:</strong> Trust, stability, professionalism, calm</li>
        <li><strong>Yellow:</strong> Optimism, creativity, warmth, attention</li>
        <li><strong>Green:</strong> Growth, nature, health, prosperity</li>
        <li><strong>Purple:</strong> Luxury, creativity, mystery, wisdom</li>
        <li><strong>Orange:</strong> Enthusiasm, adventure, confidence, success</li>
      </ul>
      
      <h3>Cultural Considerations</h3>
      <p>Color meanings can vary significantly across cultures. For example, while white represents purity in Western cultures, it's associated with mourning in some Eastern cultures.</p>
      
      <h3>Color in Branding</h3>
      <p>Choose colors that align with your brand personality and target audience. Consider the emotions and associations you want to evoke.</p>
      
      <h3>Accessibility and Color</h3>
      <p>Ensure sufficient color contrast for readability and consider colorblind users when designing interfaces.</p>
      
      <h3>Practical Applications</h3>
      <p>Use color strategically to guide user attention, create visual hierarchy, and reinforce your brand message throughout the user experience.</p>
    `,
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop',
    tags: ['Color Psychology', 'Web Design', 'UX', 'Branding'],
    category: 'Design',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Color Psychology in Web Design - Complete Guide',
    seoDescription: 'Learn how colors influence user behavior and use color psychology to create more effective web designs and user experiences.',
    seoKeywords: 'color psychology, web design, UX, branding, color theory'
  },
  {
    title: 'Building a Successful SaaS Business: A Complete Guide',
    slug: 'building-successful-saas-business-complete-guide',
    description: 'Learn the essential strategies and best practices for building, launching, and scaling a successful SaaS business.',
    content: `
      <h2>The SaaS Business Model</h2>
      <p>Software as a Service (SaaS) has revolutionized how businesses deliver value to customers. Understanding the SaaS model is crucial for building a successful business.</p>
      
      <h3>Market Research and Validation</h3>
      <p>Before building your product, thoroughly research your market. Identify pain points, validate your solution, and understand your competition.</p>
      
      <h3>Product Development Strategy</h3>
      <ul>
        <li>Start with a Minimum Viable Product (MVP)</li>
        <li>Focus on core features that solve real problems</li>
        <li>Iterate based on user feedback</li>
        <li>Build for scalability from day one</li>
      </ul>
      
      <h3>Pricing Strategy</h3>
      <p>Develop a pricing strategy that reflects the value you provide while remaining competitive. Consider freemium models, tiered pricing, and usage-based pricing.</p>
      
      <h3>Customer Acquisition</h3>
      <p>Implement effective marketing strategies including content marketing, SEO, social media, and paid advertising to acquire customers cost-effectively.</p>
      
      <h3>Customer Retention</h3>
      <p>Focus on customer success, provide excellent support, and continuously improve your product based on user feedback to reduce churn.</p>
      
      <h3>Scaling Your Business</h3>
      <p>As you grow, focus on automation, building a strong team, and expanding your product offerings to meet evolving customer needs.</p>
    `,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    tags: ['SaaS', 'Business', 'Startup', 'Entrepreneurship'],
    category: 'Business',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'SaaS Business Guide - Building and Scaling Successfully',
    seoDescription: 'Complete guide to building a successful SaaS business, from market research to scaling strategies and customer retention.',
    seoKeywords: 'saas, business, startup, entrepreneurship, software'
  },
  {
    title: 'Advanced CSS Techniques for Modern Web Development',
    slug: 'advanced-css-techniques-modern-web-development',
    description: 'Master advanced CSS techniques including Grid, Flexbox, animations, and modern layout patterns for professional web development.',
    content: `
      <h2>CSS Grid Layout</h2>
      <p>CSS Grid is a powerful layout system that allows you to create complex two-dimensional layouts with ease. It's perfect for creating responsive designs.</p>
      
      <pre><code>.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}</code></pre>
      
      <h3>Flexbox for Component Layout</h3>
      <p>Flexbox is ideal for one-dimensional layouts and component alignment. Use it for navigation bars, card layouts, and form elements.</p>
      
      <h3>CSS Custom Properties (Variables)</h3>
      <p>CSS custom properties allow you to create reusable values and build more maintainable stylesheets:</p>
      <pre><code>:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --border-radius: 4px;
}</code></pre>
      
      <h3>Advanced Animations</h3>
      <p>Create smooth, performant animations using CSS transforms, transitions, and keyframes. Focus on properties that trigger only the composite layer.</p>
      
      <h3>Responsive Design Patterns</h3>
      <p>Implement responsive design using media queries, container queries, and modern CSS features to create adaptive layouts.</p>
      
      <h3>Performance Optimization</h3>
      <p>Optimize CSS performance by minimizing repaints, using efficient selectors, and leveraging CSS containment for better rendering performance.</p>
    `,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    tags: ['CSS', 'Web Development', 'Frontend', 'Design'],
    category: 'Technology',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Advanced CSS Techniques - Modern Web Development Guide',
    seoDescription: 'Master advanced CSS techniques including Grid, Flexbox, animations, and modern layout patterns for professional web development.',
    seoKeywords: 'css, web development, frontend, grid, flexbox, animations'
  },
  {
    title: 'Content Marketing Strategy for 2024: A Data-Driven Approach',
    slug: 'content-marketing-strategy-2024-data-driven-approach',
    description: 'Develop a comprehensive content marketing strategy using data-driven insights and modern tools to drive engagement and conversions.',
    content: `
      <h2>The Evolution of Content Marketing</h2>
      <p>Content marketing has evolved from simple blog posts to sophisticated, multi-channel strategies that drive real business results. In 2024, data-driven approaches are essential.</p>
      
      <h3>Content Strategy Framework</h3>
      <ul>
        <li><strong>Audience Research:</strong> Understand your target audience's needs, pain points, and content preferences</li>
        <li><strong>Content Audits:</strong> Analyze existing content performance and identify gaps</li>
        <li><strong>Content Planning:</strong> Create a comprehensive content calendar aligned with business goals</li>
        <li><strong>Distribution Strategy:</strong> Plan how and where to distribute your content</li>
      </ul>
      
      <h3>SEO and Content Optimization</h3>
      <p>Optimize your content for search engines while maintaining readability and user engagement. Focus on intent-based keywords and comprehensive content.</p>
      
      <h3>Content Formats and Channels</h3>
      <p>Diversify your content across multiple formats including blog posts, videos, podcasts, infographics, and interactive content. Adapt content for different platforms.</p>
      
      <h3>Data-Driven Content Decisions</h3>
      <p>Use analytics to understand what content performs best, identify trends, and optimize your strategy based on real data rather than assumptions.</p>
      
      <h3>Content Distribution and Promotion</h3>
      <p>Develop a comprehensive distribution strategy that includes owned, earned, and paid channels to maximize your content's reach and impact.</p>
    `,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    tags: ['Content Marketing', 'SEO', 'Digital Marketing', 'Strategy'],
    category: 'Marketing',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Content Marketing Strategy 2024 - Data-Driven Approach',
    seoDescription: 'Develop a comprehensive content marketing strategy using data-driven insights and modern tools to drive engagement and conversions.',
    seoKeywords: 'content marketing, seo, digital marketing, strategy, 2024'
  },
  {
    title: 'The Future of Remote Work: Trends and Best Practices',
    slug: 'future-remote-work-trends-best-practices',
    description: 'Explore the latest trends in remote work and discover best practices for building effective remote teams and maintaining productivity.',
    content: `
      <h2>The Remote Work Revolution</h2>
      <p>Remote work has transformed from a temporary solution to a permanent shift in how we work. Understanding the future of remote work is crucial for businesses and employees alike.</p>
      
      <h3>Current Remote Work Trends</h3>
      <ul>
        <li><strong>Hybrid Models:</strong> Combining remote and in-office work for flexibility</li>
        <li><strong>Digital Nomadism:</strong> Working from anywhere in the world</li>
        <li><strong>Virtual Reality Workspaces:</strong> Immersive collaboration environments</li>
        <li><strong>AI-Powered Tools:</strong> Automation and AI assistance for remote work</li>
      </ul>
      
      <h3>Building Effective Remote Teams</h3>
      <p>Successful remote teams require intentional strategies for communication, collaboration, and culture building. Focus on clear expectations and regular check-ins.</p>
      
      <h3>Technology and Tools</h3>
      <p>Leverage the right technology stack for remote work including video conferencing, project management tools, and collaboration platforms.</p>
      
      <h3>Work-Life Balance</h3>
      <p>Remote work can blur the lines between work and personal life. Establish clear boundaries and routines to maintain healthy work-life balance.</p>
      
      <h3>Future Predictions</h3>
      <p>As technology evolves, remote work will become even more seamless with virtual reality meetings, AI assistants, and advanced collaboration tools.</p>
    `,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    tags: ['Remote Work', 'Workplace', 'Productivity', 'Future of Work'],
    category: 'Business',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Future of Remote Work - Trends and Best Practices 2024',
    seoDescription: 'Explore the latest trends in remote work and discover best practices for building effective remote teams and maintaining productivity.',
    seoKeywords: 'remote work, workplace, productivity, future of work, trends'
  },
  {
    title: 'Cybersecurity Best Practices for Web Developers',
    slug: 'cybersecurity-best-practices-web-developers',
    description: 'Learn essential cybersecurity practices that every web developer should implement to protect applications and user data.',
    content: `
      <h2>The Importance of Cybersecurity</h2>
      <p>In today's digital landscape, cybersecurity is not optional. Web developers must understand and implement security best practices to protect applications and user data.</p>
      
      <h3>Common Security Vulnerabilities</h3>
      <ul>
        <li><strong>SQL Injection:</strong> Prevent by using parameterized queries and ORMs</li>
        <li><strong>Cross-Site Scripting (XSS):</strong> Sanitize user input and use Content Security Policy</li>
        <li><strong>Cross-Site Request Forgery (CSRF):</strong> Implement CSRF tokens</li>
        <li><strong>Authentication Vulnerabilities:</strong> Use secure authentication methods</li>
      </ul>
      
      <h3>Secure Authentication and Authorization</h3>
      <p>Implement secure authentication using modern standards like OAuth 2.0, JWT tokens, and multi-factor authentication. Always hash passwords and use HTTPS.</p>
      
      <h3>Data Protection</h3>
      <p>Encrypt sensitive data both in transit and at rest. Implement proper access controls and follow the principle of least privilege.</p>
      
      <h3>Security Headers and HTTPS</h3>
      <p>Use security headers like Content Security Policy, X-Frame-Options, and HSTS. Always use HTTPS in production environments.</p>
      
      <h3>Regular Security Audits</h3>
      <p>Conduct regular security audits, use automated security testing tools, and stay updated with the latest security threats and best practices.</p>
      
      <h3>Incident Response Planning</h3>
      <p>Have a plan for responding to security incidents, including data breach procedures and communication strategies.</p>
    `,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    tags: ['Cybersecurity', 'Web Development', 'Security', 'Best Practices'],
    category: 'Technology',
    status: 'published',
    isActive: true,
    isFeatured: false,
    seoTitle: 'Cybersecurity for Web Developers - Essential Best Practices',
    seoDescription: 'Learn essential cybersecurity practices that every web developer should implement to protect applications and user data.',
    seoKeywords: 'cybersecurity, web development, security, best practices, authentication'
  }
];

const sampleComments = [
  {
    content: 'Great article! I especially liked the section about React hooks. Very well explained for beginners.',
    isLiked: false,
    likeCount: 3
  },
  {
    content: 'This helped me understand React much better. Can you write more about state management with Redux?',
    isLiked: false,
    likeCount: 1
  },
  {
    content: 'Excellent overview of AI trends. The healthcare section was particularly interesting.',
    isLiked: false,
    likeCount: 5
  },
  {
    content: 'I\'ve been working with AI for years, and this article captures the current state perfectly.',
    isLiked: false,
    likeCount: 2
  },
  {
    content: 'Beautiful UI design examples! The color theory section was very helpful.',
    isLiked: false,
    likeCount: 4
  },
  {
    content: 'As a designer, I appreciate the focus on accessibility. It\'s often overlooked.',
    isLiked: false,
    likeCount: 3
  },
  {
    content: 'Node.js scalability tips are spot on. Microservices architecture has been a game-changer for us.',
    isLiked: false,
    likeCount: 2
  },
  {
    content: 'Great digital marketing insights! The analytics section is crucial for measuring success.',
    isLiked: false,
    likeCount: 1
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_tool');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.firstName} ${savedUser.lastName}`);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed blogs
const seedBlogs = async (users) => {
  try {
    console.log('Seeding blogs...');
    
    // Clear existing blogs
    await Blog.deleteMany({});
    
    const createdBlogs = [];
    
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = sampleBlogs[i];
      const writer = users[i % users.length]; // Distribute blogs among users
      
      const blog = new Blog({
        ...blogData,
        writer: writer._id,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        views: Math.floor(Math.random() * 1000) + 50,
        likes: [],
        bookmarks: [],
        comments: []
      });
      
      const savedBlog = await blog.save();
      createdBlogs.push(savedBlog);
      console.log(`Created blog: ${savedBlog.title}`);
    }
    
    return createdBlogs;
  } catch (error) {
    console.error('Error seeding blogs:', error);
    throw error;
  }
};

// Seed comments
const seedComments = async (blogs, users) => {
  try {
    console.log('Seeding comments...');
    
    // Clear existing comments
    await Comment.deleteMany({});
    
    const createdComments = [];
    
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const numComments = Math.floor(Math.random() * 5) + 2; // 2-6 comments per blog
      
      for (let j = 0; j < numComments; j++) {
        const commentData = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        const author = users[Math.floor(Math.random() * users.length)];
        
        const comment = new Comment({
          blog: blog._id,
          author: author._id,
          content: commentData.content,
          likes: [],
          isEdited: false,
          isDeleted: false,
          mentions: []
        });
        
        const savedComment = await comment.save();
        createdComments.push(savedComment);
        
        // Add comment to blog
        await blog.addComment(savedComment._id);
        
        // Add some random likes to comments
        const numLikes = Math.floor(Math.random() * 3);
        for (let k = 0; k < numLikes; k++) {
          const liker = users[Math.floor(Math.random() * users.length)];
          await savedComment.addLike(liker._id);
        }
      }
    }
    
    console.log(`Created ${createdComments.length} comments`);
    return createdComments;
  } catch (error) {
    console.error('Error seeding comments:', error);
    throw error;
  }
};

// Seed social interactions
const seedSocialInteractions = async (blogs, users) => {
  try {
    console.log('Seeding social interactions...');
    
    // Add random likes and bookmarks to blogs
    for (const blog of blogs) {
      const numLikes = Math.floor(Math.random() * 20) + 5; // 5-25 likes per blog
      const numBookmarks = Math.floor(Math.random() * 10) + 2; // 2-12 bookmarks per blog
      
      // Add random likes
      for (let i = 0; i < numLikes; i++) {
        const liker = users[Math.floor(Math.random() * users.length)];
        await blog.addLike(liker._id);
      }
      
      // Add random bookmarks
      for (let i = 0; i < numBookmarks; i++) {
        const bookmarker = users[Math.floor(Math.random() * users.length)];
        await blog.addBookmark(bookmarker._id);
      }
    }
    
    // Add some random follows between users
    for (const user of users) {
      const numFollowing = Math.floor(Math.random() * 3) + 1; // 1-4 following per user
      
      for (let i = 0; i < numFollowing; i++) {
        const userToFollow = users[Math.floor(Math.random() * users.length)];
        if (user._id.toString() !== userToFollow._id.toString()) {
          await user.followUser(userToFollow._id);
        }
      }
    }
    
    console.log('Social interactions seeded successfully');
  } catch (error) {
    console.error('Error seeding social interactions:', error);
    throw error;
  }
};

// Seed notifications
const seedNotifications = async (blogs, users, comments) => {
  try {
    console.log('Seeding notifications...');
    
    // Clear existing notifications
    await Notification.deleteMany({});
    
    const notificationTypes = [
      'like_blog',
      'comment_blog',
      'like_comment',
      'follow_user',
      'new_follower'
    ];
    
    let notificationCount = 0;
    
    // Create some sample notifications
    for (let i = 0; i < 20; i++) {
      const recipient = users[Math.floor(Math.random() * users.length)];
      const sender = users[Math.floor(Math.random() * users.length)];
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      let notificationData = {
        recipient: recipient._id,
        sender: sender._id,
        type,
        isRead: Math.random() > 0.3, // 70% read
        isDeleted: false
      };
      
      switch (type) {
        case 'like_blog':
          const blog = blogs[Math.floor(Math.random() * blogs.length)];
          notificationData = {
            ...notificationData,
            title: `${sender.firstName} liked your blog`,
            message: `${sender.firstName} ${sender.lastName} liked your blog "${blog.title}"`,
            data: { blog: blog._id, url: `/blog/${blog.slug}` }
          };
          break;
        case 'comment_blog':
          const blogForComment = blogs[Math.floor(Math.random() * blogs.length)];
          notificationData = {
            ...notificationData,
            title: `${sender.firstName} commented on your blog`,
            message: `${sender.firstName} ${sender.lastName} commented on your blog "${blogForComment.title}"`,
            data: { blog: blogForComment._id, url: `/blog/${blogForComment.slug}` }
          };
          break;
        case 'like_comment':
          const comment = comments[Math.floor(Math.random() * comments.length)];
          notificationData = {
            ...notificationData,
            title: `${sender.firstName} liked your comment`,
            message: `${sender.firstName} ${sender.lastName} liked your comment`,
            data: { comment: comment._id }
          };
          break;
        case 'follow_user':
          notificationData = {
            ...notificationData,
            title: `${sender.firstName} started following you`,
            message: `${sender.firstName} ${sender.lastName} started following you`,
            data: { url: `/profile/${sender.username}` }
          };
          break;
        case 'new_follower':
          notificationData = {
            ...notificationData,
            title: `New follower`,
            message: `${sender.firstName} ${sender.lastName} started following you`,
            data: { url: `/profile/${sender.username}` }
          };
          break;
      }
      
      const notification = new Notification(notificationData);
      await notification.save();
      notificationCount++;
    }
    
    console.log(`Created ${notificationCount} notifications`);
  } catch (error) {
    console.error('Error seeding notifications:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Seed in order
    const users = await seedUsers();
    const blogs = await seedBlogs(users);
    const comments = await seedComments(blogs, users);
    await seedSocialInteractions(blogs, users);
    await seedNotifications(blogs, users, comments);
    
    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${blogs.length} blogs`);
    console.log(`Created ${comments.length} comments`);
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
