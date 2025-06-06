import React, { useEffect, useState } from 'react';

const SpendingLimit = ({ userId }) => {
  const [limit, setLimit] = useState('');
  const [currentLimit, setCurrentLimit] = useState(0);

  // Fetch current limit
  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setCurrentLimit(data.spendingLimit || 0);
      } catch (err) {
        console.error('Error fetching limit', err);
      }
    };
    fetchLimit();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/set-limit/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: Number(limit) }),
      });
      const data = await res.json();
      setCurrentLimit(data.user.spendingLimit);
      setLimit('');
      alert('Spending limit updated!');
    } catch (err) {
      console.error('Error setting limit', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Monthly Spending Limit</h2>
        
        <p className="mb-4 text-center text-gray-600">
          Current Limit: <strong>₹{currentLimit}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Enter new limit"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Limit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpendingLimit;
