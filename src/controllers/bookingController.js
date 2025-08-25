import { BookingsFields } from '../models/index.js';

// Create booking function
const createBooking = async (field1, email1, name1, phone1, day1, time1) => {
  console.log(time1);
  console.log(email1);
  try {
    const newBooking = await BookingsFields.create({
      field: field1,
      userName: name1,
      email: email1,
      phone: phone1,
      day: day1,
      time: time1
    });
    console.log("Booking created:", newBooking.toJSON());
    return newBooking;
  } catch (error) {
    console.error("Error booking:", error);
    throw error;
  }
};

// Controller: Get user's bookings
const getMyBookings = async (req, res) => {
  const email = req.user.email;
  try {
    const myBookings = await BookingsFields.findAll({ where: { email } });
    res.json(myBookings);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving bookings" });
  }
};

// Controller: Create new booking
const createNewBooking = async (req, res) => {
  try {
    const { field, email, userName, phone, day, time } = req.body;
    console.log(field);

    // Calculate adjacent time slots for overlap checking
    let hours = parseInt((time.slice(0, 2)));
    let increase = (hours + 1) % 24;
    let decrease = (hours - 1) % 24;
    
    if (decrease < 0) {
      decrease += 24;
    }
    
    let after = time;
    let before = time;
    
    if (increase < 10) {
      increase = "0" + increase;
    }
    if (decrease < 10) {
      decrease = "0" + decrease;
    }
    
    after = increase + time.slice(2, time.length);
    before = decrease + time.slice(2, time.length);
    
    console.log(after);
    console.log(before);

    // Check for existing booking at the requested time
    let existingBooking = await BookingsFields.findOne({ 
      where: { field: field, day: day, time: time } 
    });
    
    console.log(existingBooking);

    // If time is available, create booking
    if (existingBooking == null) {
      console.log(`Email: ${email}, Username: ${userName}, Day: ${day}, Time: ${time}`);
      await createBooking(field, req.user.email, userName, phone, day, time);
      
      res.status(201).json({
        message: 'Appointment successfully created',
        BookingsFields: { email, userName, day, time, success: true }
      });
    } else {
      // Time not available
      res.status(201).json({
        message: 'Time not available',
        BookingsFields: { email, userName, day, time, success: false },
      });
    }
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller: Get available times for a field on a specific date
const getAvailableTimes = async (req, res) => {
  try {
    const { date, field } = req.body;
    const myBookings = await BookingsFields.findAll({ 
      where: { day: date, field: field } 
    });
    res.status(201).json({
      dates: myBookings
    });
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller: Delete booking
const deleteBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userEmail = req.user.email; 
  
  try {
    // Find the booking and verify ownership
    const booking = await BookingsFields.findOne({
      where: {
        id: bookingId,
        email: userEmail 
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to delete it'
      });
    }

    // Delete the booking
    await booking.destroy();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Booking successfully deleted',
      deletedBookingId: bookingId
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    
    // Handle specific error types
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking data provided'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting booking'
    });
  }
};

// Controller: Create appointment (legacy - might not be used)
const createAppointment = async (req, res) => {
  const { year, month, day, fullDate } = req.body;

  if (!year || !month || !day || !fullDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  res.status(201).json({
    message: 'Appointment successfully created',
    appointment: { year, month, day, fullDate },
  });
};

export { 
  getMyBookings, 
  createNewBooking, 
  getAvailableTimes, 
  deleteBooking, 
  createAppointment 
};
