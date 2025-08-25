import express from 'express';
import authRoutes from './authRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = express.Router();

// Mount route modules
router.use('/api', authRoutes);
router.use('/api', bookingRoutes);

export default router;
