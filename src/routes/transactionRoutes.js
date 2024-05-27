const express = require('express');
const prisma = require('../models/prisma');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a transaction
router.post('/', authenticateToken, async (req, res) => {
  const { amount, type, categoryId } = req.body;
  const userId = req.user.userId;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        categoryId,
        userId,
      },
    });

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get all transactions for a user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Update a transaction
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { amount, type, categoryId } = req.body;
  const userId = req.user.userId;

  try {
    const transaction = await prisma.transaction.updateMany({
      where: { id: parseInt(id), userId },
      data: { amount, type, categoryId },
    });

    if (transaction.count === 0) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const transaction = await prisma.transaction.deleteMany({
      where: { id: parseInt(id), userId },
    });

    if (transaction.count === 0) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
