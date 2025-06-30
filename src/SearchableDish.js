import React, { useState } from 'react';

export default function SearchBar({ data }) {
  //Holds user text input and values matching query
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

//Updates query state with current text
  const handleChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    // Filter 5 suggestions based on input & resets to empty array when cleared
    if (input.length > 0) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  //Reset &clear suggestion list
  const handleSelect = (value) => {
    setQuery(value);
    setSuggestions([]);
  };

  return (
    <div className="search-bar" style={{ position: 'relative', flex: 1 }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search Dish Name"
        className="search-input"
        autoComplete="off"
      />

      {/* drop down list of suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((item, index) => (
          <li key={index} onClick={() => handleSelect(item)}>
          {item}
         </li>
          ))}
        </ul>
      )}
    </div>
  );
}