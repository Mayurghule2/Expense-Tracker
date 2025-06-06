import React from "react";

function ExpenseDetails({ incomeAmt, expenseAmt }) {
  const balance = incomeAmt - expenseAmt;

  return (
    <div className="mt-8">
      {/* Balance Display */}
      <div className="text-lg lg:text-2xl font-semibold flex items-center justify-center text-gray-300 mb-6 animate-pulse">
        Your Balance is ₹ {balance}
      </div>

      {/* Income & Expense Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto text-slate-100 px-4">
        {/* Income Box */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="text-xl text-green-400">Income</div>
          <p className="text-2xl font-semibold text-white mt-2">₹{incomeAmt}</p>
        </div>

        {/* Expense Box */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="text-xl text-red-500">Expense</div>
          <p className="text-2xl font-semibold text-white mt-2">₹{expenseAmt}</p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetails;
