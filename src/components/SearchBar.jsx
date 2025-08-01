// src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!input) return setSuggestions([]);
      try {
        const res = await fetch(`http://localhost:5000/api/suggestions?q=${input}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Suggestion error:', err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) navigate(`/results?name=${encodeURIComponent(input)}`);
  };

  const handleSelect = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]);
    navigate(`/results?name=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="search-bar" style={{ position: 'relative', flex: 1 }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search a dish..."
            className="search-input"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(s)}
                  className="hover:bg-gray-100 cursor-pointer px-4 py-2"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
