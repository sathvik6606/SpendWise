import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';
import Budget from '../models/budgetModel.js';
import Goal from '../models/goalModel.js';
import Bill from '../models/billModel.js';
import Notification from '../models/notificationModel.js';

const DEMO_EMAIL = 'demo@spendwise.app';
const DEMO_NAME = 'Sathvik Sai';
const DEMO_PASSWORD = 'demo12345';
const currency = 'INR';

const createDate = (monthOffset, day) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + monthOffset, day, 10, 0, 0);
};

const budgets = [
  { category: 'Food', amount: 18000 },
  { category: 'Transportation', amount: 6200 },
  { category: 'Shopping', amount: 14500 },
  { category: 'Bills', amount: 25000 },
  { category: 'Entertainment', amount: 6500 },
  { category: 'Education', amount: 4000 },
  { category: 'Health', amount: 3600 },
];

const seed = async () => {
  await connectDB();
  
  let user = await User.findOne({ email: DEMO_EMAIL.toLowerCase() });
  if (!user) {
    user = await User.create({
      name: DEMO_NAME,
      email: DEMO_EMAIL.toLowerCase(),
      password: DEMO_PASSWORD,
      currency,
      theme: 'dark',
      lastLogin: new Date(),
    });
    console.log('Created demo user', user._id.toString());
  } else {
    user.name = DEMO_NAME;
    user.currency = currency;
    user.theme = 'dark';
    user.password = DEMO_PASSWORD;
    user.lastLogin = new Date();
    await user.save();
    console.log('Demo user already exists, clearing old data...');
    await Promise.all([
      Transaction.deleteMany({ user: user._id }),
      Budget.deleteMany({ user: user._id }),
      Goal.deleteMany({ user: user._id }),
      Bill.deleteMany({ user: user._id }),
      Notification.deleteMany({ user: user._id }),
    ]);
  }

  await seedForUser(user._id);
};

