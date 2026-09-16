const path = require('path');
const express = require('express');
require('dotenv').config();

const config = require('./config/env');
const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// Parse JSON bodies (for future API endpoints).
app.use(express.json());

// API routes — mounted under /api.
app.use('/api', apiRoutes);

// Serve the existing static Part 1 frontend from the project root.
const staticRoot = path.join(__dirname, '..');
app.use(express.static(staticRoot));

// 404 for API routes only; let unknown non-API paths return the
// default Express 404.
app.use(notFound);

// Centralised error handler (must be last).
app.use(errorHandler);

async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(
      `DayBalance server running on http://localhost:${config.port} ` +
        `(${config.nodeEnv})`
    );
  });
}

start();
