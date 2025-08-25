import express from 'express';
import { createUser, loginUser, getProtectedData } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create new user (registration)
router.post('/users', createUser);

// User login
router.post('/users/login', loginUser);

// Protected route
router.get('/protected', verifyToken, getProtectedData);

export default router;
