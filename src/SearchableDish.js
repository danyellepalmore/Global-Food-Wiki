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
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      {suggestions.length > 0 && (
        <ul style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid gray', listStyle: 'none', padding: 0, margin: 0 }}>
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)} style={{ padding: '5px', cursor: 'pointer' }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
