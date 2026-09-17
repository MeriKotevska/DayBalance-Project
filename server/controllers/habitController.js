const { Habit } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { search, category, timeOfDay, owner } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (timeOfDay) {
      filter.timeOfDay = timeOfDay;
    }
    if (owner) {
      filter.owner = owner;
    }

    const habits = await Habit.find(filter)
      .populate('category', 'name')
      .populate('owner', 'name email');
    res.json(habits);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id)
      .populate('category', 'name')
      .populate('owner', 'name email');
    if (!habit) return res.status(404).json({ error: 'NotFound', message: 'Habit not found.' });
    res.json(habit);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const habit = await Habit.create(req.body);
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name')
      .populate('owner', 'name email');
    if (!habit) return res.status(404).json({ error: 'NotFound', message: 'Habit not found.' });
    res.json(habit);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Habit.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'NotFound', message: 'Habit not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
