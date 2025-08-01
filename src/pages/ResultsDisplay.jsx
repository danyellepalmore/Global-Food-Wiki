
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/App.css';
import SearchBar from '../components/SearchBar';
import sampleData from '../data/sampleData'; // only used for placeholder search bar props

const proxySrc = (url) =>
  `http://localhost:5000/api/img?u=${encodeURIComponent(url)}`;

const FALLBACK_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="#6b7280" font-family="Arial, Helvetica, sans-serif" font-size="20">
        Image unavailable
      </text>
    </svg>`
  );

const ResultsDisplay = () => {
  const [searchParams] = useSearchParams();
  const dishName = searchParams.get('name') || '';
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(
          `http://localhost:5000/api/foods?name=${encodeURIComponent(dishName)}&page=${page}&limit=5`
        );
        if (!response.ok) throw new Error('No results found.');
        const data = await response.json();
        setDishes(data.results || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      } catch (err) {
        setError(err.message || 'Error loading results.');
      } finally {
        setLoading(false);
      }
    },
    [dishName]
  );

  useEffect(() => {
    if (dishName) fetchData(1);
  }, [dishName, fetchData]);

  if (!dishName) return <p className="text-red-500">No dish name provided.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="results" style={{ backgroundColor: '#283618', color: '#f0eeea' }}>
      <div className="search-bar">
        <SearchBar data={sampleData} />
        <select className="dropdown">
          <option value="">Select Language or Region</option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="hindi">Hindi</option>
          <option value="chinese">Chinese</option>
          <option value="arabic">Arabic</option>
          <option value="african_american">African American</option>
          <option value="latino">Latino</option>
          <option value="native_american">Native American</option>
        </select>
        <button className="search-button">Search</button>
      </div>
      {dishes.length === 0 ? (
        <p>No results found for "{dishName}".</p>
      ) : (
        dishes.map((dish, index) => {
          const key = dish._id || `${dish.name}-${index}`;
          const originalUrl = dish.image || '';
          const proxiedUrl = originalUrl ? proxySrc(originalUrl) : '';

          return (
            <div className="split-page" key={key}>
              <div className="right-side">
                <div className="item-description">
                  <h1 className="result-header">{dish.name}</h1>
                  <p>This dish information is provided by an AI model and may not be 100% accurate.</p>

                  {dish.origin && <p><strong>Origin:</strong> {dish.origin}</p>}
                  {dish.region && <p><strong>Region:</strong> {dish.region}</p>}
                  {dish.description && <p>{dish.description}</p>}

                  {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 && (
                    <div className="mt-2">
                      <h3>Ingredients:</h3>
                      <ul className="list-disc list-inside">
                        {dish.ingredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {dish.culture && <p><strong>Cultural Context:</strong> {dish.culture}</p>}
                  {Array.isArray(dish.dietary) && dish.dietary.length > 0 && (
                    <p><strong>Dietary:</strong> {dish.dietary.join(', ')}</p>
                  )}
                  {Array.isArray(dish.tags) && dish.tags.length > 0 && (
                    <p><strong>Tags:</strong> {dish.tags.join(', ')}</p>
                  )}
                  {Array.isArray(dish.sources) && dish.sources.length > 0 && (
                    <div className="mt-2">
                      <strong>Sources:</strong>{' '}
                      {dish.sources.map((url, i) => (
                        <a
                          key={`${key}-src-${i}`}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-300 underline mr-2"
                        >
                          {(() => {
                            try {
                              return new URL(url).hostname;
                            } catch {
                              return url;
                            }
                          })()}
                        </a>
                      ))}
                    </div>
                  )}

                  {dish.nutrition && (
                    <div className="mt-3">
                      <h3>Nutrition (approx.):</h3>
                      <ul className="list-disc list-inside">
                        {dish.nutrition.calories != null && <li>Calories: {dish.nutrition.calories}</li>}
                        {dish.nutrition.protein && <li>Protein: {dish.nutrition.protein}</li>}
                        {dish.nutrition.carbs && <li>Carbs: {dish.nutrition.carbs}</li>}
                        {dish.nutrition.fat && <li>Fat: {dish.nutrition.fat}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="left-side">
                {dish.image ? (
                  <img
                    src={proxiedUrl}
                    alt={dish.name || "Dish"}
                    className="image-preview"
                    style={{ objectFit: 'cover', width: '100%', maxWidth: '600px', borderRadius: '8px' }}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.triedDirect && dish.image) {
                        e.currentTarget.dataset.triedDirect = '1';
                        e.currentTarget.src = dish.image;
                        return;
                      }
                      e.currentTarget.src = FALLBACK_PLACEHOLDER;
                    }}
                  />
                ) : (
                  <h1>No image available</h1>
                )}
              </div>
            </div>
          );
        })
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={pagination.page <= 1}
          onClick={() => fetchData(pagination.page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
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
