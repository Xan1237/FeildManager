import { Sequelize } from 'sequelize';
import dotenv from 'dotenv/config';

// Sequelize instance for PostgreSQL connection
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

// Database connection verification
const connectDB = async () => {
  try {
    await sequelize.sync();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export { sequelize, connectDB };
