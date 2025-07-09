const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Mock food dataset — can be replaced with real DB/API later
const mockFoods = [
  {
    name: "Pad Thai",
    origin: "Thailand",
    description: "A stir-fried rice noodle dish commonly served as street food.",
    ingredients: ["Rice noodles", "Shrimp", "Peanuts", "Eggs", "Bean sprouts"],
    culture: "Very popular in Thai cuisine, often eaten with lime and chili flakes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/32/Pad_Thai_kung_Chang_Khong.jpg"
  },
  {
    name: "Biryani",
    origin: "India",
    description: "A mixed rice dish made with spices, rice, and meat or vegetables.",
    ingredients: ["Rice", "Spices", "Chicken", "Yogurt", "Onions"],
    culture: "Served during festivals and celebrations in South Asia.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Hyderabadi_Chicken_Biryani.jpg"
  },
  {
    name: "Tacos",
    origin: "Mexico",
    description: "A traditional Mexican dish consisting of a small hand-sized corn or wheat tortilla topped with a filling.",
    ingredients: ["Tortilla", "Beef", "Lettuce", "Cheese", "Salsa"],
    culture: "Common street food and a staple of Mexican cuisine.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/57/Tacos_de_Carnitas.jpg"
  }
];

// API endpoint to search for a dish by name
app.get('/api/foods', (req, res) => {
  const query = req.query.name;
  if (!query) return res.status(400).json({ error: 'No dish name provided.' });

  const found = mockFoods.find(food =>
    food.name.toLowerCase().trim() === query.trim().toLowerCase()
  );

  if (!found) return res.status(404).json({ error: 'Dish not found.' });

  res.json(found);
});

// img stuff
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/recognize', upload.single('image'), (req, res) => {
  console.log('Image received:', req.file.originalname);
  // Replace this dummy logic with actual model or API call
  res.json({ name: 'Biryani' });
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
