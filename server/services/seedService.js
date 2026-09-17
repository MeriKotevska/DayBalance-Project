const mongoose = require('mongoose');
const {
  User,
  Category,
  Habit,
  HabitCompletion,
  HealthyTip,
  ActivityHistory,
} = require('../models');

/**
 * Delete all data from the six DayBalance collections.
 */
async function resetDatabase() {
  const collections = [
    HabitCompletion,
    Habit,
    HealthyTip,
    ActivityHistory,
    Category,
    User,
  ];
  for (const model of collections) {
    await model.deleteMany({});
  }
  return { message: 'All DayBalance collections cleared.' };
}

/**
 * Insert realistic DayBalance sample data with proper cross-references.
 */
async function seedDatabase() {
  // ── Categories ──
  const categories = await Category.insertMany([
    { name: 'Hydration', description: 'Daily water intake and hydration habits.' },
    { name: 'Movement', description: 'Physical activity and exercise routines.' },
    { name: 'Mindfulness', description: 'Mental wellness, meditation, and reflection.' },
    { name: 'Nutrition', description: 'Healthy eating and meal planning.' },
    { name: 'Sleep', description: 'Sleep quality and bedtime routines.' },
    { name: 'Productivity', description: 'Focus, reading, and personal growth.' },
  ]);

  const catMap = {};
  categories.forEach((c) => { catMap[c.name] = c; });

  // ── Users ──
  // NOTE: Passwords are stored in plain text for development only.
  // Part 4 will add hashing (bcrypt + JWT authentication).
  const users = await User.insertMany([
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'devpass123', role: 'admin' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'devpass123', role: 'user' },
    { name: 'Carol Davis', email: 'carol@example.com', password: 'devpass123', role: 'user' },
  ]);

  const [alice, bob, carol] = users;

  // ── Habits ──
  const habits = await Habit.insertMany([
    {
      name: 'Drink Water',
      description: 'Drink at least 8 glasses of water throughout the day.',
      category: catMap['Hydration']._id,
      owner: bob._id,
      timeOfDay: 'morning',
      frequency: 'daily',
      duration: 2,
      difficulty: 'easy',
      reminder: '08:00',
      active: true,
    },
    {
      name: 'Morning Walk',
      description: 'A 30-minute walk to start the day with movement.',
      category: catMap['Movement']._id,
      owner: bob._id,
      timeOfDay: 'morning',
      frequency: 'daily',
      duration: 30,
      difficulty: 'medium',
      reminder: '07:00',
      active: true,
    },
    {
      name: 'Read 20 Minutes',
      description: 'Read a book for at least 20 minutes each day.',
      category: catMap['Productivity']._id,
      owner: carol._id,
      timeOfDay: 'evening',
      frequency: 'daily',
      duration: 20,
      difficulty: 'easy',
      reminder: '21:00',
      active: true,
    },
    {
      name: 'Meditation',
      description: '10 minutes of guided meditation for mental clarity.',
      category: catMap['Mindfulness']._id,
      owner: carol._id,
      timeOfDay: 'morning',
      frequency: 'daily',
      duration: 10,
      difficulty: 'medium',
      reminder: '06:30',
      active: true,
    },
    {
      name: 'Sleep Routine',
      description: 'Be in bed before 23:00 for a full night of rest.',
      category: catMap['Sleep']._id,
      owner: bob._id,
      timeOfDay: 'evening',
      frequency: 'daily',
      duration: 5,
      difficulty: 'hard',
      reminder: '22:30',
      active: true,
    },
    {
      name: 'Eat Breakfast',
      description: 'Have a healthy breakfast every morning.',
      category: catMap['Nutrition']._id,
      owner: alice._id,
      timeOfDay: 'morning',
      frequency: 'daily',
      duration: 15,
      difficulty: 'easy',
      reminder: '08:30',
      active: true,
    },
  ]);

  // ── Habit Completions (last 3 days) ──
  const today = new Date();
  const completions = [];
  for (let offset = 0; offset < 3; offset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    const dayKey = HabitCompletion.normalizeDayKey(date);

    // Bob completed Drink Water and Morning Walk
    completions.push({ habit: habits[0]._id, user: bob._id, date, dayKey, completed: true });
    completions.push({ habit: habits[1]._id, user: bob._id, date, dayKey, completed: true });
    // Carol completed Meditation
    completions.push({ habit: habits[3]._id, user: carol._id, date, dayKey, completed: true });
    // Alice completed Eat Breakfast (only days 0 and 2)
    if (offset !== 1) {
      completions.push({ habit: habits[5]._id, user: alice._id, date, dayKey, completed: true });
    }
  }
  await HabitCompletion.insertMany(completions);

  // ── Healthy Tips ──
  await HealthyTip.insertMany([
    {
      title: 'Start your day with a glass of water',
      content: 'Drinking water first thing in the morning rehydrates your body after sleep and kick-starts your metabolism. Keep a glass on your nightstand as a reminder.',
      category: catMap['Hydration']._id,
    },
    {
      title: 'A 30-minute walk can change your day',
      content: 'Regular morning walks improve cardiovascular health, boost mood, and increase focus for the rest of the day. Start small and build consistency.',
      category: catMap['Movement']._id,
    },
    {
      title: 'How to build a sleep routine',
      content: 'Go to bed at the same time every night, avoid screens 30 minutes before sleep, and keep your bedroom cool and dark. Consistency is more important than perfection.',
      category: catMap['Sleep']._id,
    },
    {
      title: 'Two minutes of deep breathing',
      content: 'When you feel overwhelmed, pause and take five slow deep breaths. This simple mindfulness exercise reduces stress and improves focus.',
      category: catMap['Mindfulness']._id,
    },
    {
      title: 'Plan your meals ahead',
      content: 'Preparing meals in advance helps you make healthier food choices and avoid last-minute convenience food. Start with just one meal per week.',
      category: catMap['Nutrition']._id,
    },
  ]);

  // ── Activity History ──
  const now = new Date();
  await ActivityHistory.insertMany([
    { user: bob._id, action: 'created_habit', targetType: 'Habit', targetId: habits[0]._id, date: now },
    { user: bob._id, action: 'created_habit', targetType: 'Habit', targetId: habits[1]._id, date: now },
    { user: carol._id, action: 'created_habit', targetType: 'Habit', targetId: habits[2]._id, date: now },
    { user: carol._id, action: 'created_habit', targetType: 'Habit', targetId: habits[3]._id, date: now },
    { user: alice._id, action: 'completed_habit', targetType: 'HabitCompletion', targetId: completions[0]._id || new mongoose.Types.ObjectId(), date: now },
  ]);

  return {
    message: 'Database seeded successfully.',
    counts: {
      categories: categories.length,
      users: users.length,
      habits: habits.length,
      completions: completions.length,
      tips: 5,
      activities: 5,
    },
  };
}

/**
 * Reset then seed in the correct order.
 */
async function resetAndSeed() {
  await resetDatabase();
  const seedResult = await seedDatabase();
  return {
    message: 'Database reset and seeded successfully.',
    seed: seedResult,
  };
}

module.exports = { resetDatabase, seedDatabase, resetAndSeed };
