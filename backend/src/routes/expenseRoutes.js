const express = require('express');
const router = express.Router();

// GET /api/expenses - Get all expenses for user
router.get('/', (req, res) => {
  // TODO: Implement get expenses logic
  res.json({ message: 'Get expenses endpoint' });
});

// POST /api/expenses - Create new expense
router.post('/', (req, res) => {
  // TODO: Implement create expense logic
  res.json({ message: 'Create expense endpoint' });
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', (req, res) => {
  // TODO: Implement update expense logic
  res.json({ message: 'Update expense endpoint' });
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', (req, res) => {
  // TODO: Implement delete expense logic
  res.json({ message: 'Delete expense endpoint' });
});

module.exports = router;
