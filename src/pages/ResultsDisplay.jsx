import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const ResultsDisplay = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Support dish name from router state or fallback to URL param
  const dishName = location.state?.dish || searchParams.get("name") || '';

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!dishName) return;

    const fetchDishData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/foods?name=${encodeURIComponent(dishName)}`);
        if (!response.ok) throw new Error('Dish not found.');
        const data = await response.json();
        setDish(data);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchDishData();
  }, [dishName]);

  if (!dishName) return <p className="text-red-500">No dish name provided.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!dish) return <p>No data available for "{dishName}".</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-2">{dish.name}</h2>

      {dish.image && (
        <img src={dish.image} alt={dish.name} className="mt-4 w-full max-w-md rounded" />
      )}

      {dish.origin && (
        <p className="text-gray-700 mt-2"><strong>Origin:</strong> {dish.origin}</p>
      )}

      {dish.description && (
        <p className="mt-2 text-gray-800">{dish.description}</p>
      )}

      {dish.ingredients?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Ingredients:</h3>
          <ul className="list-disc ml-6">
            {dish.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {dish.culture && (
        <p className="mt-2 text-sm text-gray-600"><strong>Cultural Context:</strong> {dish.culture}</p>
      )}
    </div>
  );
};

export default ResultsDisplay;
