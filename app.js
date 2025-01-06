import path from 'node:path';
import express from 'express';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Add JWT for authentication
import dotenv from "dotenv/config";

import { Sequelize, DataTypes, Op } from 'sequelize';
const app = express();
const port = process.env.PORT || 8080;

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
  },
  logging: false,
})

sequelize.sync().then(() => {
  console.log("db conected");
}).catch((err) => {
  console.log(err);
});

const login = sequelize.define('login', {

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
});

const bookings = sequelize.define("bookings", {
  userName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  day: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
})

async function createUser(email1, password1) {
  try {
    const newUser = await login.create({
      email: email1,
      password: password1
    });
    console.log("User created:", newUser.toJSON());
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function createBooking(field1, email1, name1, phone1, day1, time1){
  console.log(time1);
  console.log(email1);
  try{
    const newBooking = await bookings.create({
      userName: name1,
      email: email1,
      phone: phone1,
      day: day1,
      time: time1
    });
    console.log("User created:", newBooking.toJSON());
  }
  catch (error) {
    console.error("Error booking:", error);
  }
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('./public'));
app.use(express.json()); // To parse JSON body in requests


// Account creation function (Add new user)
async function addNewUser(email, password1, password2) {

  //makes sure the passwords match
  if (password1 !== password2) {
    throw new Error("Passwords do not match");
  }
  //makes certain password is not empty
  if(password1.length < 1){
    throw new Error("password too short")
  }
  //validates email adress
  const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if(!patt.test(email)){
    throw new Error("invalid email");
  }

  //hashes
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password1, salt);
  
  try {
    createUser(email, hashedPassword);
    console.log("New user created successfully");
  } catch (error) {
    console.error("Error adding new user:", error);
    throw new Error("Failed to create user");
  }
}

// User verification function (Validate login credentials)
async function verifyUser(email, password1) {
  
  try {
    const user = await login.findOne({
      where: { email },
      attributes: ['email', 'password'] // Only select necessary fields
    });

    // If user not found
    if (!user) {
      return false;
    }

    const actualPassword = user.password;
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
    //checks token validity
    const decoded = jwt.verify(token, 'your_jwt_secret'); 
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Create new user  (for account creation)
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
      const token = generateAuthToken(email);
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



app.post('/api/appointments', async(req, res) => {
  // Extract the data from the request body
  const { year, month, day, fullDate } = req.body;

  // Validate the data 
  if (!year || !month || !day || !fullDate) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  console.log(results);

  
  // Respond with a success message
  res.status(201).json({
      message: 'Appointment successfully created',
      appointment: { year, month, day, fullDate, results },
  });
});


//receive apointment information
app.post('/api/bookings', async(req, res) => {
  try {
      const { field, email, userName, phone,  day, time } = req.body;
      const existingBoking = await bookings.findOne({ day: day, time: time });
      console.log(existingBoking);
      if(existingBoking==null){
      console.log(`Email: ${email}, Username: ${userName}, Day: ${day}, Time: ${time}`);
      createBooking(field, email, userName, phone,  day, time)
      }
      else{
        console.log("apointment already created")
      }
      res.status(201).json({
        message: 'Appointment successfully created',
        bookings: { email, userName, day, time }
      });
    } catch (error) {
      console.error('Backend Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// connects to index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(8080, () => {
  console.log("Server is active on port 8080");
});
