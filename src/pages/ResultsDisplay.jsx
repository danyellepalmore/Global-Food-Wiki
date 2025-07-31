import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/App.css';



const ResultsDisplay = ({uploadedImage}) => {
  const [searchParams] = useSearchParams();
  const dishName = searchParams.get('name') || '';
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/foods?name=${encodeURIComponent(dishName)}&page=${page}&limit=5`);
      if (!response.ok) throw new Error('No results found.');
      const data = await response.json();
      setDishes(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //initial fetch when dish name appears
  useEffect(() => {
    if (dishName) fetchData();
  }, [dishName]);

  if (!dishName) return <p className="text-red-500">No dish name provided.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="results">
      {/* Future addition: add search bar for re-search feature*/}
      {dishes.length === 0 ? (
        <p>No results found for "{dishName}".</p>
      ) : (
        dishes.map((dish, index) => (
          <div className='split-page' key={index}>
          {/* Right section container for dish information */}
            <div className='right-side'>
              <div className='item-description'>
                <h1>{dish.name}</h1>
                <p>This dish information is provided by an API or AI model and is not guaranteed to be accurate.</p>

            {dish.image && <img src={dish.image} alt={dish.name} className="mt-4 w-full max-w-md rounded" />}
            {dish.origin && <p><strong>Origin:</strong> {dish.origin}</p>}
            {dish.description && <p>{dish.description}</p>}
            {dish.ingredients?.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Ingredients:</h3>
                <ul className="list-disc list-inside">
                  {dish.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}
            {dish.culture && <p><strong>Cultural Context:</strong> {dish.culture}</p>}
          </div>
          </div>

      {/* ✅ Left section: Dish image or fallback */}
            <div className="left-side">
              {dish.image || uploadedImage ? (
                <img
                  src={dish.image || uploadedImage}
                  alt={dish.name || "Uploaded dish"}
                  className="image-preview"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <h1>No image uploaded</h1>
              )}
            </div>
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
