import path from 'node:path';
import express from 'express';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*connects to html page*/ 
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

/*enables the use of the css and javascript front end files*/
app.use(express.static('./public'));

/*starts the server at local port 8080*/
app.listen(8080, () => {
    console.log("server is active");
});

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'ou812Xander$',
  database: 'feildmanager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function logBananas() {
  try {
      const [rows] = await pool.query("SELECT * FROM bananas");
      console.log('Bananas in database:', rows);
  } catch (error) {
      console.error('Error fetching bananas:', error);
  }
}

logBananas();