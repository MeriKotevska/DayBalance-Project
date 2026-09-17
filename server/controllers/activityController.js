const { ActivityHistory } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { user, targetType } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (targetType) filter.targetType = targetType;

    const activities = await ActivityHistory.find(filter)
      .populate('user', 'name email')
      .sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const activity = await ActivityHistory.findById(req.params.id).populate('user', 'name email');
    if (!activity)
      return res.status(404).json({ error: 'NotFound', message: 'Activity record not found.' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const activity = await ActivityHistory.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const activity = await ActivityHistory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');
    if (!activity)
      return res.status(404).json({ error: 'NotFound', message: 'Activity record not found.' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await ActivityHistory.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ error: 'NotFound', message: 'Activity record not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
