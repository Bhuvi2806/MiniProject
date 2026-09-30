/**
 * Mock / Seeded Data for Blood Donor Finder Frontend
 * --------------------------------------------------
 * All data here is illustrative. In production, this would be
 * replaced with API calls to the Express backend (Phase 1).
 */

// ─── Emergency Dashboard Stats ───────────────────────────────
export const emergencyStats = {
  activeSOS: { count: 8, label: 'Active SOS Requisitions', location: 'Kanpur-Lucknow Metro Zone' },
  codeRed: { count: 3, label: 'Code Red Priority', sublabel: 'Patients requesting universal donors', threshold: '< 30m' },
  volunteersEnRoute: { count: 14, label: 'Volunteers En Route', sublabel: 'Live GPS Telemetry Active' },
  unitsSecured: { count: 48, label: 'Units Secured Today', target: 60, percentChange: 18, deadline: '21:00' },
};

// ─── Triage categories ───────────────────────────────────────
export const triageCategories = ['All', 'Code Red: < 1hr', 'Urgent Surgery', 'Scheduled'];

// ─── Blood Groups ────────────────────────────────────────────
export const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

// ─── Emergency Requisition Cases ─────────────────────────────
export const emergencyCases = [
  {
    id: 'CR-9402',
    triage: 'Code Red',
    triageColor: 'code-red',
    hospital: 'GSVM Medical College (LLR Hospital)',
    unit: 'Trauma Bay 4 • Swaroop Nagar',
    department: 'Level 1 Adult & Pediatric Trauma Center',
    bloodGroup: 'O-',
    bloodLabel: 'Universal',
    componentType: 'Whole Blood',
    unitsNeeded: 4,
    unitsSecured: 2,
    reason: 'Severe Multi-Vehicle Collision',
    timeRemaining: '38 mins remaining',
    responders: [
      { name: 'Marcus V.', status: 'Arriving', eta: '12m' },
      { name: 'Sandra K.', status: 'Arriving', eta: '25m' },
    ],
    additionalDonorsNeeded: 2,
    cta: 'I Can Donate O- Here',
    ctaVariant: 'primary',
  },
  {
    id: 'PD-3118',
    triage: 'High Priority',
    triageColor: 'high-priority',
    hospital: "Regency Hospital Ltd.",
    unit: 'OR Suite 3 • Sarvodaya Nagar',
    department: 'Pediatric Cardiac Surgery Center',
    bloodGroup: 'A-',
    bloodLabel: 'Whole Blood',
    componentType: 'Whole Blood',
    unitsNeeded: 2,
    unitsSecured: 1,
    reason: 'Fresh whole blood protocol',
    timeRemaining: 'Needed by: 2:00 PM Today',
    responders: [
      { name: '1 Donor matched & en route', status: 'En Route', eta: '18 min' },
    ],
    additionalDonorsNeeded: 1,
    cta: 'Offer Donation',
    ctaVariant: 'secondary',
  },
  {
    id: 'MW-8821',
    triage: 'Critical OB-GYN',
    triageColor: 'critical',
    hospital: "Krishna Super Speciality Hospital",
    unit: 'Postpartum Care Unit • Cooperganj',
    department: 'Maternity & Perinatal Intensive Unit',
    bloodGroup: 'B+',
    bloodLabel: 'RBC Needed',
    componentType: 'Red Blood Cells',
    unitsNeeded: 3,
    unitsSecured: 0,
    reason: 'Acute Postpartum Hemorrhage',
    timeRemaining: 'Needed within: 90 mins',
    responders: [],
    additionalDonorsNeeded: 3,
    broadcastSent: true,
    broadcastInfo: 'Broadcasted to 48 matched donors in a 5-mile radius. Dispatchers awaiting initial donor check-ins.',
    cta: 'Respond as Donor',
    ctaVariant: 'primary',
  },
  {
    id: 'ON-1094',
    triage: 'Fully Matched',
    triageColor: 'matched',
    hospital: 'Apollo Spectra Hospital',
    unit: 'Hematology Pavilion 2 • Chunni Ganj',
    department: 'Comprehensive Cancer Care & Infusion',
    bloodGroup: 'AB-',
    bloodLabel: 'Platelets',
    componentType: 'Platelets',
    unitsNeeded: 2,
    unitsSecured: 2,
    reason: '2 of 2 in processing',
    timeRemaining: 'Target Reached for Scheduled Infusion',
    responders: [],
    additionalDonorsNeeded: 0,
    fulfilled: true,
    cta: 'Requisition Filled',
    ctaVariant: 'disabled',
  },
];

