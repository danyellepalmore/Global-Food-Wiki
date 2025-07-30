// backend/seed.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_NAME = process.env.MONGO_DB || 'globalfoodwiki';
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

// ----- locate foods.js (module.exports = [ ... ]) -----
function resolveFoodsModule() {
  const candidates = [
    path.join(__dirname, 'data', 'foods.js'),        // backend/data/foods.js  your case
    path.join(__dirname, '../data/foods.js'),        // repo-root/data/foods.js
    path.join(process.cwd(), 'data', 'foods.js')     // cwd/data/foods.js
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const foodsPath = resolveFoodsModule();
if (!foodsPath) {
  console.error('Could not find a foods.js file. Expected one of:');
  console.error('   - backend/data/foods.js');
  console.error('   - data/foods.js');
  process.exit(1);
}

let foods;
try {
  foods = require(foodsPath);
  if (!Array.isArray(foods)) {
    throw new Error('foods.js must export an array: module.exports = [ ... ]');
  }
  console.log(`Loaded ${foods.length} item(s) from: ${foodsPath}`);
} catch (e) {
  console.error('Failed to load foods dataset:', e.message);
  process.exit(1);
}

// ----- schema (keep in sync with server.js) -----
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  aliases: [String],
  origin: String,
  region: String,
  description: String,
  ingredients: [String],
  dietary: [String],
  culture: String,
  image: String,          // URL
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

async function run() {
  const RESET = process.argv.includes('--reset');

  console.log('🔌 Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME, // force the DB to avoid "test"
  });

  console.log(`Connected. Using database: ${mongoose.connection.name}`);

  if (RESET) {
    console.log('🧹 --reset detected: clearing collection "foods"…');
    await Food.deleteMany({});
  }

  if (!foods.length) {
    console.log('No items to seed.');
    await mongoose.disconnect();
    return;
  }

  // upsert by name
  const ops = foods.map((doc) => ({
    updateOne: {
      filter: { name: doc.name },
      update: { $set: doc },
      upsert: true,
    },
  }));

  console.log(`Seeding ${ops.length} item(s) into "${mongoose.connection.name}.foods"…`);
  const result = await Food.bulkWrite(ops, { ordered: false });

  const total = await Food.countDocuments();
  console.log('Seed complete.');
  console.log(`   Upserted: ${result.upsertedCount || 0}`);
  console.log(`   Modified: ${result.modifiedCount || 0}`);
  console.log(`   Matched:  ${result.matchedCount || 0}`);
  console.log(`   Collection total: ${total}`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected.');
}

run().catch(async (err) => {
  console.error('Seed failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
