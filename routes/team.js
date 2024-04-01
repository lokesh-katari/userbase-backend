// routes/teams.js
const express = require('express');
const router = express.Router();
const Team = require('../models/team');

// Create a new team
router.post('/', async (req, res) => {
  const { name, members } = req.body;
  try {
    const team = new Team({ name, members });
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Retrieve the details of a specific team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/all/teams', async (req, res) => {
  try {
    const team = await Team.find().populate('members');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
