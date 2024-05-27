const express = require('express');
const prisma = require('../models/prisma');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get monthly financial report for all transactions
router.get('/monthly', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    let currentDate = new Date();
    let { month, year } = req.query;

    if (!month || !year) {
      // Use current month and year if not provided in query parameters
      month = currentDate.getMonth() + 1; 
      year = currentDate.getFullYear();
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const report = {
      totalIncome: 0,
      totalExpense: 0,
      netIncome: 0,
    };

    transactions.forEach((transaction) => {
      if (transaction.type === 'INCOME') {
        report.totalIncome += transaction.amount;
      } else if (transaction.type === 'EXPENSE') {
        report.totalExpense += transaction.amount;
      }
    });

    report.netIncome = report.totalIncome - report.totalExpense;

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch monthly financial report' });
  }
});

// Get category-wise expense tracking for a specific month
router.get('/category-wise', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    let currentDate = new Date();
    let { month, year, categoryId } = req.query;

    if (!month || !year) {
      // Using current month and year if not provided in query parameters
      month = currentDate.getMonth() + 1;
      year = currentDate.getFullYear();
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const where = {
      userId,
      date: { gte: startOfMonth, lte: endOfMonth },
      type: 'EXPENSE', // Only considering expenses for category-wise report
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
    });

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: endOfMonth },
        endDate: { gte: startOfMonth },
      },
      include: { category: true },
    });

    const categoryExpenses = {};
    transactions.forEach((transaction) => {
      const { name } = transaction.category;
      if (!categoryExpenses[name]) {
        categoryExpenses[name] = { totalSpent: 0, budget: 0 };
      }
      categoryExpenses[name].totalSpent += transaction.amount;
    });

    budgets.forEach((budget) => {
      const { name } = budget.category;
      if (!categoryExpenses[name]) {
        categoryExpenses[name] = { totalSpent: 0, budget: 0 };
      }
      categoryExpenses[name].budget += budget.amount;
    });

    res.json(categoryExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch category-wise expense report' });
  }
});

module.exports = router;
