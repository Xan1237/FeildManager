import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// User login model
const Login = sequelize.define('login', {
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

// Booking fields model
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
});

export { Login, BookingsFields };
