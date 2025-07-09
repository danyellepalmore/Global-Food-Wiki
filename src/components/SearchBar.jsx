import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = forwardRef(({ data }, ref) => {
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

  const handleChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 0) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
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
    <form onSubmit={handleSubmit} className="relative w-full">
  <div className="relative">
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search for a dish"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    {suggestions.length > 0 && (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-md z-50 max-h-48 overflow-y-auto">
        {suggestions.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSelect(item)}
            className="px-4 py-2 cursor-pointer hover:bg-green-100"
          >
            {item}
          </div>
        ))}
      </div>
    )}
  </div>
</form>

  );
});

export default SearchBar;
