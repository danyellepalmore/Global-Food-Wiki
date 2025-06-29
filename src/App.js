import ImageUpload from "./Image.Upload"; 
import SearchBar from "./SearchableDish";
import './App.css';

const sampleData = [
  "Pizza",
  "Burger",
  "Pasta",
  "Salad",
  "Sushi",
  "Tacos",
  "Steak",
  "Sandwich",
  "Soup",
  "Dessert"
]; // Sample data for the search bar

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src="GlobalFoodWikilogo.png" alt="Global Food Wiki Logo" className="logo" />
        <a href="/feedback" className="feedback-link">Provide Feedback</a>
      </header>

      <h1>Find Dish Contents </h1>
        <input
          type="text"
          id="dishInput"
          placeholder="Enter dish name"
        />
      <SearchBar data={sampleData} />
      <div className="search-result">
          <h2>Dish Information</h2>
          <p>Enter a dish name to see its details.</p>
        </div>        
      <h1>OR</h1>
      <ImageUpload />

      <div className="bio-section">
        <h2> About This App</h2>
        <p> Global Food Wiki is an AI-powered digital food encyclopedia 
          with special camera features that allow for image recognition and Natural Language Processing
          to correctly identify food items, dishes. This product provides users with detailed lists of 
          ingredients, origin information, dietary needs, and its cultural background. It combines natural 
          language processing with computer vision, and incorporates cloud technologies all within the product 
          making it user friendly.</p>
        </div>
      </div>
  );
}
// This is the main App component that includes the ImageUpload component and a section for dish information

export default App;
