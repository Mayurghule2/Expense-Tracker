import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
  const [expenseInfo, setExpenseInfo] = useState({
    amount: '',
    text: '',
    type: 'expense', // default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseInfo({ ...expenseInfo, [name]: value });
  };

  const addExpenses = (e) => {
    e.preventDefault();
    const { amount, text, type } = expenseInfo;
    if (!amount || !text || !type) {
      handleError('Please add all details');
      return;
    }
    addTransaction({ ...expenseInfo, amount: parseFloat(amount) });
    setExpenseInfo({ amount: '', text: '', type: 'expense' });
  };

  return (
    <div className='flex items-center justify-center'>
      <div className="pb-6 w-full">
        
        <div className='flex items-start justify-center text-center'>
          <form onSubmit={addExpenses} className='pt-5 w-1/3'>
            <div className='text-start mb-2'>
              <label htmlFor='text' className='font-medium text-xl block text-gray-300'>
                Detail
              </label>
              <input
                onChange={handleChange}
                type='text'
                name='text'
                value={expenseInfo.text}
                placeholder='Enter detail...'
                className='bg-gray-700 text-white p-3 rounded-lg w-full'
              />
            </div>
            <div className='text-start mb-2'>
              <label htmlFor='amount' className='font-medium text-xl block text-gray-300'>
                Amount
              </label>
              <input
                onChange={handleChange}
                type='number'
                name='amount'
                value={expenseInfo.amount}
                placeholder='Enter amount...'
                className='bg-gray-700 text-white p-3 rounded-lg w-full'
              />
            </div>
            <div className='text-start mb-4'>
              <label htmlFor='type' className='font-medium text-xl block text-gray-300'>
                Type
              </label>
              <select
                name='type'
                value={expenseInfo.type}
                onChange={handleChange}
                className='bg-gray-700 text-white p-3 rounded-lg w-full'
              >
                <option value='income'>Income</option>
                <option value='expense'>Expense</option>
              </select>
            </div>
            <button type='submit' className='w-full mt-4 bg-purple-600 rounded-lg px-2 py-2 text-white font-semibold hover:bg-purple-800'>
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExpenseForm;
