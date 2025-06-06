import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { APIUrl, handleError } from '../utils';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff6384'];

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const url = `${APIUrl}/expenses`;
        const headers = {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        };
        const response = await fetch(url, headers);
        if (response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const result = await response.json();
        setExpenses(result.data || []);
      } catch (err) {
        handleError(err);
      }
    };

    fetchExpenses();
  }, [navigate]);

  const income = expenses.filter((item) => item.type === 'income').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const expense = expenses.filter((item) => item.type === 'expense').reduce((acc, cur) => acc + Number(cur.amount), 0);

  const barData = [
    { name: 'Income', amount: income },
    { name: 'Expense', amount: expense },
  ];
  
  const categoryData = expenses
    .filter((item) => item.type === 'expense')
    .reduce((acc, cur) => {
      const text = cur.text;
      const existing = acc.find((item) => item.name === text);
      if (existing) {
        existing.value += Number(cur.amount);
      } else {
        acc.push({ name: text, value: Number(cur.amount) });
      }
      return acc;
    }, []);

    const groupByMonth = (transactions) => {
    const map = {};

    transactions.forEach(tx => {
      const date = new Date(tx.createdAt);
      const month = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;

      if (!map[month]) {
        map[month] = { month, income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        map[month].income += Number(tx.amount);
      } else {
        map[month].expense += Number(tx.amount);
      }
    })

     return Object.values(map).sort((a, b) => {
      const [aMonth, aYear] = a.month.split('-');
      const [bMonth, bYear] = b.month.split('-');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });
  }
    
  return (
    <div className="text-gray-300 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-400">Expense Analysis</h2>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Income vs Expense */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-300">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-300">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
