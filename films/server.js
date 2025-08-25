const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/filmsdb';
mongoose.connect(mongoUrl);

const FilmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  user: { type: String, required: true }
});
FilmSchema.index({ user: 1, title: 1 }, { unique: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Film = mongoose.model('Film', FilmSchema);
const User = mongoose.model('User', UserSchema);

const SECRET_KEY = process.env.JWT_SECRET || 'development-secret';

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.sendStatus(403);
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded;
    next();
  });
}

function optionalToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return next();
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, decoded) => {
    if (!err) {
      req.user = decoded;
    }
    next();
  });
}

app.get('/api/v1/films', optionalToken, async (req, res) => {
  try {
    const query = req.user ? { user: req.user.username } : {};
    const films = await Film.find(query).sort({ _id: 1 });
    if (films.length === 0) {
      return res.status(404).json({ message: 'No films available' });
    }
    res.json(films);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/v1/films', verifyToken, async (req, res) => {
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
    const existing = await Film.findOne({
      user: req.user.username,
      title: new RegExp(`^${title}$`, 'i')
    });
    if (existing) {
      existing.rating = numRating;
      await existing.save();
      return res.json({ message: 'Film rating updated successfully' });
    }
    const film = new Film({ title, rating: numRating, user: req.user.username });
    await film.save();
    res.status(201).json({ message: 'Film added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/v1/films/:id', verifyToken, async (req, res) => {
  const { rating } = req.body;
  if (rating === undefined || rating === null || rating === '') {
    return res.status(400).json({ message: 'Rating is required' });
  }
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 10) {
    return res.status(400).json({ message: 'Rating must be between 1 and 10' });
  }

  try {
    const film = await Film.findOne({ _id: req.params.id, user: req.user.username });
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }
    film.rating = numRating;
    await film.save();
    res.json({ message: 'Film rating updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/v1/register', async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: 'Name, username, and password are required' });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/v1/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/v1/films', verifyToken, async (req, res) => {
  try {
    await Film.deleteMany({ user: req.user.username });
    res.json({ message: 'Films cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Films service listening on port ${port}`);
});
