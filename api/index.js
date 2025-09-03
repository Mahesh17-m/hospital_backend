require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('../config/database');
const errorHandler = require('../middleware/errorHandler');
const patientRoutes = require('../routes/patientRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');
const app = express();

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB().catch(err => {
  console.error('DB connect failed in serverless entry:', err);
});

app.use('/patients', patientRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/health', (req, res) =>
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() })
);

app.use(errorHandler);

module.exports = app;
