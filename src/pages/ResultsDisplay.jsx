// src/pages/ResultsDisplay.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// Use the backend proxy first to avoid hotlink/CORS issues
const proxySrc = (url) =>
  `http://localhost:5000/api/img?u=${encodeURIComponent(url)}`;

// Lightweight inline placeholder (no network)
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

// Strict image sizing: contains inside a sensible box and centers it
const imgStyle = {
  width: '100%',
  maxWidth: '720px',   // cap width on large screens
  maxHeight: '420px',  // keep a short-ish aspect height
  objectFit: 'contain',
  display: 'block',
  margin: '1rem auto',
  borderRadius: '8px',
};

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
          `http://localhost:5000/api/foods?name=${encodeURIComponent(
            dishName
          )}&page=${page}&limit=5`
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
    <div className="bg-white p-6 rounded shadow-md">
      {dishes.length === 0 ? (
        <p>No results found for "{dishName}".</p>
      ) : (
        dishes.map((dish, index) => {
          const key = dish._id || `${dish.name}-${index}`;
          const originalUrl = dish.image || '';
          const proxiedUrl = originalUrl ? proxySrc(originalUrl) : '';

          return (
            <div key={key} className="mb-8 border-b pb-6">
              <h2 className="text-2xl font-bold mb-2">{dish.name}</h2>

              {/* Image: try proxy -> direct -> inline placeholder (all with strict sizing) */}
              {originalUrl ? (
                <img
                  src={proxiedUrl}
                  alt={dish.name}
                  style={imgStyle}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Step 1: if the proxy fails, try direct URL once
                    if (!e.currentTarget.dataset.triedDirect) {
                      e.currentTarget.dataset.triedDirect = '1';
                      e.currentTarget.src = originalUrl;
                      return;
                    }
                    // Step 2: if direct fails too, show inline placeholder
                    if (e.currentTarget.src !== FALLBACK_PLACEHOLDER) {
                      e.currentTarget.src = FALLBACK_PLACEHOLDER;
                    }
                  }}
                />
              ) : (
                <img
                  src={FALLBACK_PLACEHOLDER}
                  alt="No image available"
                  style={imgStyle}
                />
              )}

              <div className="mt-3 space-y-1">
                {dish.origin && (
                  <p>
                    <strong>Origin:</strong> {dish.origin}
                  </p>
                )}
                {dish.region && (
                  <p>
                    <strong>Region:</strong> {dish.region}
                  </p>
                )}
                {dish.description && <p>{dish.description}</p>}
              </div>

              {Array.isArray(dish.aliases) && dish.aliases.length > 0 && (
                <p className="mt-2">
                  <strong>Also known as:</strong> {dish.aliases.join(', ')}
                </p>
              )}

              {Array.isArray(dish.ingredients) && dish.ingredients.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold">Ingredients:</h3>
                  <ul className="list-disc ml-6">
                    {dish.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(dish.dietary) && dish.dietary.length > 0 && (
                <p className="mt-2">
                  <strong>Dietary:</strong> {dish.dietary.join(', ')}
                </p>
              )}

              {dish.culture && (
                <p className="mt-2">
                  <strong>Cultural Context:</strong> {dish.culture}
                </p>
              )}

              {Array.isArray(dish.tags) && dish.tags.length > 0 && (
                <p className="mt-2">
                  <strong>Tags:</strong> {dish.tags.join(', ')}
                </p>
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
                      className="text-blue-600 underline mr-2"
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
                  <h3 className="font-semibold">Nutrition (approx.):</h3>
                  <ul className="list-disc ml-6">
                    {dish.nutrition.calories != null && (
                      <li>Calories: {dish.nutrition.calories}</li>
                    )}
                    {dish.nutrition.protein && (
                      <li>Protein: {dish.nutrition.protein}</li>
                    )}
                    {dish.nutrition.carbs && (
                      <li>Carbs: {dish.nutrition.carbs}</li>
                    )}
                    {dish.nutrition.fat && <li>Fat: {dish.nutrition.fat}</li>}
                  </ul>
                </div>
              )}
            </div>
          );
        })
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
