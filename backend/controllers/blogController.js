import Blog from '../models/Blog.js';

// Get all blogs (with optional user filter)
const getAllBlogs = async (req, res) => {
    try {
        const { userId, author } = req.query;
        let filter = {};

        if (userId) {
            filter.author = userId;
        }
        if (author) {
            filter.author = author;
        }

        const blogs = await Blog.find(filter)
            .populate('author', 'username profile.displayName profile.avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

// Get single blog
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username profile.displayName profile.avatar');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
            error: error.message
        });
    }
};

// Create new blog
const createBlog = async (req, res) => {
    try {
        const { title, content, summary, category, cookingTime, servings } = req.body;
        const author = req.user.userId; // From auth middleware

        // Validation
        if (!title || !content || !summary) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and summary are required'
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot be more than 200 characters'
            });
        }

        if (summary.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Summary cannot be more than 500 characters'
            });
        }

        const blog = new Blog({
            title: title.trim(),
            content: content.trim(),
            summary: summary.trim(),
            author,
            category: category || 'Dinner',
            cookingTime: cookingTime || 30,
            servings: servings || 4
        });

        const savedBlog = await blog.save();
        await savedBlog.populate('author', 'username profile.displayName profile.avatar');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: savedBlog
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating blog',
            error: error.message
        });
    }
};

// Update blog
const updateBlog = async (req, res) => {
    try {
        const { title, content, summary, category, cookingTime, servings } = req.body;

        // Validation
        if (title && title.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot be more than 200 characters'
            });
        }

        if (summary && summary.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Summary cannot be more than 500 characters'
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user owns the blog
        if (blog.author.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        // Update fields
        if (title) blog.title = title.trim();
        if (content) blog.content = content.trim();
        if (summary) blog.summary = summary.trim();
        if (category) blog.category = category;
        if (cookingTime) blog.cookingTime = cookingTime;
        if (servings) blog.servings = servings;

        const updatedBlog = await blog.save();
        await updatedBlog.populate('author', 'username profile.displayName profile.avatar');

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating blog',
            error: error.message
        });
    }
};

// Delete blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user owns the blog
        if (blog.author.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog',
            error: error.message
        });
    }
};

// Get user's blogs
const getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.userId })
            .populate('author', 'username profile.displayName profile.avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user blogs',
            error: error.message
        });
    }
};

export {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    getUserBlogs
};