const express = require("express");
const router = express.Router();
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const { matchDonors } = require("../services/matchingService");
const notificationService = require("../services/notificationService");

const DEFAULT_RADIUS_KM = 25;

// Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await BloodRequest.find().populate(
      "createdBy",
      "name email",
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new request, then match donors and alert them by email
router.post("/", async (req, res) => {
  try {
    // 1. Whitelist fields (avoids mass assignment)
    const {
      patientName,
      hospitalName,
      department,
      bloodGroup,
      componentType,
      unitsNeeded,
      triageLevel,
      reason,
      location,
      createdBy,
    } = req.body;

    const newRequest = new BloodRequest({
      patientName,
      hospitalName,
      department,
      bloodGroup,
      componentType,
      unitsNeeded,
      triageLevel,
      reason,
      location,
      createdBy,
    });
    await newRequest.save();

    // 2. Find donors near the hospital (skip unavailable ones)
    const [lng, lat] = newRequest.location.coordinates;
    const radiusKm = Number(req.body.radius_km) || DEFAULT_RADIUS_KM;

    const donorPool = await User.find({
      role: "donor",
      availabilityStatus: { $ne: "Unavailable" },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
    }).select("-password");

    // 3. Rank them with the scoring engine (best match + up to 4 alternates)
    const result = matchDonors(
      {
        name: newRequest.hospitalName,
        locality: req.body.locality || donorPool[0]?.city,
        latitude: lat,
        longitude: lng,
      },
      {
        blood_group_needed: newRequest.bloodGroup,
        units_needed: newRequest.unitsNeeded,
        urgency: newRequest.triageLevel,
      },
      donorPool,
    );

    const topIds = [result.best_match, ...result.alternates]
      .filter(Boolean)
      .map((m) => m.donor_id);

    // 4. Email the matched donors. A failed email must not fail the request.
    let alerted = 0;
    let failed = 0;

    if (topIds.length > 0) {
      const donors = donorPool.filter((d) => topIds.includes(String(d._id)));

      const outcomes = await Promise.allSettled(
        donors.map((d) =>
          notificationService.sendEmergencyAlert(
            d.email,
            newRequest.hospitalName,
            newRequest.bloodGroup,
            newRequest.unitsNeeded,
          ),
        ),
      );

      // Only record donors whose email actually went out
      const alertedDonorIds = [];
      outcomes.forEach((o, i) => {
        if (o.status === "fulfilled") alertedDonorIds.push(donors[i]._id);
      });
      alerted = alertedDonorIds.length;
      failed = outcomes.length - alerted;

      // 5. Save who was alerted on the request itself
      newRequest.matchedDonors = alertedDonorIds.map((id) => ({
        donorId: id,
        status: "Alerted",
      }));
      await newRequest.save();
    }

    res.status(201).json({
      request: newRequest,
      matching: result,
      notifications: { alerted, failed },
    });
  } catch (error) {
    console.error("[requests] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
