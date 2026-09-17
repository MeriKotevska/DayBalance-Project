const seedService = require('../services/seedService');

exports.reset = async (req, res, next) => {
  try {
    const result = await seedService.resetDatabase();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.seed = async (req, res, next) => {
  try {
    const result = await seedService.seedDatabase();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.resetAndSeed = async (req, res, next) => {
  try {
    const result = await seedService.resetAndSeed();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
