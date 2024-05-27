const express = require('express');
const prisma = require('../models/prisma');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a budget
router.post('/', authenticateToken, async (req, res) => {
  const { amount, categoryId, startDate, endDate } = req.body;
  const userId = req.user.userId;

  try {
    const budget = await prisma.budget.create({
      data: {
        amount,
        categoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
    });

    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Get all budgets for a user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Update a budget
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { amount, categoryId, startDate, endDate } = req.body;
  const userId = req.user.userId;

  try {
    const budget = await prisma.budget.updateMany({
      where: { id: parseInt(id), userId },
      data: { amount, categoryId, startDate: new Date(startDate), endDate: new Date(endDate) },
    });

    if (budget.count === 0) {
      return res.status(404).json({ error: 'Budget not found or not authorized' });
    }

    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete a budget
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const budget = await prisma.budget.deleteMany({
      where: { id: parseInt(id), userId },
    });

    if (budget.count === 0) {
      return res.status(404).json({ error: 'Budget not found or not authorized' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

module.exports = router;
