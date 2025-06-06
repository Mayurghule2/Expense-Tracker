import React, { useEffect, useState } from 'react';
import { APIUrl, handleError } from '../utils';

function SpendingProgress() {
  const [expenses, setExpenses] = useState([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);
  const [spendingLimit, setSpendingLimit] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${APIUrl}/expenses`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      const result = await response.json();
      const allExpenses = result.data;

      setExpenses(allExpenses);

      const income = allExpenses
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + Number(item.amount), 0);
      const expense = allExpenses
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + Number(item.amount), 0);

      setIncomeAmt(income);
      setExpenseAmt(expense);
    } catch (err) {
      handleError(err);
    }
  };

  const handleLimitChange = (e) => {
    setSpendingLimit(Number(e.target.value));
  };

  const percentUsed = incomeAmt ? Math.min((expenseAmt / incomeAmt) * 100, 100) : 0;

  return (
    <div className="text-gray-300 px-4 pt-6">
      <h1 className="text-2xl font-bold text-purple-400 text-center mb-6">Spending Limit & Progress</h1>

      <div className="flex justify-center gap-4 items-center mb-6">
        <label htmlFor="limit" className="text-lg">Set Spending Limit:</label>
        <input
          id="limit"
          type="number"
          className="p-2 rounded text-black"
          placeholder="Enter limit in ₹"
          value={spendingLimit}
          onChange={handleLimitChange}
        />
      </div>

      {expenseAmt > spendingLimit && spendingLimit > 0 && (
        <div className="text-red-500 font-bold text-center mb-4">
          🚨 You’ve exceeded your spending limit of ₹{spendingLimit}!
        </div>
      )}

      <div className="w-full max-w-xl mx-auto mt-4">
        <h2 className="text-center mb-2 text-purple-300 font-semibold">Expense vs Income</h2>
        <div className="w-full bg-gray-700 h-6 rounded-lg overflow-hidden">
          <div
            className="bg-red-500 h-6 text-xs text-center text-white"
            style={{ width: `${percentUsed}%` }}
          >
            {incomeAmt > 0 ? `${Math.round(percentUsed)}% used` : '0%'}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p>💰 Total Income: ₹{incomeAmt}</p>
        <p>💸 Total Expense: ₹{expenseAmt}</p>
        <p>📊 Spending Limit: ₹{spendingLimit}</p>
      </div>
    </div>
  );
}

export default SpendingProgress;
