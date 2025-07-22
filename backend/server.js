require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection using .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Food Schema
const foodSchema = new mongoose.Schema({
  name: String,
  origin: String,
  description: String,
  ingredients: [String],
  culture: String,
  image: String
});

const Food = mongoose.model('Food', foodSchema);

// ✅ API: Partial search + Pagination + Sorting
app.get('/api/foods', async (req, res) => {
  const query = req.query.name || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortField = req.query.sort || 'name';

  try {
    const filter = query ? { name: { $regex: query, $options: 'i' } } : {};
    const foods = await Food.find(filter)
      .sort({ [sortField]: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Food.countDocuments(filter);

    res.json({
      results: foods,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ✅ API for suggestions
app.get('/api/suggestions', async (req, res) => {
  const query = req.query.q || '';
  if (!query) return res.json([]);

  try {
    const suggestions = await Food.find({
      name: { $regex: query, $options: 'i' }
    })
      .limit(5)
      .select('name');

    res.json(suggestions.map(item => item.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ✅ Start server
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
