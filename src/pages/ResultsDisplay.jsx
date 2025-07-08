import '../styles/App.css';
import SearchBar from '../components/SearchBar';
import sampleData from '../data/sampleData'; // Sample data for search bar
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Hook to navigate to results page

const DishResult = () => {
  const location = useLocation();
  const uploadedImage = location.state?.image; // Get uploaded image from state
  
  // Function to handle search button click
   const navigate = useNavigate(); // Hook to navigate to results page
  // Log activity and redirect to Results page
  const handleSearch = () => {
  console.log("Simulating search");
  navigate('/results');
  };

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
    <div className='results'>
      <div className="search-bar">
        <SearchBar data={sampleData} />
        {/* No functionality yet */}
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
        {/* Simulate functionality */}
        <button className="search-button"
          onClick={() => handleSearch()}>
          Search
        </button>
      </div>
      <div className="split-page">
        <div className="right-side">
          <div className="item-description">
          <h1>{foodData.name}</h1>
            <p>This dish information
              is provided by an API or AI model
              and is not guaranteed to be accurate.
            </p>

            <h3>Main Ingredients</h3>
            <ul className="list-disc list-inside">
              {foodData.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>

            <h3>Origin</h3>
            <p>{foodData.origin}</p>

            <h3>Dietary Information</h3>
            <p>{foodData.dietary}</p>

            <h3 >Cultural Background</h3>
            <p>{foodData.culture}</p>
          </div>
        </div>

        <div className='left-side'>
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded Food" className="image-preview" style={{objectFit: "cover"}} />
          ) : (
            <h1>No image uploaded</h1>
          )}
        </div>
      </div>
      
      <div className="centered-content" style={{ backgroundColor: "#f0eee0" }}>
        <h1>Dish Contents Placeholder</h1>
      </div>
    </div>
      
  );
};

export default DishResult;