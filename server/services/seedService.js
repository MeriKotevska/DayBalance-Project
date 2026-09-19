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
  const bcrypt=require('bcryptjs');
  const categories=await Category.insertMany([{name:'Hydration',description:'Daily water intake.'},{name:'Movement',description:'Exercise and movement.'},{name:'Mindfulness',description:'Mental wellness.'},{name:'Nutrition',description:'Healthy eating.'},{name:'Sleep',description:'Rest and sleep.'},{name:'Productivity',description:'Focus and growth.'}]);const cm=Object.fromEntries(categories.map(c=>[c.name,c]));
  const adminPass=await bcrypt.hash('Admin123!',10),userPass=await bcrypt.hash('User123!',10);
  const users=await User.insertMany([{name:'DayBalance Admin',email:'admin@daybalance.test',password:adminPass,role:'admin'},{name:'Demo User',email:'user@daybalance.test',password:userPass,role:'user'},{name:'Carol Davis',email:'carol@example.com',password:userPass,role:'user'}]);const [admin,user,carol]=users;
  const habits=await Habit.insertMany([{name:'Drink Water',description:'Drink 8 glasses of water.',category:cm.Hydration._id,owner:user._id,timeOfDay:'morning',frequency:'daily',duration:2,difficulty:'easy',reminder:'08:00'},{name:'Morning Walk',description:'A 30-minute morning walk.',category:cm.Movement._id,owner:user._id,timeOfDay:'morning',frequency:'daily',duration:30,difficulty:'medium',reminder:'07:00'},{name:'Read 20 Minutes',description:'Read every day.',category:cm.Productivity._id,owner:carol._id,timeOfDay:'evening',frequency:'daily',duration:20,difficulty:'easy'},{name:'Meditation',description:'10 minutes of meditation.',category:cm.Mindfulness._id,owner:carol._id,timeOfDay:'morning',frequency:'daily',duration:10,difficulty:'medium'},{name:'Sleep Routine',description:'Be in bed before 23:00.',category:cm.Sleep._id,owner:user._id,timeOfDay:'evening',frequency:'daily',duration:5,difficulty:'hard'},{name:'Eat Breakfast',description:'Have a healthy breakfast.',category:cm.Nutrition._id,owner:admin._id,timeOfDay:'morning',frequency:'daily',duration:15,difficulty:'easy'}]);
  const cs=[];for(let o=0;o<5;o++){const d=new Date();d.setDate(d.getDate()-o);const dayKey=HabitCompletion.normalizeDayKey(d);cs.push({habit:habits[0]._id,user:user._id,date:d,dayKey,completed:true});if(o%2===0)cs.push({habit:habits[1]._id,user:user._id,date:d,dayKey,completed:true});}const inserted=await HabitCompletion.insertMany(cs);
  await HealthyTip.insertMany([{title:'Start with water',content:'A glass of water is a simple way to begin your morning routine.',category:cm.Hydration._id},{title:'Walk for your wellbeing',content:'Regular walking supports mood, movement and consistency.',category:cm.Movement._id},{title:'Build a sleep routine',content:'Keep a consistent bedtime and reduce screens before sleep.',category:cm.Sleep._id},{title:'Pause and breathe',content:'A few slow breaths can help you reset your attention.',category:cm.Mindfulness._id},{title:'Plan meals ahead',content:'Simple planning can make balanced meals easier.',category:cm.Nutrition._id}]);
  await ActivityHistory.insertMany([{user:user._id,action:'created_habit',targetType:'Habit',targetId:habits[0]._id},{user:user._id,action:'completed_habit',targetType:'HabitCompletion',targetId:inserted[0]._id}]);
  return {message:'Database seeded successfully.',counts:{categories:categories.length,users:users.length,habits:habits.length,completions:inserted.length,tips:5,activities:2}};
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
