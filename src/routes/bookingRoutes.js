import express from 'express';
import { 
  getMyBookings, 
  createNewBooking, 
  getAvailableTimes, 
  deleteBooking, 
  createAppointment 
} from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookings (protected)
router.get('/MyBookings', verifyToken, getMyBookings);

// Create new booking (protected)
router.post('/bookings', verifyToken, createNewBooking);

// Get available times for a field
router.post('/availableTimes', getAvailableTimes);

// Delete booking (protected)
router.delete('/bookings/:id', verifyToken, deleteBooking);

// Legacy appointment route (might not be used)
router.post('/appointments', createAppointment);

export default router;
