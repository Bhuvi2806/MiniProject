/**
 * matchingService.js — Rule-Based Donor Matching Engine (MVP)
 *
 * This is the Phase 2/3 locked-stack implementation: pure JavaScript scoring
 * using Haversine distance + blood-group compatibility matrix + availability
 * flag + donation recency. No external API, no LLM.
 *
 * The output shape deliberately mirrors the Future Scope LLM agent's JSON
 * contract (see docs/FUTURE_SCOPE_llm_matching_agent.md) so that swapping in
 * an LLM call later is a drop-in replacement for the scoreAndRank() function.
 *
 * AGENT.md compliance: stays strictly inside Locked Tech Stack (Node.js + JS).
 */

'use strict';

// ─── Blood Group Compatibility Matrix ────────────────────────────────────────
// Key   = blood group NEEDED by the hospital (recipient type)
// Value = array of donor blood groups that can safely supply it
// Source: standard ABO + Rh transfusion compatibility chart
const COMPATIBILITY = {
  'O-':  ['O-'],
  'O+':  ['O-', 'O+'],
  'A-':  ['O-', 'A-'],
  'A+':  ['O-', 'O+', 'A-', 'A+'],
  'B-':  ['O-', 'B-'],
  'B+':  ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

/**
 * Returns true if the donor's blood group can supply the requested group.
 * @param {string} donorGroup  e.g. "O-"
 * @param {string} neededGroup e.g. "A+"
 */
function isCompatible(donorGroup, neededGroup) {
  const compatibleDonors = COMPATIBILITY[neededGroup];
  if (!compatibleDonors) return false; // unknown group — never match
  return compatibleDonors.includes(donorGroup);
}

// ─── Haversine Distance ───────────────────────────────────────────────────────
/**
 * Returns the great-circle distance in kilometres between two lat/lon points.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in km, rounded to 2 decimal places
 */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return parseFloat((R * 2 * Math.asin(Math.sqrt(a))).toFixed(2));
}

// ─── Donation Recency Score ───────────────────────────────────────────────────
const ELIGIBILITY_DAYS = 90; // conservative minimum gap between whole-blood donations

/**
 * Returns a recency score: 1 = likely eligible, 0 = possibly too recent.
 * Note: this is for RANKING only, not a medical clearance determination.
 * @param {string|null} lastDonatedOn  ISO date string or null
 */
function recencyScore(lastDonatedOn) {
  if (!lastDonatedOn) return 1; // never donated — eligible
  const daysSince = (Date.now() - new Date(lastDonatedOn).getTime()) / 86_400_000;
  return daysSince >= ELIGIBILITY_DAYS ? 1 : 0;
}

// ─── Composite Scoring ────────────────────────────────────────────────────────
/**
 * Assigns a numeric score to a donor relative to a hospital request.
 * Higher score = better match. Weights reflect the RANKING CRITERIA order
 * from the agent spec: compatibility > availability > distance > recency.
 *
 * @param {object} donor
 * @param {string} neededGroup
 * @param {number} hospitalLat
 * @param {number} hospitalLon
 * @returns {{ donor, distanceKm, score, exactMatch }} | null if incompatible
 */
function scoreDonor(donor, neededGroup, hospitalLat, hospitalLon) {
  if (!isCompatible(donor.bloodGroup, neededGroup)) return null;

  const distanceKm = haversineKm(
    hospitalLat, hospitalLon,
    donor.location.coordinates[1], // GeoJSON: [lng, lat]
    donor.location.coordinates[0]
  );

  const exactMatch     = donor.bloodGroup === neededGroup ? 1 : 0;
  const available      = donor.availabilityStatus === 'Available Now' ? 1 : 0;
  const recency        = recencyScore(donor.lastDonated ? donor.lastDonated.toISOString().split('T')[0] : null);
  // Distance score: closer → higher. Cap at 50km; beyond that score = 0.
  const distanceScore  = distanceKm <= 50 ? (50 - distanceKm) / 50 : 0;

  // Weighted composite (weights must reflect ranking priority order)
  const score =
    exactMatch    * 1000 +   // compatibility tier (exact vs compatible)
    available     *  500 +   // availability always outranks distance
    distanceScore *  100 +   // proximity within availability tier
    recency       *   50;    // recency as final tie-breaker

  return { donor, distanceKm, score, exactMatch: !!exactMatch };
}

// ─── Short reason generator ───────────────────────────────────────────────────
function buildReason(scored) {
  const { donor, distanceKm, exactMatch } = scored;
  const available = donor.availabilityStatus === 'Available Now';
  const parts = [];
  parts.push(exactMatch ? `Exact ${donor.bloodGroup} match` : `Compatible ${donor.bloodGroup} (universal donor)`);
  parts.push(available ? 'available now' : 'on standby');
  parts.push(`${distanceKm} km away`);
  return parts.join(', ') + '.';
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Match and rank donors for a hospital blood request.
 *
 * @param {object} hospital   { name, locality, latitude, longitude }
 * @param {object} request    { blood_group_needed, units_needed, urgency }
 * @param {Array}  donorPool  Array of Mongoose User documents (role === 'donor')
 * @returns {{ best_match, alternates, locality_coverage_note }}
 */
function matchDonors(hospital, request, donorPool) {
  const { blood_group_needed, urgency } = request;
  const { latitude, longitude, locality } = hospital;

  // 1. Score all compatible donors
  const scored = donorPool
    .map((d) => scoreDonor(d, blood_group_needed, latitude, longitude))
    .filter(Boolean) // remove null (incompatible)
    .sort((a, b) => b.score - a.score); // highest score first

  if (scored.length === 0) {
    return {
      best_match: null,
      alternates: [],
      locality_coverage_note:
        `No compatible donor for ${blood_group_needed} found in donor pool. ` +
        `Broaden the search radius or check the blood bank stock.`,
    };
  }

  const [best, ...rest] = scored;
  const alternates = rest.slice(0, 4); // up to 4 alternates per spec

  // Locality coverage note
  const sameLocality = scored.filter(
    (s) => s.donor.city?.toLowerCase() === locality?.toLowerCase()
  );
  let localityNote;
  if (sameLocality.length > 0) {
    localityNote = `${sameLocality.length} compatible donor(s) found within ${locality}.`;
  } else {
    localityNote = `No compatible donor in ${locality}; nearest is ${best.distanceKm} km away.`;
  }

  return {
    best_match: {
      donor_id: String(best.donor._id),
      name: best.donor.name,
      blood_group: best.donor.bloodGroup,
      distance_km: best.distanceKm,
      available: best.donor.availabilityStatus === 'Available Now',
      reason: buildReason(best),
    },
    alternates: alternates.map((s) => ({
      donor_id: String(s.donor._id),
      name: s.donor.name,
      blood_group: s.donor.bloodGroup,
      distance_km: s.distanceKm,
      available: s.donor.availabilityStatus === 'Available Now',
      reason: buildReason(s),
    })),
    locality_coverage_note: localityNote,
  };
}

module.exports = { matchDonors, haversineKm, isCompatible, COMPATIBILITY };
