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
  "Soup", 
  'Pad Thai', 
  'Pho', 
  'Pancakes', 
  'Pierogi'
]; // Sample data for the search bar

function App() {
  return (
    //HEADER SECTION: This section contains the logo and a link to provide feedback
    <div className="app-container">

      <header className="app-header">
        {/* not working */}
        <img 
          src="GlobalFoodWikiLogo.png"
          alt="Global Food Wiki logo featuring a stylized globe with utensils, conveying a welcoming and informative atmosphere. No visible text in the logo. The logo is placed in the header of a food encyclopedia web application." 
          className="logo" 
        />
        {/* Will go to Feedback Form Page */}
        <a href="/feedback" className="feedback-link">Provide Feedback</a>
      </header>

      <main className="centered-content">
        <h1>Global Food Wikipedia</h1>

        <div className="search-bar">
          <SearchBar data={sampleData} /> 

        {/* Language/region selection */}
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
      <ImageUpload/>
    </main>

    <hr className="section-divider" />
      {/* About Section: This section provides information about the app */}
        <h2> About This App</h2> 
      <div className="bio-section">

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
