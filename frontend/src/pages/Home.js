import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import Analytics from './Analytics';


function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [activePage, setActivePage] = useState('add');

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    useEffect(() => {
    const income = expenses
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + Number(item.amount), 0);

    const exp = expenses
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + Number(item.amount), 0);

    setIncomeAmt(income);
    setExpenseAmt(exp);
}, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }



    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }


    const exportCSV = () => {
  const headers = ['Text', 'Amount', 'Type', 'Date'];
  const rows = expenses.map(exp => [
    exp.text,
    exp.amount,
    exp.type,
    new Date(exp.createdAt).toLocaleDateString()
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `Monthly-Expense-Summary-${new Date().getMonth() + 1}.csv`;
  link.click();
};

 const [spendingLimit, setSpendingLimit] = useState(() => {
    const savedLimit = localStorage.getItem('spendingLimit');
    return savedLimit ? Number(savedLimit) : 0;
  });

  // Save spending limit to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spendingLimit', spendingLimit);
  }, [spendingLimit]);

  // Handler for input change with only positive numbers allowed
  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setSpendingLimit(value);
    }
  };

  // Calculate usage percentage capped at 100%
  const usagePercent = incomeAmt
    ? Math.min((expenseAmt / incomeAmt) * 100, 100)
    : 0;

    useEffect(() => {
        fetchExpenses()
    }, [])

    return (
        <div className='text-gray-300'>
            <div className='user-section flex items-center justify-center gap-4'>
                <h1 className='text-xl lg:text-3xl italic font-bold text-purple-400'>Welcome, {loggedInUser}</h1>
                <button
                className='px-4 py-2 font-semibold text-white rounded-full bg-purple-600 hover:bg-purple-900 shadow-md'
                onClick={handleLogout}>Logout</button>
            </div>
            <ExpenseDetails
                incomeAmt={incomeAmt}
                expenseAmt={expenseAmt}
            />
            
            <h1 className='text-2xl lg:text-4xl font-semibold text-center p-4 w-auto shadow-lg text-gray-300'>
          Expense Tracker
        </h1>
<div className="text-center mt-6 mb-6 px-4">
      <h2 className="text-lg font-semibold text-purple-400 mb-2">
        Spending Limit & Progress
      </h2>

      <div className="flex justify-center items-center gap-3 mb-3">
        <label htmlFor="limit" className="text-white">
          Set Spending Limit:
        </label>
        <input
          id="limit"
          type="number"
          className="px-3 py-1 rounded text-black"
          placeholder="Enter ₹"
          value={spendingLimit}
          onChange={handleLimitChange}
          min="0"
        />
      </div>

      {expenseAmt > spendingLimit && spendingLimit > 0 && (
        <div className="text-red-500 font-semibold">
          🚨 You've exceeded your spending limit of ₹{spendingLimit}!
        </div>
      )}

      <div className="max-w-xl mx-auto mt-4">
        <div className="w-full bg-gray-700 h-5 rounded-lg overflow-hidden">
          <div
            className="bg-red-500 h-5 text-xs text-white text-center"
            style={{ width: `${usagePercent}%` }}
          >
            {incomeAmt > 0 ? `${Math.round(usagePercent)}% used` : '0%'}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-300">
        💰 Income: ₹{incomeAmt} | 💸 Expense: ₹{expenseAmt} | 📊 Limit: ₹{spendingLimit}
      </div>
    </div>

             <div className="flex justify-center items-center space-x-6 mb-4 mt-5">
                
    <button
      onClick={() => setActivePage('add')}
      className="text-white font-semibold hover:text-purple-400 transition duration-200"
    >
      Add Expenses
    </button>
    <button
      onClick={() => setActivePage('show')}
      className="text-white font-semibold hover:text-purple-400 transition duration-200"
    >
      Show Expenses
    </button>
    <button
  onClick={() => setActivePage('analytics')}
  className="text-white font-semibold hover:text-purple-400 transition duration-200"
>
  Analytics
</button>

  <button
    onClick={exportCSV}
    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800 font-medium"
  >
    Download Monthly Summary 
  </button>
    <div className="text-center mt-6">
</div>
  </div>
  {activePage === 'add' && <ExpenseForm addTransaction={addTransaction} />}
{activePage === 'show' && <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />}
{activePage === 'analytics' && (
  <div className="mt-6">
    <Analytics />
  </div>
)}
{activePage === 'profile' && (
  <div className="text-center mt-10 text-lg text-purple-300">
    <p><strong>Name:</strong> {loggedInUser}</p>
    <p><strong>Email:</strong> (Fetch from user data if available)</p>
  </div>
)}

            {/* <ExpenseForm
                addTransaction={addTransaction}  />

            <ExpenseTable
                expenses={expenses}
                deleteExpens={deleteExpens}
            /> */}
            <ToastContainer />
        </div>
    )
}

export default Home