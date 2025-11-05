import express from 'express';
import {
    createUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/register - Create user
router.post('/register', createUser);

// POST /api/users/login - Login user
router.post('/login', loginUser);

// GET /api/users/profile - Get user profile (protected)
router.get('/profile', auth, getUserProfile);

// PUT /api/users/profile - Update user profile (protected)
router.put('/profile', auth, updateUserProfile);

export default router;