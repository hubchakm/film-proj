const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/filmsdb';
mongoose.connect(mongoUrl);

const FilmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, required: true }
});

const Film = mongoose.model('Film', FilmSchema);

app.get('/api/v1/films', async (req, res) => {
  try {
    const films = await Film.find().sort({ _id: 1 });
    res.json(films);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/v1/films', async (req, res) => {
  const { title, rating } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  if (rating === undefined || rating === null || rating === '') {
    return res.status(400).json({ message: 'Rating is required' });
  }
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 10) {
    return res.status(400).json({ message: 'Rating must be between 1 and 10' });
  }

  try {
    const film = new Film({ title, rating: numRating });
    await film.save();
    res.status(201).json({ message: 'Film added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Films service listening on port ${port}`);
});
