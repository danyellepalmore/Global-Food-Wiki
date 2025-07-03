import React from 'react';
import '../styles/App.css';
import SearchBar from '../components/SearchBar';
import sampleData from '../data/sampleData'; // Sample data for search bar

const DishResult = () => {
  // Simulated data
  const foodData = {
    name: "Apple Pie",
    ingredients: [
      "Pie Crust", "Apples", "Granulated Sugar", "Brown Sugar",
      "Nutmeg", "Lemon", "Egg", "Flour", "Cinnamon"
    ],
    origin: "England",
    dietary: "Contains eggs, gluten, soy, and sulphites.",
    culture: "Apple Pie is a classic English dessert that represents a blend of traditional and modern English cuisine."
  };

  return (
    <div className="search-bar">
        <SearchBar data={sampleData} />
    <div className="bg-white text-gray-800 font-sans p-6">
      <div className="max-w-3xl mx-auto shadow-lg rounded-lg border p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Dish Result</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-indigo-600">
            {foodData.name}
          </h2>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Main Ingredients</h3>
          <ul className="list-disc list-inside">
            {foodData.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Origin</h3>
          <p>{foodData.origin}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Dietary Information</h3>
          <p>{foodData.dietary}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Cultural Background</h3>
          <p>{foodData.culture}</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DishResult;