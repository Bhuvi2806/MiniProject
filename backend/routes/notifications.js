const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

// Test endpoint to trigger an email broadcast (Phase 3 requirement)
router.post('/broadcast', async (req, res) => {
  try {
    const { emails, hospitalName, bloodGroup, unitsNeeded } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of donor emails.' });
    }

    // Send emails in parallel
    const sendPromises = emails.map(email => 
      notificationService.sendEmergencyAlert(email, hospitalName, bloodGroup, unitsNeeded)
    );

    await Promise.all(sendPromises);

    res.status(200).json({ message: `Successfully broadcasted alerts to ${emails.length} donors.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
