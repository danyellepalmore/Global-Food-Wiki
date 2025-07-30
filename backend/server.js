// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

// ---- Clarifai gRPC SDK ----
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');
const clarifaiStub = ClarifaiStub.grpc();
const clarifaiMeta = new grpc.Metadata();
if (process.env.CLARIFAI_PAT) {
  clarifaiMeta.set('authorization', 'Key ' + process.env.CLARIFAI_PAT);
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---- MongoDB connection ----
const DB_NAME = process.env.MONGO_DB || 'globalfoodwiki';
if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME, // ensure not using "test"
  })
  .then(() => console.log(`Connected to MongoDB (db: ${mongoose.connection.name})`))
  .catch((err) => console.error(' MongoDB connection error:', err));

// ---- Mongoose schema/model ----
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  aliases: [String],
  origin: String,
  region: String,
  description: String,
  ingredients: [String],
  dietary: [String],
  culture: String,
  image: String, // URL
  attribution: String,
  tags: [String],
  sources: [String],
  nutrition: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
  },
});
const Food = mongoose.model('Food', foodSchema);

// ---- Multer (memory) for image upload ----
const upload = multer({ storage: multer.memoryStorage() });

/**
 *GET /api/foods
 */
app.get('/api/foods', async (req, res) => {
  const q = (req.query.name || '').trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortField = req.query.sort || 'name';

  try {
    let filter = {};
    if (q) {
      const regex = { $regex: q, $options: 'i' };
      filter = { $or: [{ name: regex }, { aliases: regex }] };
    }

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

/**
 * GET /api/suggestions?q=...
 */
app.get('/api/suggestions', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);

  try {
    const regex = { $regex: q, $options: 'i' };
    const suggestions = await Food.find(
      { $or: [{ name: regex }, { aliases: regex }] },
      { name: 1, _id: 0 }
    ).limit(5);

    res.json(suggestions.map((s) => s.name));
  } catch (err) {
    console.error('GET /api/suggestions error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * POST /api/recognize
 */
app.post('/api/recognize', upload.single('image'), async (req, res) => {
  try {
    if (!process.env.CLARIFAI_PAT) {
      return res.status(500).json({ error: 'Clarifai PAT missing. Set CLARIFAI_PAT in .env.' });
    }
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const MODEL_ID = process.env.CLARIFAI_MODEL_ID || 'food-item-recognition';
    const MODEL_VERSION_ID = process.env.CLARIFAI_MODEL_VERSION_ID || '1d5fd481e0cf4826aa72ec3ff049e044';

    const imageBase64 = req.file.buffer.toString('base64');

    clarifaiStub.PostModelOutputs(
      {
        user_app_id: {
          user_id: process.env.CLARIFAI_USER_ID || 'clarifai',
          app_id: process.env.CLARIFAI_APP_ID || 'main',
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID,
        inputs: [{ data: { image: { base64: imageBase64 } } }],
      },
      clarifaiMeta,
      async (err, response) => {
        if (err) {
          console.error('Clarifai error:', err);
          return res.status(500).json({ error: 'Clarifai request failed.' });
        }
        if (response.status.code !== 10000) {
          console.error('Clarifai error response:', JSON.stringify(response));
          return res.status(502).json({ error: response.status.description || 'Clarifai error' });
        }

        const concepts = response.outputs?.[0]?.data?.concepts || [];
        if (!concepts.length) {
          return res.json({ name: null, score: null, concepts: [] });
        }

        const top = concepts[0];
        const match = await Food.findOne({
          $or: [
            { name: new RegExp(`^${top.name}$`, 'i') },
            { aliases: new RegExp(`^${top.name}$`, 'i') },
          ],
        });

        if (match) {
          return res.json({
            name: match.name,
            score: top.value,
            match: true,
            record: match,
          });
        }

        res.json({
          name: top.name,
          score: top.value,
          match: false,
          concepts: concepts.slice(0, 5),
        });
      }
    );
  } catch (e) {
    console.error('POST /api/recognize error:', e);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * POST /api/foods/bulk
 */
app.post('/api/foods/bulk', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const ops = items.map((doc) => ({
      updateOne: {
        filter: { name: doc.name },
        update: { $set: doc },
        upsert: true,
      },
    }));

    const result = await Food.bulkWrite(ops, { ordered: false });
    res.json({ ok: true, result });
  } catch (err) {
    console.error('POST /api/foods/bulk error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * GET /api/img?u=<encoded-url>
 * Simple image proxy to avoid hotlink blocking. (Node 18+ for global fetch)
 * Whitelists common hosts to avoid an open proxy.
 * Updated: adds User-Agent and Accept headers to reduce 403/502 upstream.
 */
const ALLOWED_IMG_HOSTS = new Set([
  'upload.wikimedia.org',
  'images.unsplash.com',
  'cdn.pixabay.com',
  'i.imgur.com',
  'commons.wikimedia.org',
  'source.unsplash.com',
]);

app.get('/api/img', async (req, res) => {
  try {
    const u = req.query.u;
    if (!u) return res.status(400).send('Missing url');

    let url;
    try {
      url = new URL(u);
    } catch {
      return res.status(400).send('Invalid url');
    }

    if (!ALLOWED_IMG_HOSTS.has(url.host)) {
      return res.status(400).send('Host not allowed');
    }

    const resp = await fetch(url.toString(), {
      redirect: 'follow',
      // Add headers to satisfy some CDNs like Wikimedia
      headers: {
        'User-Agent': 'GlobalFoodWiki/1.0 (+contact@example.com)',
        'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8',
      },
    });

    if (!resp.ok) {
      const snippet = await resp.text().catch(() => '');
      console.error(`Image proxy upstream ${resp.status}: ${url}`, snippet.slice(0, 200));
      return res.status(502).send('Upstream image fetch failed');
    }

    const buf = Buffer.from(await resp.arrayBuffer());
    const ct = resp.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buf);
  } catch (err) {
    console.error('GET /api/img error:', err);
    return res.status(500).send('Server error');
  }
});

// ---- Start server ----
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