// ─── Find Donors: Blood Group Counts ─────────────────────────
export const bloodGroupCounts = {
  ALL: 428,
  'O-': 34,
  'O+': 88,
  'A+': 72,
  'A-': 29,
  'B+': 64,
  'B-': 18,
  'AB+': 31,
  'AB-': 14,
};

// ─── Find Donors: Summary Stats ──────────────────────────────
export const donorSummaryStats = {
  activeDonorsNearby: 342,
  radius: 10,
  avgDispatchTime: '22 Mins',
  requestsFulfilledToday: 12,
};

// ─── Find Donors: Matched Donor List ─────────────────────────
export const matchedDonors = [
  {
    id: 1,
    name: 'Marcus Vance',
    bloodGroup: 'O-',
    bloodLabel: 'Universal',
    badge: 'Platinum Donor',
    donations: 18,
    status: 'Available Now',
    statusColor: 'available',
    distance: '1.8 miles away',
    responseTime: 'Usually responds in 8 mins',
    lastDonated: null,
    certifications: 'Platelet & Red Cell certified. Traveled within Metro radius. Ready for...',
    cta: 'Direct Alert',
    ctaVariant: 'primary',
    urgent: true,
  },
  {
    id: 2,
    name: 'Dr. Elena Rostova',
    bloodGroup: 'A+',
    bloodLabel: 'Positive',
    badge: 'On Standby (Off-shift Physician)',
    donations: null,
    status: 'On Standby',
    statusColor: 'standby',
    distance: '3.4 miles away',
    location: 'Metro Children\'s Wing',
    responseTime: 'Avg dispatch: 15 min',
    lastDonated: 'Last donated 4 mo ago',
    certifications: 'Pediatric compatibility cleared. CMV-negative confirmed by clinical lab...',
    cta: 'Request Blood',
    ctaVariant: 'secondary',
  },
  {
    id: 3,
    name: 'Kavita Patel',
    bloodGroup: 'B-',
    bloodLabel: 'Rare Type',
    badge: 'Platelet & Whole Blood Verified',
    donations: 9,
    donationYear: '2024',
    status: 'Available Today',
    statusColor: 'available',
    distance: '4.1 miles away',
    responseTime: '< 15 min response',
    lastDonated: null,
    certifications: 'Priority matching for B- and AB- pediatric trauma cases. Contact pre-...',
    cta: 'Request Blood',
    ctaVariant: 'secondary',
  },
  {
    id: 4,
    name: 'David Kim',
    bloodGroup: 'O+',
    bloodLabel: 'Universal +',
    badge: 'Universal Red Cell for Positive Recipients',
    donations: null,
    status: 'Available in 1 hr',
    statusColor: 'standby',
    distance: '2.6 miles away',
    responseTime: '100% On-time Arrival Record',
    lastDonated: null,
    certifications: 'Located right near Highway 5 corridor. Rapid car dispatch ready for transit.',
    cta: 'Reserve Slot',
    ctaVariant: 'outline',
  },
  {
    id: 5,
    name: 'Aisha Al-Mansoor',
    bloodGroup: 'AB-',
    bloodLabel: 'Rare Plasma',
    badge: 'Plasma Specialist • Type AB Hero',
    donations: 14,
    status: 'Available Now',
    statusColor: 'available',
    distance: '5.0 miles away',
    responseTime: '< 10 min response',
    lastDonated: null,
    certifications: 'Universal plasma donor. Excellent match for burn ICU and trauma...',
    cta: 'Request Blood',
    ctaVariant: 'secondary',
  },
  {
    id: 6,
    name: 'Carlos Mendez',
    bloodGroup: 'B+',
    bloodLabel: 'Compatible',
    badge: 'Verified Whole Blood',
    donations: null,
    status: 'Available Now',
    statusColor: 'available',
    distance: '6.2 miles away',
    location: 'Regular donor at University Medical',
    responseTime: 'Standard dispatch',
    lastDonated: '12 days ago',
    certifications: 'Completed health screening 12 days ago. Ready for immediate mobile unit...',
    cta: 'Request Blood',
    ctaVariant: 'secondary',
  },
];

