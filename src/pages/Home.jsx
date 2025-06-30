// home page content
import React from 'react';
import SearchBar from '../components/SearchBar';
import ImageUpload from '../components/ImageUpload';
import '../styles/App.css'; 
import sampleData from '../data/sampleData';

export default function Home() {
  return (
    <main className="centered-content">
      <h1>Global Food Wikipedia</h1>

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

      <h1>OR</h1>
      <ImageUpload />

      <hr className="section-divider" />

      <section className="bio-section">
        <h2>About This App</h2>
        <p>
          Global Food Wiki is an AI-powered digital food encyclopedia that uses computer vision and NLP
          to identify food items, ingredients, origins, dietary needs, and cultural background.
        </p>
      </section>
    </main>
  );
}
