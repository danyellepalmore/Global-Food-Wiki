import React, { useRef } from 'react';
import SearchBar from '../components/SearchBar';
import ImageUpload from '../components/ImageUpload';
import '../styles/App.css';
import sampleData from '../data/sampleData';
import logo from '../assets/GlobalFoodWikilogo.png';

export default function Home() {
  const searchRef = useRef();

  const handleClick = () => {
    if (searchRef.current) {
      searchRef.current.triggerSearch();
    }
  };

  return (
    <main className="centered-content bg-white text-gray-900 transition-colors duration-300 min-h-screen flex flex-col items-center justify-start">
      <header className="w-full bg-green-600 text-white py-4 shadow-md sticky top-0 z-50 flex justify-center items-center flex-col">
        <h1 className="text-2xl font-bold">Global Food Wiki</h1>
        <h2 className="text-xl font-semibold">Discover Global Dishes</h2>
      </header>

      <section className="py-8 w-full px-4 max-w-4xl mx-auto text-center">

        {/* Wrapped SearchBar in relative container */}
        <div className="search-bar flex flex-col md:flex-row items-center gap-4 justify-center relative">
          <div className="relative w-full max-w-md">
            <SearchBar data={sampleData} ref={searchRef} />
          </div>

          <select className="dropdown border px-3 py-2 rounded-md shadow-md">
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

          <button
            className="search-button bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleClick}
          >
            Search
          </button>
        </div>

        <div className="text-center mt-8">
          <ImageUpload onUploadComplete={handleClick} />
        </div>
      </section>

      <div className="section-divider my-10 border-t border-gray-300 w-full"></div>

      <section className="split-page px-4 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center text-center">
        <div className="left-side">
          <img src={logo} alt="Global Food Wiki Logo" className="w-full max-w-xs mx-auto" />
        </div>
        <div className="right-side">
          <h2 className="text-2xl font-semibold mb-2">About This App</h2>
          <p>
            Global Food Wiki is an AI-powered digital food encyclopedia. Users can search for dishes by name or image to
            explore detailed cultural and culinary information.
          </p>
        </div>
      </section>
    </main>
  );
}
