import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv/config';
import { connectDB } from './src/config/database.js';
import routes from './src/routes/index.js';

// Initialize Express app
const app = express();

console.log(process.env.CA);

// Connect to database
connectDB();

// Middleware setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static('./public'));
app.use(express.json()); 

// Use routes
app.use(routes);

// connects to index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(8080, () => {
  console.log("Server is active on port 8080");
});
