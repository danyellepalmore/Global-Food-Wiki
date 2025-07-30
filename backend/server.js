// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // for image uploads

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ----- MongoDB -----
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const foodSchema = new mongoose.Schema({
  name: String,
  origin: String,
  description: String,
  ingredients: [String],
  culture: String,
  image: String
});
const Food = mongoose.model('Food', foodSchema);

// ----- Search w/ pagination + sort -----
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
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('GET /api/foods error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ----- Typeahead suggestions -----
app.get('/api/suggestions', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json([]);

  try {
    const suggestions = await Food.find({ name: { $regex: q, $options: 'i' } })
      .limit(5)
      .select('name');
    res.json(suggestions.map(s => s.name));
  } catch (err) {
    console.error('GET /api/suggestions error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ----- Image recognition (Clarifai REST) -----
app.post('/api/recognize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided.' });

    const {
      CLARIFAI_PAT,
      CLARIFAI_USER_ID = 'clarifai',
      CLARIFAI_APP_ID = 'main',
      CLARIFAI_MODEL_ID = 'food-item-recognition',
      CLARIFAI_MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044',
    } = process.env;

    if (!CLARIFAI_PAT) {
      return res.status(500).json({ error: 'Clarifai PAT missing in .env' });
    }

    const base64 = req.file.buffer.toString('base64');
    const predictUrl = `https://api.clarifai.com/v2/users/${CLARIFAI_USER_ID}/apps/${CLARIFAI_APP_ID}/models/${CLARIFAI_MODEL_ID}/versions/${CLARIFAI_MODEL_VERSION_ID}/outputs`;

    const body = {
      inputs: [
        {
          data: {
            image: { base64 }
          }
        }
      ]
    };

    const cfRes = await fetch(predictUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${CLARIFAI_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const cfJson = await cfRes.json();

    if (!cfRes.ok || !cfJson.outputs || !cfJson.outputs[0]) {
      console.error('Clarifai error response:', JSON.stringify(cfJson));
      const msg =
        cfJson?.status?.description ||
        cfJson?.status?.details ||
        'Clarifai recognition failed.';
      return res.status(502).json({ error: msg });
    }

    const concepts = cfJson.outputs[0]?.data?.concepts || [];
    if (!concepts.length) {
      return res.status(200).json({ name: 'Unknown dish', confidence: 0 });
    }

    const top = concepts[0]; // highest probability concept
    res.json({ name: top.name, confidence: top.value });
  } catch (err) {
    console.error('POST /api/recognize error:', err);
    res.status(500).json({ error: 'Recognition failed.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
