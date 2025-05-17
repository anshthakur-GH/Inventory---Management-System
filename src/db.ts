import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'inventory',
  process.env.MYSQLUSER || 'root',
  process.env.MYSQLPASSWORD || '',
  {
    host: process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.MYSQLPORT) || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        minVersion: 'TLSv1.2',
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export default async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
  } catch (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
} 