// ─── Blood Banks: Regional Stock ─────────────────────────────
export const regionalStock = [
  { group: 'O-', percentage: 18, status: 'Critical', statusColor: 'critical', detail: 'Est. 11h supply' },
  { group: 'O+', percentage: 64, status: 'Moderate', statusColor: 'moderate', detail: 'Stable 4-day stock' },
  { group: 'A-', percentage: 24, status: 'Low Reserve', statusColor: 'low', detail: 'Urgent calls out' },
  { group: 'A+', percentage: 88, status: 'Healthy Supply', statusColor: 'healthy', detail: 'Above quota' },
  { group: 'B-', percentage: 15, status: 'Critical', statusColor: 'critical', detail: 'Active requests' },
  { group: 'B+', percentage: 79, status: 'Optimal', statusColor: 'optimal', detail: 'Normal intake' },
  { group: 'AB-', percentage: 42, status: 'Adequate', statusColor: 'adequate', detail: 'Monitored' },
  { group: 'AB+', percentage: 92, status: 'Surplus', statusColor: 'surplus', detail: 'Plasma ready' },
];

// ─── Blood Banks: Facility List ──────────────────────────────
export const donationFacilities = [
  {
    id: 1,
    name: 'GSVM Medical College Blood Bank',
    address: 'Swaroop Nagar • Level-1 Fixed Transfusion Center',
    distance: '1.2 miles away',
    openHours: 'Open Today until 7:00 PM',
    slotsAvailable: 42,
    tags: ['Fast 25-minute donation', 'Platelet apheresis machines', 'Free Iron & Cholesterol checkup included'],
    cta: 'Schedule Donation Slot',
    ctaVariant: 'primary',
  },
  {
    id: 2,
    name: 'Regency Hospital Mobile Blood Bus',
    address: 'Sarvodaya Nagar • Climate Controlled 6-Bed Coach',
    distance: '2.8 miles away',
    openHours: 'Drive Active Today (9 AM - 4 PM)',
    urgentNeed: 'Urgent Need for O-, B-',
    nursesOnStation: 8,
    tags: ['Complimentary donor t-shirt & health voucher', 'High-speed recovery lounge Wi-Fi', 'No wait time currently'],
    cta: 'Walk-In or Reserve Time',
    ctaVariant: 'secondary',
  },
  {
    id: 3,
    name: 'Bhargava Hospital Donation Facility',
    address: 'Civil Lines • Specialty Stem Cell & Whole Blood Wing',
    distance: '4.5 miles away',
    openHours: 'Open Tomorrow 8:00 AM',
    validatesParking: true,
    tags: ['Full Biomarker & Antibody Screen', 'Barista Recovery Station'],
    cta: 'Book Appointment',
    ctaVariant: 'outline',
    earlySlots: 'Early slots open 08:15',
  },
];

// ─── Blood Banks: Eligibility Checklist ──────────────────────
export const eligibilityChecklist = [
  { text: 'Minimum age 16+ (with consent), weight at least 110 lbs', met: true },
  { text: 'No blood donation within the last 56 days', met: true },
  { text: 'No recent tattoos or piercings (within 3 months)', met: null },
  { text: 'No current medications affecting blood clotting', met: null },
  { text: 'General good health — no cold/flu symptoms', met: null },
];

// ─── Nav items ───────────────────────────────────────────────
export const navItems = [
  { label: 'Find Donors', path: '/find-donors' },
  { label: 'Emergency Requests', path: '/' },
  { label: 'Blood Banks & Drives', path: '/blood-banks' },
  { label: 'Eligibility & Quiz', path: '/eligibility' },
  { label: 'Community Impact', path: '/community' },
];

// ─── Map data (Kanpur, India) ────────────────────────────────
export const mapCenter = [26.4499, 80.3319];
export const mapZoom = 13;

export const hospitalMarkers = [
  { name: 'GSVM Medical College (LLR)', lat: 26.4787938, lon: 80.3092968 },
  { name: 'Regency Hospital Ltd', lat: 26.4793574, lon: 80.3015634 },
  { name: 'Apollo Spectra Hospital', lat: 26.423619, lon: 80.336227 },
  { name: 'Bhargava Hospital', lat: 26.4743257, lon: 80.3501670 },
  { name: 'Krishna Super Speciality Hospital', lat: 26.4502731, lon: 80.3443801 },
  { name: 'Rama Hospital', lat: 26.4687630, lon: 80.3182230 }
];
