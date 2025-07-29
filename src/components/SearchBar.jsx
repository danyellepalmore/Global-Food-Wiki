import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = forwardRef((props, ref) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const triggerSearch = () => {
    if (!query.trim()) return;
    navigate(`/results?name=${encodeURIComponent(query)}`);
  };

  useImperativeHandle(ref, () => ({
    triggerSearch,
  }));

  const handleChange = async (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 0) {
      try {
        const res = await fetch(`http://localhost:5000/api/suggestions?q=${encodeURIComponent(input)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (value) => {
    setQuery(value);
    setSuggestions([]);
    navigate(`/results?name=${encodeURIComponent(value)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a dish"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {suggestions.length > 0 && (
        // included CSS for dropdown when viewing suggestions
        <ul className="suggestions-dropdown absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-50 max-h-40 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-green-100 cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
});

export default SearchBar;
