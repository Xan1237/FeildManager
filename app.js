import path from 'node:path';
import express from 'express';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Add JWT for authentication

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('./public'));
app.use(express.json()); // To parse JSON body in requests

// MySQL connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'ou812Xander$',  
  database: 'feildmanager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Account creation function (Add new user)
async function addNewUser(email, password1, password2) {
  if (password1 !== password2) {
    throw new Error("Passwords do not match");
  }
  const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if(!patt.test(email)){
    throw new Error("invalid email");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password1, salt);
  
  try {
    await pool.query("INSERT INTO bananas (userName, passwords) VALUES (?, ?)", [
      email, hashedPassword
    ]);
    console.log("New user created successfully");
  } catch (error) {
    console.error("Error adding new user:", error);
    throw new Error("Failed to create user");
  }
}

// User verification function (Validate login credentials)
async function verifyUser(email, password1) {
  try {
    const [results] = await pool.query("SELECT * FROM bananas WHERE userName = ?", [email]);
    if (results.length === 0) {
      return false; 
    }

    const actualPassword = results[0]["passwords"];
    const valid = await bcrypt.compare(password1, actualPassword);
    return valid; 
  } catch (error) {
    console.error("Error verifying user:", error);
    return false; 
  }
}

// JWT generation function for successful login
function generateAuthToken(userId) {
  const payload = { userId };
  const secret = 'your_jwt_secret'; // Store this secret in an environment variable
  const options = { expiresIn: '1h' }; // Token expiration time
  return jwt.sign(payload, secret, options);
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify the token
    req.user = decoded; // Attach user data to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Create new user endpoint (for account creation)
app.post('/api/users', async (req, res) => {
  try {
    const { email, password1, password2 } = req.body;
    await addNewUser(email, password1, password2);
    res.status(201).json({ success: true, message: "Account created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login endpoint to authenticate and issue JWT token
app.post('/api/users/login', async (req, res) => {
  const { email, password1 } = req.body;
  
  try {
    const valid = await verifyUser(email, password1);
    if (valid) {
      const [results] = await pool.query("SELECT * FROM bananas WHERE userName = ?", [email]);
      const token = generateAuthToken(results[0].id);
      res.status(200).json({ success: true, token }); // Send JWT token upon successful login
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Protected route (requires valid token)
app.get('/api/protected', verifyToken, (req, res) => {
  // This route will only be accessible if the token is valid
  res.json({ success: true, message: "You have access to this protected route" });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(8080, () => {
  console.log("Server is active on port 8080");
});
