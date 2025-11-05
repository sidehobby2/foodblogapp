import express from 'express';
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    getUserBlogs
} from '../controllers/blogController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/blogs - Get all blogs (public)
router.get('/', getAllBlogs);

// GET /api/blogs/my-blogs - Get user's blogs (protected)
router.get('/my-blogs', auth, getUserBlogs);

// GET /api/blogs/:id - Get single blog (public)
router.get('/:id', getBlogById);

// POST /api/blogs - Create new blog (protected)
router.post('/', auth, createBlog);

// PUT /api/blogs/:id - Update blog (protected)
router.put('/:id', auth, updateBlog);

// DELETE /api/blogs/:id - Delete blog (protected)
router.delete('/:id', auth, deleteBlog);

export default router;