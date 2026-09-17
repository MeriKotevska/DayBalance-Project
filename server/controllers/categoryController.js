const { Category } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'NotFound', message: 'Category not found.' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ error: 'NotFound', message: 'Category not found.' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'NotFound', message: 'Category not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
