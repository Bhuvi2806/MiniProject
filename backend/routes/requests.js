const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await BloodRequest.find().populate('createdBy', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new request
router.post('/', async (req, res) => {
  try {
    const newRequest = new BloodRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
