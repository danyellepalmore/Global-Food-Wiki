import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResultsDisplay = () => {
  const [searchParams] = useSearchParams();
  const dishName = searchParams.get('name') || '';
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  // Wrap fetchData in useCallback so it can be safely used in useEffect deps
  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `http://localhost:5000/api/foods?name=${encodeURIComponent(dishName)}&page=${page}&limit=5`
      );
      if (!response.ok) throw new Error('No results found.');
      const data = await response.json();
      setDishes(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load results.');
      setDishes([]);
      setPagination({ page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  }, [dishName]);

  useEffect(() => {
    if (dishName) {
      // Reset to page 1 when dishName changes
      fetchData(1);
    }
  }, [dishName, fetchData]);

  if (!dishName) return <p className="text-red-500">No dish name provided.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md">
      {dishes.length === 0 ? (
        <p>No results found for "{dishName}".</p>
      ) : (
        dishes.map((dish, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{dish.name}</h2>
            {dish.image && (
              <img
                src={dish.image}
                alt={dish.name}
                className="mt-4 w-full max-w-md rounded"
              />
            )}
            {dish.origin && <p><strong>Origin:</strong> {dish.origin}</p>}
            {dish.description && <p>{dish.description}</p>}
            {dish.ingredients?.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Ingredients:</h3>
                <ul className="list-disc ml-6">
                  {dish.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}
            {dish.culture && <p><strong>Cultural Context:</strong> {dish.culture}</p>}
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={pagination.page <= 1}
          onClick={() => fetchData(pagination.page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.pages}</span>
        <button
          disabled={pagination.page >= pagination.pages}
          onClick={() => fetchData(pagination.page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
