const { HealthyTip } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;

    const tips = await HealthyTip.find(filter).populate('category', 'name');
    res.json(tips);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const tip = await HealthyTip.findById(req.params.id).populate('category', 'name');
    if (!tip) return res.status(404).json({ error: 'NotFound', message: 'Healthy tip not found.' });
    res.json(tip);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const tip = await HealthyTip.create(req.body);
    res.status(201).json(tip);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const tip = await HealthyTip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');
    if (!tip) return res.status(404).json({ error: 'NotFound', message: 'Healthy tip not found.' });
    res.json(tip);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await HealthyTip.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'NotFound', message: 'Healthy tip not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
