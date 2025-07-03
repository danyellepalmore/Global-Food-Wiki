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
    <div className='results'>
      <div className="search-bar">
        <SearchBar data={sampleData} />
      </div>
      <div className="split-page">
        <div className="right-side">
        <div className="item-name">
          <h1>Dish Name: {foodData.name}</h1>
          </div>
        <div className="item-description">
          <p>This dish is from this land and from here... this information 
            is provided by an API or AI model
            and is not guaranteed to be accurate.
          </p>


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
        <div className='left-side'>
          <h1>Image Placeholder from homepage image upload</h1>
        </div>
        </div>

        <div className="centered-content" style={{ backgroundColor: "#f0eee0" }}>
          <h1>Dish Contents Placeholder</h1>
      </div>
      </div>
      
  );
};

export default DishResult;