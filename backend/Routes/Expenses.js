
router.get('/monthly-total/:userId', async (req, res) => {
  const { userId } = req.params;
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const total = await Expense.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startOfMonth, $lte: endOfMonth }
      }
    },
    {
      $group: { _id: null, totalSpent: { $sum: "$amount" } }
    }
  ]);

  res.json({ totalSpent: total[0]?.totalSpent || 0 });
});
