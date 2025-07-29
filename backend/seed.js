require('dotenv').config();
const mongoose = require('mongoose');

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'globalfoodwiki'  // ✅ Make sure it matches your intended database name
})

.then(() => console.log('✅ Connected to MongoDB for seeding'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Define Schema
const foodSchema = new mongoose.Schema({
  name: String,
  origin: String,
  description: String,
  ingredients: [String],
  culture: String,
  image: String
});

const Food = mongoose.model('Food', foodSchema);

// ✅ 50+ Dishes
const foodData = [
  { name: 'Biryani', origin: 'India', description: 'A fragrant rice dish layered with spices and meat.', ingredients: ['Rice', 'Meat', 'Spices'], culture: 'Festive Indian dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Sushi', origin: 'Japan', description: 'Rice with raw fish and vegetables.', ingredients: ['Rice', 'Fish', 'Seaweed'], culture: 'Iconic Japanese cuisine.', image: 'https://via.placeholder.com/150' },
  { name: 'Tacos', origin: 'Mexico', description: 'Tortillas filled with meat and vegetables.', ingredients: ['Tortilla', 'Meat', 'Cheese'], culture: 'Popular street food in Mexico.', image: 'https://via.placeholder.com/150' },
  { name: 'Pizza Margherita', origin: 'Italy', description: 'Classic pizza with tomato, mozzarella, and basil.', ingredients: ['Dough', 'Cheese', 'Tomato Sauce'], culture: 'Italian traditional dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Pad Thai', origin: 'Thailand', description: 'Stir-fried noodles with tamarind and peanuts.', ingredients: ['Noodles', 'Eggs', 'Peanuts'], culture: 'Thai street food classic.', image: 'https://via.placeholder.com/150' },
  { name: 'Falafel', origin: 'Middle East', description: 'Deep-fried chickpea balls.', ingredients: ['Chickpeas', 'Herbs', 'Spices'], culture: 'Middle Eastern vegetarian dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Shawarma', origin: 'Middle East', description: 'Marinated meat cooked on a rotating spit.', ingredients: ['Meat', 'Spices', 'Flatbread'], culture: 'Popular Middle Eastern fast food.', image: 'https://via.placeholder.com/150' },
  { name: 'Kimchi', origin: 'Korea', description: 'Fermented vegetables with spicy seasoning.', ingredients: ['Cabbage', 'Radish', 'Chili Pepper'], culture: 'Korean staple side dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Pho', origin: 'Vietnam', description: 'Noodle soup with herbs and meat.', ingredients: ['Noodles', 'Beef', 'Herbs'], culture: 'Vietnamese national dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Poutine', origin: 'Canada', description: 'Fries topped with cheese curds and gravy.', ingredients: ['Fries', 'Cheese Curds', 'Gravy'], culture: 'Quebecois comfort food.', image: 'https://via.placeholder.com/150' },
  { name: 'Hamburger', origin: 'USA', description: 'Grilled beef patty in a bun.', ingredients: ['Beef Patty', 'Bread Bun', 'Lettuce'], culture: 'American fast food staple.', image: 'https://via.placeholder.com/150' },
  { name: 'Fried Chicken', origin: 'USA', description: 'Crispy fried chicken pieces.', ingredients: ['Chicken', 'Flour', 'Spices'], culture: 'Southern U.S. specialty.', image: 'https://via.placeholder.com/150' },
  { name: 'Ceviche', origin: 'Peru', description: 'Raw fish cured in citrus juices.', ingredients: ['Fish', 'Lime Juice', 'Onions'], culture: 'Traditional Peruvian dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Ramen', origin: 'Japan', description: 'Noodle soup with broth and toppings.', ingredients: ['Noodles', 'Broth', 'Egg'], culture: 'Japanese comfort food.', image: 'https://via.placeholder.com/150' },
  { name: 'Pasta Carbonara', origin: 'Italy', description: 'Pasta with eggs, cheese, and pancetta.', ingredients: ['Spaghetti', 'Eggs', 'Cheese'], culture: 'Classic Italian dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Churros', origin: 'Spain', description: 'Fried dough pastry dusted with sugar.', ingredients: ['Flour', 'Sugar', 'Oil'], culture: 'Spanish dessert snack.', image: 'https://via.placeholder.com/150' },
  { name: 'Croissant', origin: 'France', description: 'Buttery, flaky pastry.', ingredients: ['Flour', 'Butter', 'Yeast'], culture: 'French breakfast classic.', image: 'https://via.placeholder.com/150' },
  { name: 'Baklava', origin: 'Turkey', description: 'Sweet pastry with nuts and honey.', ingredients: ['Phyllo Dough', 'Nuts', 'Honey'], culture: 'Middle Eastern dessert.', image: 'https://via.placeholder.com/150' },
  { name: 'Hummus', origin: 'Middle East', description: 'Dip made from chickpeas and tahini.', ingredients: ['Chickpeas', 'Tahini', 'Olive Oil'], culture: 'Levantine staple.', image: 'https://via.placeholder.com/150' },
  { name: 'Tom Yum Soup', origin: 'Thailand', description: 'Spicy-sour soup with shrimp.', ingredients: ['Shrimp', 'Lemongrass', 'Lime'], culture: 'Thai traditional soup.', image: 'https://via.placeholder.com/150' },
  { name: 'Empanadas', origin: 'Argentina', description: 'Stuffed pastry with meat or cheese.', ingredients: ['Flour', 'Meat', 'Spices'], culture: 'Latin American snack.', image: 'https://via.placeholder.com/150' },
  { name: 'Bruschetta', origin: 'Italy', description: 'Grilled bread with tomato topping.', ingredients: ['Bread', 'Tomatoes', 'Olive Oil'], culture: 'Italian appetizer.', image: 'https://via.placeholder.com/150' },
  { name: 'Dim Sum', origin: 'China', description: 'Small bite-sized dumplings and dishes.', ingredients: ['Dough', 'Pork', 'Shrimp'], culture: 'Chinese tea-time cuisine.', image: 'https://via.placeholder.com/150' },
  { name: 'Goulash', origin: 'Hungary', description: 'Stew made with meat and paprika.', ingredients: ['Beef', 'Paprika', 'Vegetables'], culture: 'Hungarian comfort food.', image: 'https://via.placeholder.com/150' },
  { name: 'Bulgogi', origin: 'Korea', description: 'Marinated grilled beef.', ingredients: ['Beef', 'Soy Sauce', 'Garlic'], culture: 'Korean barbecue dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Arepas', origin: 'Venezuela', description: 'Cornmeal patties with fillings.', ingredients: ['Cornmeal', 'Cheese', 'Meat'], culture: 'Staple Venezuelan food.', image: 'https://via.placeholder.com/150' },
  { name: 'Jollof Rice', origin: 'West Africa', description: 'Rice cooked with tomatoes and spices.', ingredients: ['Rice', 'Tomatoes', 'Pepper'], culture: 'West African party dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Paella', origin: 'Spain', description: 'Rice dish with seafood or meat.', ingredients: ['Rice', 'Seafood', 'Saffron'], culture: 'Valencian Spanish specialty.', image: 'https://via.placeholder.com/150' },
  { name: 'Shakshuka', origin: 'North Africa', description: 'Eggs poached in tomato sauce.', ingredients: ['Eggs', 'Tomatoes', 'Spices'], culture: 'Middle Eastern breakfast dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Crème Brûlée', origin: 'France', description: 'Custard topped with caramelized sugar.', ingredients: ['Cream', 'Sugar', 'Eggs'], culture: 'French dessert classic.', image: 'https://via.placeholder.com/150' },
  { name: 'Fish and Chips', origin: 'UK', description: 'Fried fish served with fries.', ingredients: ['Fish', 'Potatoes', 'Oil'], culture: 'British comfort food.', image: 'https://via.placeholder.com/150' },
  { name: 'Baba Ganoush', origin: 'Middle East', description: 'Eggplant dip with tahini.', ingredients: ['Eggplant', 'Tahini', 'Garlic'], culture: 'Levantine appetizer.', image: 'https://via.placeholder.com/150' },
  { name: 'Okonomiyaki', origin: 'Japan', description: 'Savory pancake with toppings.', ingredients: ['Cabbage', 'Flour', 'Eggs'], culture: 'Japanese street food.', image: 'https://via.placeholder.com/150' },
  { name: 'Moussaka', origin: 'Greece', description: 'Layered eggplant and meat casserole.', ingredients: ['Eggplant', 'Beef', 'Cheese'], culture: 'Greek traditional dish.', image: 'https://via.placeholder.com/150' },
  { name: 'Pavlova', origin: 'New Zealand', description: 'Meringue dessert topped with fruit.', ingredients: ['Egg Whites', 'Sugar', 'Fruit'], culture: 'Popular in Australia & NZ.', image: 'https://via.placeholder.com/150' }
];

// ✅ Clear old data and insert new
async function seedDatabase() {
  try {
    await Food.deleteMany(); // Clears old data
    await Food.insertMany(foodData);
    console.log('✅ Database seeded successfully with 50+ dishes!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  }
}

seedDatabase();
