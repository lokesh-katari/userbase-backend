// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users with pagination support
router.get('/', async (req, res) => {
  try {
    console.log(req.query.page, 'page');
    const page = parseInt(req.query.page) || 2;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;

    const filter = {};
    if (req.query.domain) {
      filter.domain = req.query.domain;
    }
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    if (req.query.available !== undefined) {
      filter.available = req.query.available;
    }
    const searchQuery = req.query.name;
    console.log(searchQuery, 'searchQuery');
    if (searchQuery) {
      filter.$or = [
        { first_name: { $regex: searchQuery, $options: 'i' } },
        { last_name: { $regex: searchQuery, $options: 'i' } } 
      ];
    }

    const users = await User.find(filter).skip(startIndex).limit(limit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve a specific user by ID
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Middleware to get a user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Create a new user
router.post('/', async (req, res) => {
  const user = new User({

    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    gender: req.body.gender,
    avatar: req.body.avatar,
    domain: req.body.domain,
    available: req.body.available
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing user
router.put('/:id', getUser, async (req, res) => {
  if (req.body.first_name != null) {
    res.user.first_name = req.body.first_name;
  }
  if (req.body.last_name != null) {
    res.user.last_name = req.body.last_name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.gender != null) {
    res.user.gender = req.body.gender;
  }
  if (req.body.avatar != null) {
    res.user.avatar = req.body.avatar;
  }
  if (req.body.domain != null) {
    res.user.domain = req.body.domain;
  }
  if (req.body.available != null) {
    res.user.available = req.body.available;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
