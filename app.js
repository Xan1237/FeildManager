import path from 'node:path';
import express from 'express';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";
import fs from 'fs'
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv/config";
import { Sequelize, DataTypes, Op } from 'sequelize';

//assignment statments
const app = express();

console.log(process.env.CA);

//allows use of sequalize to give commands to the progresql server
const sequelize = new Sequelize(
  "defaultdb",
  "avnadmin",
  process.env.WORD,
  {
    host: process.env.DB_HOST,
    port: 27176,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
);

//verifies that the database is connected
sequelize.sync().then(() => {
  console.log("db conected");
}).catch((err) => {
  console.log(err);
});

//DEFINING DIFFRENT PROGRESQL OBJECT/TABLES FORMAT

//format used to store user information 
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

//The main format for the booking fields on the website
const BookingsFields = sequelize.define("BookingsFields", {
  field: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

//function called to create a new user
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

//function to be called to create a new booking
async function createBooking(field1, email1, name1, phone1, day1, time1){
  console.log(time1);
  console.log(email1);
  try{
    const newBooking = await BookingsFields.create({
      field: field1,
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

//gives instructions to acess front end elements
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static('./public'));
app.use(express.json()); 


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
    //Call function that adds user to db
    createUser(email, hashedPassword);
    console.log("New user created successfully");
  } catch (error) {
    console.error("Error adding new user:", error);
    throw new Error("Failed to create user");
  }
}

// User verification function (Validate login credentials)
async function verifyUser(email, password1) {
  //Atempts to find the hash of the email provided
  try {
      const user = await login.findOne({
      where: { email },
      attributes: ['email', 'password'] 
    });

    // If user not found
    if (!user) {
      return false;
    }
    //if the email is found in the db
    const actualPassword = user.password;
    //compares the hashes of the passwords
    const valid = await bcrypt.compare(password1, actualPassword);
    return valid; 
  } catch (error) {
    console.error("Error verifying user:", error);
    return false; 
  }
}

// JWT generation function for successful login
function generateAuthToken(email) {
  const payload = { email }; 
  const secret = 'your_jwt_secret'; 
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
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

//Receives login request and calls function to verify user
app.post('/api/users/login', async (req, res) => {
  const { email, password1 } = req.body;
  try {
    const valid = await verifyUser(email, password1);
    if (valid) {
      //generates jwt token
      const token = generateAuthToken(email);
      res.status(200).json({ success: true, token });
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

//gets bookings matching users email based on jwt to  be sent to frontend
app.get('/api/MyBookings', verifyToken, async(req, res) => {
  const email = req.user.email; // Now this will work correctly
  try {
    const myBookings = await BookingsFields.findAll({ where: { email } });
    res.json(myBookings);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving bookings" });
  }
});


//I dont think this is used but im too scared to rmove this
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


//receive apointment information assuming 2 hour booking slots
app.post('/api/bookings', verifyToken,  async(req, res) => {
  try {
      const { field, email, userName, phone,  day, time } = req.body;
      console.log(field);

      //this block creates variables for the times after and before the booking
      let hours = parseInt((time.slice(0,2)));
      let increase = (hours +1) %24;
      let decrease = (hours-1) %24;
      if (decrease<0){
        decrease += 24;
      }
      let after = time;
      let before = time;
      if(increase <10){
        increase = "0" + increase;
      }
      if(decrease <10){
        decrease = "0" + decrease;
      }
      after = increase + time.slice(2, time.length);
      before = decrease+ time.slice(2, time.length);
      console.log(after);
      console.log(before);

      //the multitude of if statments checks the times after and before to make sure theres no overlap
      let existingBoking = await BookingsFields.findOne({ where: { field: field, day: day, time: time } });
      console.log(existingBoking);

      //The time is available
      if(existingBoking==null){
      console.log(`Email: ${email}, Username: ${userName}, Day: ${day}, Time: ${time}`);
      await createBooking(field, req.user.email, userName, phone,  day, time);
      }
      else{
        console.log("apointment already created")
      }
      //time available
      if(existingBoking==null){
        let success = true;
      res.status(201).json({
        message: 'Appointment successfully created',
        BookingsFields: { email, userName, day, time, success }
      });
    }
    //time not available
    else{
      let success = false;
      res.status(201).json({
        message: 'Time not available',
        BookingsFields: { email, userName, day, time, success },
      });
    }
    } catch (error) {
      console.error('Backend Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//sends list of available times
app.post("/api/availableTimes", async(req, res)=>{
  try{
    const {date, field} = req.body;
    const myBookings = await BookingsFields.findAll({ where: { day : date, field: field } });
    res.status(201).json({
      dates : myBookings
    })
  }
 catch (error) {
  console.error('Backend Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});




//deletes bookings given a user action
app.delete('/api/bookings/:id', verifyToken, async (req, res) => {
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
});


// connects to index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(8080, () => {
  console.log("Server is active on port 8080");
});
