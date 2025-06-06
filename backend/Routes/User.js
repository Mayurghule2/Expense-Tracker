router.put('/set-limit/:userId', async (req, res) => {
  const { userId } = req.params;
  const { limit } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { spendingLimit: limit }, { new: true });
    res.json({ message: 'Limit set successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error setting limit' });
  }
});