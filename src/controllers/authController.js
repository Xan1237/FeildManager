import { Login } from '../models/index.js';
import { hashPassword, comparePassword, generateToken } from '../services/authService.js';
import { validateEmail, validatePassword, handleError } from '../utils/helpers.js';

// Account creation function
const addNewUser = async (email, password1, password2) => {
  // Password validation
  if (password1 !== password2) {
    throw new Error("Passwords do not match");
  }
  
  if (!validatePassword(password1)) {
    throw new Error("password too short");
  }
  
  // Email validation
  if (!validateEmail(email)) {
    throw new Error("invalid email");
  }

  // Hash password
  const hashedPassword = await hashPassword(password1);
  
  try {
    const newUser = await Login.create({
      email: email,
      password: hashedPassword
    });
    console.log("User created:", newUser.toJSON());
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

// User verification function
const verifyUser = async (email, password1) => {
  try {
    const user = await Login.findOne({
      where: { email },
      attributes: ['email', 'password'] 
    });

    if (!user) {
      return false;
    }

    const actualPassword = user.password;
    const valid = await comparePassword(password1, actualPassword);
    return valid; 
  } catch (error) {
    console.error("Error verifying user:", error);
    return false; 
  }
};

// Controller: Create new user
const createUser = async (req, res) => {
  try {
    const { email, password1, password2 } = req.body;
    await addNewUser(email, password1, password2);
    res.status(201).json({ success: true, message: "Account created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller: User login
const loginUser = async (req, res) => {
  const { email, password1 } = req.body;
  try {
    const valid = await verifyUser(email, password1);
    if (valid) {
      const token = generateToken(email);
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Controller: Protected route access
const getProtectedData = (req, res) => {
  res.json({ success: true, message: "You have access to this protected route" });
};

export { createUser, loginUser, getProtectedData };
