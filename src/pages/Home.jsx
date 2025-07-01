// home page content
import React from 'react';
import SearchBar from '../components/SearchBar';
import ImageUpload from '../components/ImageUpload';
import '../styles/App.css'; 
import sampleData from '../data/sampleData';
import logo from '../assets/GlobalFoodWikilogo.png';


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

      <div className="section-divider"></div>

      <section className="bio-section">
        <div className="bio-section-image">
          <img src={logo} alt="Global Food Wiki Logo" />
        </div>
        <div className="bio-section-text">
          <h2>About This App</h2>
          <p>
            Global Food Wiki, which is essentially an AI-powered digital food encyclopedia with special camera 
            features that allow for image recognition and NLP to correctly identify food items, dishes. 
            The product will provide the user with detailed lists of ingredients, origin information, dietary needs, and its 
            cultural background. It combines natural language processing with computer vision, and incorporates cloud technologies 
            all within the product making it user friendly.
          </p>
          <h2>Commitment to Cultural Equity</h2>
          <p>
            Global Food Wiki is intended for a diverse global audience, including everyday users, students, chefs, 
            health-conscious individuals, and anyone with a curious mind about food. Designed for public use and daily 
            interaction, the platform is built to be both educational and practical. With ongoing feedback and 
            continuous internal enhancements, Global Food Wiki remains a constantly evolving resource for global food discovery.
          </p>
        </div>
      </section>
    </main>
  );
}
