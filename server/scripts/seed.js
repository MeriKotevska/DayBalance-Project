require('dotenv').config();
const connectDB = require('../config/db');
const { resetAndSeed } = require('../services/seedService');

connectDB()
  .then(() => resetAndSeed())
  .then((result) => {
    console.log(result.message);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