const seedForUser = async (userId) => {
  const transactions = [];

  // Generate 6 months of base data
  for (let m = -5; m <= 0; m++) {
    // Income
    transactions.push({ type: 'income', title: 'Monthly Salary', category: 'Salary', amount: 182500, date: createDate(m, 1), paymentMethod: 'Bank Transfer', notes: 'Salary credited', merchant: 'ABC Corp', isRecurring: m === 0, recurrenceFrequency: 'monthly', nextOccurrence: m === 0 ? createDate(1, 1) : null });
    
    if (m === -5) transactions.push({ type: 'income', title: 'Freelance Design', category: 'Freelance', amount: 28500, date: createDate(m, 7), paymentMethod: 'UPI', merchant: 'Studio North' });
    if (m === -4) transactions.push({ type: 'income', title: 'Cashback Reward', category: 'Refund', amount: 1240, date: createDate(m, 10), paymentMethod: 'Credit Card', merchant: 'Amazon Pay' });
    if (m === -2) transactions.push({ type: 'income', title: 'Bonus', category: 'Bonus', amount: 65000, date: createDate(m, 15), paymentMethod: 'Bank Transfer', merchant: 'ABC Corp' });
    
    // Monthly recurring bills (Expense)
    transactions.push({ type: 'expense', title: 'House Rent', category: 'Bills', amount: 18250, date: createDate(m, 5), paymentMethod: 'Bank Transfer', merchant: 'Landlord', isRecurring: m === 0, recurrenceFrequency: 'monthly', nextOccurrence: m === 0 ? createDate(1, 5) : null });
    transactions.push({ type: 'expense', title: 'Netflix', category: 'Entertainment', amount: 499, date: createDate(m, 15), paymentMethod: 'Card', merchant: 'Netflix', isRecurring: m === 0, recurrenceFrequency: 'monthly', nextOccurrence: m === 0 ? createDate(1, 15) : null });
    transactions.push({ type: 'expense', title: 'Spotify', category: 'Entertainment', amount: 179, date: createDate(m, 18), paymentMethod: 'Card', merchant: 'Spotify', isRecurring: m === 0, recurrenceFrequency: 'monthly', nextOccurrence: m === 0 ? createDate(1, 18) : null });
    transactions.push({ type: 'expense', title: 'Internet', category: 'Bills', amount: 1499, date: createDate(m, 21), paymentMethod: 'Bank Transfer', merchant: 'ACT Fibernet', isRecurring: m === 0, recurrenceFrequency: 'monthly', nextOccurrence: m === 0 ? createDate(1, 21) : null });
    transactions.push({ type: 'expense', title: 'Gym', category: 'Health', amount: 2490, date: createDate(m, 24), paymentMethod: 'Bank Transfer', merchant: 'Fitness First', isRecurring: m === 0, recurrenceFrequency: 'monthly', nextOccurrence: m === 0 ? createDate(1, 24) : null });
  }

  // Helper to add explicit category chunks for month 0 to hit exact %
  const addCategoryChunk = (category, month, targetAmount, chunks) => {
    let currentSum = 0;
    // Check existing transactions for this month/category
    transactions.forEach(t => {
      if (t.type === 'expense' && t.category === category && t.date.getMonth() === createDate(month, 1).getMonth()) {
        currentSum += t.amount;
      }
    });

    let remaining = targetAmount - currentSum;
    if (remaining <= 0) return; // Should not happen with our fixed bills

    for (let i = 0; i < chunks.length; i++) {
      let amt = i === chunks.length - 1 ? remaining : chunks[i].amount;
      transactions.push({
        type: 'expense', category, date: createDate(month, chunks[i].day), amount: amt, title: chunks[i].title, merchant: chunks[i].merchant, paymentMethod: chunks[i].method || 'UPI'
      });
      remaining -= amt;
    }
  };

  // Month 0 Targets
  // Education: 40% of 4000 = 1600
  addCategoryChunk('Education', 0, 1600, [{ day: 5, title: 'Udemy Course', merchant: 'Udemy', amount: 1600 }]);
  
  // Transportation: 62% of 6200 = 3844
  addCategoryChunk('Transportation', 0, 3844, [
    { day: 3, title: 'Uber Ride', merchant: 'Uber', amount: 427 },
    { day: 10, title: 'Fuel Top-up', merchant: 'Indian Oil', amount: 2146 },
    { day: 15, title: 'Ola Commute', merchant: 'Ola', amount: 649 },
    { day: 22, title: 'Metro Recharge', merchant: 'Metro', amount: 622 } // exact remainder
  ]);

  // Food: 78% of 18000 = 14040
  // Insights example: 18% less on Food compared to last month.
  addCategoryChunk('Food', 0, 14040, [
    { day: 2, title: 'Swiggy Order', merchant: 'Swiggy', amount: 1780 },
    { day: 8, title: 'Groceries', merchant: 'D-Mart', amount: 4890 },
    { day: 12, title: 'Zomato Lunch', merchant: 'Zomato', amount: 980 },
    { day: 17, title: 'Domino\'s Pizza', merchant: 'Domino\'s', amount: 1450 },
    { day: 20, title: 'Starbucks Coffee', merchant: 'Starbucks', amount: 427 },
    { day: 25, title: 'Reliance Fresh', merchant: 'Reliance Fresh', amount: 2975 },
    { day: 28, title: 'Weekend Dinner', merchant: 'Swiggy', amount: 1538 } // Remainder
  ]);

  // Month -1 Food Target to be ~18% more (14040 / 0.82 = ~17121.95) Let's make it 17122
  addCategoryChunk('Food', -1, 17122, [
    { day: 2, title: 'Swiggy Order', merchant: 'Swiggy', amount: 2146 },
    { day: 8, title: 'Groceries', merchant: 'D-Mart', amount: 5690 },
    { day: 14, title: 'Family Dinner', merchant: 'Barbeque Nation', amount: 4500 },
    { day: 20, title: 'Zomato', merchant: 'Zomato', amount: 1120 },
    { day: 25, title: 'Starbucks', merchant: 'Starbucks', amount: 649 },
    { day: 28, title: 'Reliance Fresh', merchant: 'Reliance Fresh', amount: 3017 } // Remainder
  ]);

  // Bills: 91% of 25000 = 22750
  // Existing bills for Month 0: Rent(18250) + Internet(1499) = 19749. Remaining = 3001
  addCategoryChunk('Bills', 0, 22750, [
    { day: 12, title: 'Electricity Bill', merchant: 'BESCOM', amount: 2602 },
    { day: 19, title: 'Mobile Recharge', merchant: 'Jio', amount: 399 }
  ]);

  // Entertainment: 100% of 6500 = 6500
  // Existing: Netflix(499) + Spotify(179) = 678. Remaining = 5822
  addCategoryChunk('Entertainment', 0, 6500, [
    { day: 5, title: 'PVR Movies', merchant: 'BookMyShow', amount: 1250 },
    { day: 15, title: 'Steam Game', merchant: 'Steam', amount: 2975 },
    { day: 25, title: 'Concert Tickets', merchant: 'BookMyShow', amount: 1597 }
  ]);

  // Add random natural spending for other categories and previous months
  const randomExpense = (month, category, merchants, min, max) => {
    const amount = Math.floor(Math.random() * (max - min)) + min;
    const day = Math.floor(Math.random() * 27) + 1;
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    transactions.push({ type: 'expense', category, date: createDate(month, day), amount, title: `${merchant} Purchase`, merchant, paymentMethod: ['UPI', 'Card', 'Credit Card'][Math.floor(Math.random() * 3)] });
  };

  const shoppingMerchants = ['Amazon', 'Flipkart', 'Myntra'];
  const transportMerchants = ['Uber', 'Ola', 'Indian Oil'];
  const healthMerchants = ['Apollo Pharmacy', 'Netmeds'];
  const foodMerchants = ['Swiggy', 'Zomato', 'D-Mart', 'Starbucks', "Domino's"];

  for (let m = -5; m < 0; m++) {
    // Generate ~10-12 random expenses per month
    for(let i=0; i<3; i++) randomExpense(m, 'Shopping', shoppingMerchants, 500, 4000);
    for(let i=0; i<3; i++) randomExpense(m, 'Transportation', transportMerchants, 200, 1500);
    if(m < -1) for(let i=0; i<4; i++) randomExpense(m, 'Food', foodMerchants, 300, 2500); // Month -1 Food is set manually above
    for(let i=0; i<2; i++) randomExpense(m, 'Health', healthMerchants, 400, 2000);
    for(let i=0; i<2; i++) randomExpense(m, 'Entertainment', ['BookMyShow', 'PVR'], 500, 1500);
  }
  // Month 0 natural data for unconstrained categories
  for(let i=0; i<3; i++) randomExpense(0, 'Shopping', shoppingMerchants, 1000, 3500);
  for(let i=0; i<2; i++) randomExpense(0, 'Health', healthMerchants, 400, 1200);

  // Set users for all
  transactions.forEach(t => t.user = userId);

  await Transaction.insertMany(transactions);
  
  await Budget.insertMany(budgets.map((item) => ({ ...item, user: userId, period: 'monthly' })));

  const goals = [
    { title: 'Emergency Fund', targetAmount: 500000, currentAmount: 300000, deadline: createDate(8, 10), color: '#0F766E', status: 'active' }, // 60%
    { title: 'MacBook Pro', targetAmount: 260000, currentAmount: 260000, deadline: createDate(1, 12), color: '#2563EB', status: 'completed' }, // 100% completed
    { title: 'Goa Trip', targetAmount: 140000, currentAmount: 91000, deadline: createDate(6, 18), color: '#F59E0B', status: 'active' }, // 65%
    { title: 'New Bike', targetAmount: 175000, currentAmount: 112000, deadline: createDate(12, 5), color: '#7C3AED', status: 'active' }, // 64%
    { title: 'Investment Fund', targetAmount: 1000000, currentAmount: 410000, deadline: createDate(14, 1), color: '#EC4899', status: 'active' }, // 41%
  ];
  await Goal.insertMany(goals.map((item) => ({ ...item, user: userId })));

  const bills = [
    { name: 'House Rent', amount: 18250, dueDate: createDate(0, 5), reminder: true, paid: true, category: 'Housing' },
    { name: 'Electricity', amount: 2602, dueDate: createDate(0, 12), reminder: true, paid: true, category: 'Utilities' },
    { name: 'Internet', amount: 1499, dueDate: createDate(0, 21), reminder: true, paid: true, category: 'Utilities' },
    { name: 'Netflix', amount: 499, dueDate: createDate(0, 15), reminder: true, paid: true, category: 'Subscriptions' },
    { name: 'Spotify', amount: 179, dueDate: createDate(0, 18), reminder: true, paid: true, category: 'Subscriptions' },
    { name: 'Mobile Recharge', amount: 399, dueDate: createDate(0, 19), reminder: true, paid: true, category: 'Utilities' },
    { name: 'Gym', amount: 2490, dueDate: createDate(0, 24), reminder: true, paid: true, category: 'Health' },
    { name: 'Insurance', amount: 12850, dueDate: createDate(1, 5), reminder: true, paid: false, category: 'Insurance' }, // Upcoming
    { name: 'Water Bill', amount: 850, dueDate: createDate(0, -2), reminder: true, paid: false, category: 'Utilities' }, // Overdue
  ];
  await Bill.insertMany(bills.map((item) => ({ ...item, user: userId })));

  const notifications = [
    { type: 'recurring-payment', title: 'Salary credited', message: 'Your salary of ₹1,82,500 has been credited.', link: '/dashboard' },
    { type: 'budget-warning', title: 'Food budget running hot', message: 'Food spending has reached 78% of your monthly budget.', link: '/budgets' },
    { type: 'bill-reminder', title: 'Netflix payment processed', message: 'Your Netflix subscription was successfully processed.', link: '/bills' },
    { type: 'bill-reminder', title: 'Water Bill overdue', message: 'Your Water Bill is still pending and is now overdue.', link: '/bills' },
    { type: 'goal-complete', title: 'Emergency Fund crossed 60%', message: 'Your Emergency Fund is now 60% funded.', link: '/goals' },
    { type: 'budget-exceeded', title: 'Entertainment budget reached 100%', message: 'Entertainment spending has fully consumed the budget.', link: '/budgets' },
    { type: 'monthly-summary', title: 'Monthly report generated', message: 'A fresh monthly summary is ready for review.', link: '/analytics' },
    { type: 'budget-warning', title: 'Transportation budget at 62%', message: 'You have used 62% of your transportation budget this month.', link: '/budgets' },
    { type: 'budget-warning', title: 'Education budget at 40%', message: 'You have used 40% of the education budget this month.', link: '/budgets' },
    { type: 'budget-warning', title: 'Bills budget is 91% used', message: 'Bills spending is nearing the monthly cap.', link: '/budgets' },
    { type: 'goal-complete', title: 'Savings goal completed', message: 'Congratulations! You reached your MacBook Pro savings goal.', link: '/goals' },
    { type: 'recurring-payment', title: 'Recurring payment processed', message: 'Your monthly Rent payment was processed.', link: '/transactions' },
    { type: 'monthly-summary', title: 'Budget successfully created', message: 'Your monthly budgets have been set up.', link: '/budgets' },
    { type: 'bill-reminder', title: 'Insurance premium due soon', message: 'Your insurance premium is due next month.', link: '/bills' },
  ];
  await Notification.insertMany(notifications.map((item, index) => ({ ...item, user: userId, read: index > 5 })));
};

seed()
  .then(() => {
    console.log('Demo seed completed successfully.');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    mongoose.disconnect();
  });
