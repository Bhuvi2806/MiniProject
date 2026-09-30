const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search for donors by blood group and proximity
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, lng, lat, maxDistance = 10000 } = req.query; // maxDistance in meters (default 10km)

    let query = { role: 'donor' };
    if (bloodGroup) query.bloodGroup = bloodGroup;

    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    const donors = await User.find(query).select('-password');
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update donor profile (e.g. availability, location)
router.put('/:id', async (req, res) => {
  try {
    // In a real app, verify that req.user.id == req.params.id (via JWT middleware)
    const updatedDonor = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.status(200).json(updatedDonor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
