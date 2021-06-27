const dotenv = require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.DB_TYPE = process.env.DB_TYPE || 'mysql';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_NAME = process.env.DB_NAME || 'sms';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || '123456';