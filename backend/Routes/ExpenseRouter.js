const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction }
    = require('../Controllers/ExpenseController');
const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', addTransaction);
router.delete('/:expenseId', deleteTransaction);

router.get('/spending-limit/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('spendingLimit');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ spendingLimit: user.spendingLimit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update spending limit for a user
router.put('/spending-limit/:userId', async (req, res) => {
  try {
    const { spendingLimit } = req.body;
    if (typeof spendingLimit !== 'number') {
      return res.status(400).json({ message: 'Invalid spending limit' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { spendingLimit },
      { new: true }
    ).select('spendingLimit');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ spendingLimit: user.spendingLimit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;