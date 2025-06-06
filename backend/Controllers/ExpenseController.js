const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
  const { _id } = req.user;
  const { text, amount, type } = req.body;

  console.log(_id, req.body);

  // Validate input
  if (!text || !amount || !type) {
    return res.status(400).json({
      message: "All fields (text, amount, type) are required.",
      success: false,
    });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({
      message: "Type must be either 'income' or 'expense'.",
      success: false,
    });
  }

  try {
    const userData = await UserModel.findByIdAndUpdate(
      _id,
      {
        $push: {
          expenses: {
            text,
            amount,
            type,
          },
        },
      },
      { new: true } // Return updated user
    );

    res.status(200).json({
      message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
      success: true,
      data: userData?.expenses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};


const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findById(_id).select('expenses');
        res.status(200)
            .json({
                message: "Fetched Expenses successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense Deleted successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
}