const { HabitCompletion } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { habit, user, completed } = req.query;
    const filter = {};
    if (habit) filter.habit = habit;
    if (user) filter.user = user;
    if (completed !== undefined) filter.completed = completed === 'true';

    const completions = await HabitCompletion.find(filter)
      .populate('habit', 'name')
      .populate('user', 'name email');
    res.json(completions);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const completion = await HabitCompletion.findById(req.params.id)
      .populate('habit', 'name')
      .populate('user', 'name email');
    if (!completion)
      return res.status(404).json({ error: 'NotFound', message: 'Completion record not found.' });
    res.json(completion);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const dayKey = HabitCompletion.normalizeDayKey(date);
    const doc = await HabitCompletion.create({ ...req.body, date, dayKey });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    let updateData = { ...req.body };
    if (req.body.date) {
      const date = new Date(req.body.date);
      updateData.date = date;
      updateData.dayKey = HabitCompletion.normalizeDayKey(date);
    }
    const completion = await HabitCompletion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('habit', 'name')
      .populate('user', 'name email');
    if (!completion)
      return res.status(404).json({ error: 'NotFound', message: 'Completion record not found.' });
    res.json(completion);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await HabitCompletion.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ error: 'NotFound', message: 'Completion record not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
