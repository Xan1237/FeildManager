// Email validation utility
export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

// Password validation utility
export const validatePassword = (password) => {
  return password && password.length >= 1; // You can enhance this with more rules
};

// Time slot calculation utilities
export const calculateAdjacentTimeSlots = (time) => {
  let hours = parseInt((time.slice(0, 2)));
  let increase = (hours + 1) % 24;
  let decrease = (hours - 1) % 24;
  
  if (decrease < 0) {
    decrease += 24;
  }
  
  const formatHour = (hour) => hour < 10 ? "0" + hour : hour.toString();
  
  const after = formatHour(increase) + time.slice(2, time.length);
  const before = formatHour(decrease) + time.slice(2, time.length);
  
  return { before, after };
};

// Generic error handler
export const handleError = (error, res, defaultMessage = 'Internal server error') => {
  console.error('Error:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data provided'
    });
  }
  
  res.status(500).json({
    success: false,
    message: defaultMessage
  });
};
