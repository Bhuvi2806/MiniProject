/**
 * routes/match.js — Donor Matching API Endpoint
 *
 * POST /api/match
 * Accepts a hospital location + blood request, queries the donor pool from
 * MongoDB, runs the rule-based matchingService, and returns ranked results.
 *
 * Future Scope: replace matchDonors() call with LLM agent call once
 * AGENT.md Locked Tech Stack is updated to include an LLM API.
 * See docs/FUTURE_SCOPE_llm_matching_agent.md for the agent system prompt.
 */

'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { matchDonors } = require('../services/matchingService');

/**
 * POST /api/match
 *
 * Body:
 * {
 *   "hospital": { "name", "locality", "latitude", "longitude" },
 *   "request":  { "blood_group_needed", "units_needed", "urgency" },
 *   "radius_km": number   (optional, default 25)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { hospital, request, radius_km = 25 } = req.body;

    if (!hospital?.latitude || !hospital?.longitude) {
      return res.status(400).json({ error: 'hospital.latitude and hospital.longitude are required.' });
    }
    if (!request?.blood_group_needed) {
      return res.status(400).json({ error: 'request.blood_group_needed is required.' });
    }

    // Pull donors within radius_km using MongoDB geospatial query.
    // Converts km to metres for $maxDistance.
    const donorPool = await User.find({
      role: 'donor',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [hospital.longitude, hospital.latitude], // GeoJSON: [lng, lat]
          },
          $maxDistance: radius_km * 1000,
        },
      },
    }).select('-password');

    // Run rule-based matching engine
    const result = matchDonors(hospital, request, donorPool);

    res.status(200).json({
      ...result,
      meta: {
        hospital: hospital.name,
        blood_group_needed: request.blood_group_needed,
        urgency: request.urgency,
        radius_km,
        donor_pool_size: donorPool.length,
        matched_at: new Date().toISOString(),
        engine: 'rule-based (matchingService.js)',
        // Future Scope: engine will be 'llm-agent' once tech stack updated
      },
    });
  } catch (error) {
    console.error('[match] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
