const { User } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const obj = user.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'NotFound', message: 'User not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
