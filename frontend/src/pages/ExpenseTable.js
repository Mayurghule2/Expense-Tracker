import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {
  return (
    <div className="relative transform translate-x-1/2 p-4 w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl rounded-md">
      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 font-medium">No transactions yet.</p>
      ) : (
        expenses.map((expense, index) => (
          <div key={index} className="expense-item grid grid-cols-6 items-center gap-y-4 py-2 border-b border-gray-700">
            
            {/* Delete Button */}
            <div>
              <button
                className="bg-red-700 text-white px-2 lg:px-3 py-1 text-sm rounded font-semibold"
                onClick={() => deleteExpens(expense._id)}
              >
                X
              </button>
            </div>

            {/* Description */}
            <div className="col-span-3 font-medium text-white pl-2 lg:pl-0">
              {expense.text}
            </div>

            {/* Type Badge */}
            <div className="text-sm text-white font-semibold">
              {expense.type === 'income' ? (
                <span className="bg-green-600 px-2 py-1 rounded-full text-xs">Income</span>
              ) : (
                <span className="bg-red-600 px-2 py-1 rounded-full text-xs">Expense</span>
              )}
            </div>

            {/* Amount */}
            <div
              className="font-semibold text-right text-white"
              style={{ color: expense.type === 'income' ? '#22C55E' : '#EF4444' }}
            >
              ₹{expense.amount}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseTable;
