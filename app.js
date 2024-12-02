import path from 'node:path';
import express from 'express';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});


app.use(express.static('./public'));




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
let password2 = "hello";
let salt = bcrypt.genSaltSync(10);
const hash = await bcrypt.hash(password2, 11);
console.log(hash);

app.use(express.json());
app.post('/api/users', async (req, res) => {
  try {
      const { email, password1, password2 } = req.body;
      console.log(email)
  } catch (error) {
      console.error('Account creation error:', error);
  }
});

app.listen(8080, () => {
  console.log("server is active");
});