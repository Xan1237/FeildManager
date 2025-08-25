import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Password hashing service
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Password comparison service
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// JWT token generation service
export const generateToken = (email) => {
  const payload = { email }; 
  const secret = 'your_jwt_secret'; 
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
};

// JWT token verification service
export const verifyJwtToken = (token) => {
  const secret = 'your_jwt_secret';
  return jwt.verify(token, secret);
};
