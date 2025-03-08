const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3009;

// Use the cors middleware
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sign_language', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define schema and model for institutes collection
const instituteSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  imageUrl: String
});

const Institute = mongoose.model('Institute', instituteSchema);

// Endpoint to get all institutes
app.get('/api/institutes', async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.json(institutes);
  } catch (error) {
    console.error('Error fetching institutes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
