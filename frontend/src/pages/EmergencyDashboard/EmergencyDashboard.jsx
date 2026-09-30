import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchRequests } from '../../services/api';
import {
  emergencyStats,
  triageCategories,
  bloodGroups,
  emergencyCases,
  mapCenter,
  mapZoom,
  hospitalMarkers
} from '../../data/mockData';
import './EmergencyDashboard.css';

export default function EmergencyDashboard() {
  const [activeTriage, setActiveTriage] = useState('All');
  const [activeBloodGroup, setActiveBloodGroup] = useState('All');
  const [enrollBloodType, setEnrollBloodType] = useState(null);
  const [enrollPhone, setEnrollPhone] = useState('');
  const [liveRequests, setLiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRequests();
        setLiveRequests(data);
      } catch (e) {
        console.error("Failed to load requests", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter cases by triage and blood group
  const filteredCases = liveRequests.filter((c) => {
    const triageMatch = activeTriage === 'All' || c.triageLevel === activeTriage || (activeTriage === 'Urgent Surgery' && c.triageLevel === 'High Priority');
    const bloodMatch = activeBloodGroup === 'All' || c.bloodGroup === activeBloodGroup;
    return triageMatch && bloodMatch;
  });

  return (
    <div className="emergency-page">
      {/* ── Dispatch Banner ── */}
      <div className="dispatch-banner">
        <div className="container flex items-center justify-between">
          <p className="dispatch-banner__text">
            <span className="dispatch-banner__badge">REGIONAL DISPATCH</span>
            • Real-Time Hospital Requisition Bridge
          </p>
          <div className="dispatch-banner__status">
            <span className="pulse-dot"></span>
            <span>Mesh Sync Active</span>
            <span className="text-muted">⟳ Refreshed 26s ago</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Stat Row ── */}
        <section className="stat-row" aria-label="Emergency statistics">
          {/* Active SOS */}
          <div className="stat-card">
            <div className="stat-card__header">
              <span className="label-md text-muted">{emergencyStats.activeSOS.label}</span>
              <span className="stat-card__icon stat-card__icon--sos">⬆</span>
            </div>
            <p className="stat-card__value headline-xl tabular-nums">{emergencyStats.activeSOS.count}</p>
            <p className="body-sm text-muted">📍 {emergencyStats.activeSOS.location}</p>
          </div>

          {/* Code Red */}
          <div className="stat-card stat-card--code-red">
            <div className="stat-card__header">
              <span className="label-md">CODE RED PRIORITY <span className="stat-card__threshold">{emergencyStats.codeRed.threshold}</span></span>
              <span className="stat-card__icon stat-card__icon--alert">⚠</span>
            </div>
            <p className="stat-card__value headline-xl tabular-nums">
              {emergencyStats.codeRed.count} <span className="headline-md">Patients</span>
            </p>
            <p className="body-sm">{emergencyStats.codeRed.sublabel}</p>
          </div>

          {/* Volunteers En Route */}
          <div className="stat-card">
            <div className="stat-card__header">
              <span className="label-md text-muted">{emergencyStats.volunteersEnRoute.label}</span>
              <span className="stat-card__icon stat-card__icon--route">🚗</span>
            </div>
            <p className="stat-card__value headline-xl tabular-nums">
              {emergencyStats.volunteersEnRoute.count} <span className="headline-md">Donors</span>
            </p>
            {/* FUTURE SCOPE: Live GPS telemetry — currently placeholder text */}
            <p className="body-sm text-secondary">
              <span className="pulse-dot"></span> Live GPS Telemetry Active
            </p>
          </div>

          {/* Units Secured */}
          <div className="stat-card">
            <div className="stat-card__header">
              <span className="label-md text-muted">{emergencyStats.unitsSecured.label}</span>
              <span className="stat-card__icon stat-card__icon--units">📦</span>
            </div>
            <div className="stat-card__value-row">
              <p className="stat-card__value headline-xl tabular-nums">{emergencyStats.unitsSecured.count}</p>
              <span className="stat-card__change text-secondary">↗ +{emergencyStats.unitsSecured.percentChange}%</span>
            </div>
            <div className="stat-card__target">
              <span className="body-sm text-muted">
                Target: {emergencyStats.unitsSecured.target} units by {emergencyStats.unitsSecured.deadline}
              </span>
              <span className="label-lg">
                {Math.round((emergencyStats.unitsSecured.count / emergencyStats.unitsSecured.target) * 100)}% reached
              </span>
            </div>
          </div>
        </section>

        {/* ── Requisition Board Header ── */}
        <section className="requisition-section">
          <div className="requisition-header">
            <div>
              <h1 className="headline-lg">Active SOS Requisition Board</h1>
              <p className="body-sm text-muted">
                Direct integration with regional emergency flight transports.
              </p>
            </div>
            <div className="requisition-header__actions">
              <button className="btn btn-outline btn-sm">
                🏥 View Hospital Map View
              </button>
              <button className="btn btn-primary">
                ＋ Create Emergency Broadcast
              </button>
            </div>
          </div>

          {/* Triage Filter Tabs */}
          <div className="triage-tabs">
            <span className="label-md text-muted">Triage Level:</span>
            <div className="triage-tabs__list">
              {triageCategories.map((cat) => (
                <button
                  key={cat}
                  className={`triage-tab ${activeTriage === cat ? 'triage-tab--active' : ''}`}
                  onClick={() => setActiveTriage(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="label-md text-muted" style={{ marginLeft: 'auto' }}>
              ⚙ Sorting by: <strong>Highest Criticality</strong>
            </span>
          </div>

          {/* Blood Group Chip Filters */}
          <div className="blood-filter-row">
            <span className="label-md text-muted">Filter by Required Blood Group:</span>
            <div className="blood-filter-row__chips">
              <button
                className={`blood-chip ${activeBloodGroup === 'All' ? 'active' : ''}`}
                onClick={() => setActiveBloodGroup('All')}
              >
                All
              </button>
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  className={`blood-chip ${activeBloodGroup === bg ? 'active' : ''}`}
                  onClick={() => setActiveBloodGroup(bg)}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Map Panel ── */}
        <section className="map-section card">
          <div className="map-section__header">
            <h2 className="headline-sm">
              🏥 Emergency Transit & Center Status Map
              {/* FUTURE SCOPE: Live GPS Coordinates — currently illustrative Leaflet/OSM map */}
              <span className="status-badge status-badge--available" style={{ marginLeft: 8 }}>Live GPS Coordinates</span>
            </h2>
            <span className="body-sm text-muted">4 Designated Critical Medical Hubs</span>
          </div>
          <div className="map-section__body">
            <div className="map-section__map">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom={false}
                style={{ height: '280px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hospitalMarkers.map((hospital, idx) => (
                  <Marker key={idx} position={[hospital.lat, hospital.lon]}>
                    <Popup>{hospital.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="map-section__info">
              <div className="flex items-center gap-sm">
                <span className="pulse-dot"></span>
                <span className="label-md">14 Live Couriers Active</span>
              </div>
              {/* FUTURE SCOPE: Real-time courier mesh sync — placeholder notice */}
              <div className="card card-surface map-info-card">
                <p className="label-lg">🏥 Kanpur Metro Emergency Corridor</p>
                <p className="body-sm text-muted">
                  Active sirens & transit corridors prioritized. Donors equipped with digital transit badges have expressway priority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Case Cards ── */}
        <section className="cases-list" aria-label="Emergency requisition cases">
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="headline-sm text-muted">Loading live requisitions...</p>
            </div>
          ) : filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <CaseCard key={caseItem._id} data={caseItem} />
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="headline-sm text-muted">No requisitions match current filters</p>
              <p className="body-sm text-muted">Try adjusting the triage level or blood group filter above.</p>
            </div>
          )}
        </section>

        {/* ── Bottom Feature Cards ── */}
        <section className="feature-row">
          <div className="feature-card card">
            <span className="feature-card__icon">⚡</span>
            <h3 className="label-lg">Fast-Track Clinical Triage</h3>
            <p className="body-sm text-muted">
              Verified hospital dispatchers bypass queue systems to directly ping compatible regional blood donors.
            </p>
          </div>
          <div className="feature-card card">
            <span className="feature-card__icon">🧊</span>
            <h3 className="label-lg">Cold-Chain Logistical Security</h3>
            {/* FUTURE SCOPE: Real-time cold-chain telemetry */}
            <p className="body-sm text-muted">
              All volunteer transport and certified courier vehicles maintain continuous digital temperature telemetry.
            </p>
          </div>
          <div className="feature-card card">
            <span className="feature-card__icon">🔒</span>
            <h3 className="label-lg">Anonymized Patient Safeguards</h3>
            {/* FUTURE SCOPE: Full HIPAA adherence */}
            <p className="body-sm text-muted">
              Patient identities remain strictly confidential throughout donor routing.
            </p>
          </div>
        </section>

        {/* ── Rapid Enrollment Section ── */}
        <section className="enrollment-section">
          <div className="enrollment-left">
            <div className="enrollment-badges">
              <span className="status-badge status-badge--available">✅ Verified Responder Corps</span>
              <span className="status-badge status-badge--critical">Immediate Local Need</span>
            </div>
            <h2 className="headline-xl enrollment-headline">
              Be the Lifeline When Seconds Count.<br />
              Register for On-Call Alerts.
            </h2>
            <p className="body-md text-muted">
              Emergency surgeries and mass-casualty incidents often deplete universal blood supplies within 45 minutes.
              By enrolling in the On-Call Dispatch Registry, you will receive geo-targeted priority alerts only when
              an accredited trauma center in your vicinity faces a critical shortage.
            </p>
            <div className="enrollment-perks">
              <div className="enrollment-perk">✓ Only pinged for your matching blood type</div>
              <div className="enrollment-perk">✓ Direct designated parking at hospital intake</div>
              <div className="enrollment-perk">✓ One-tap temporary standby mode anytime</div>
              <div className="enrollment-perk">✓ Official civic life-saving certification hours</div>
            </div>
          </div>
          <div className="enrollment-right card">
            <h3 className="headline-md">Rapid Enrollment</h3>
            <p className="body-sm text-muted">Your Blood Type (if known)</p>
            <div className="enrollment-blood-grid">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  className={`blood-chip ${enrollBloodType === bg ? 'active' : ''}`}
                  onClick={() => setEnrollBloodType(bg)}
                >
                  {bg}
                </button>
              ))}
            </div>
            <p className="body-sm text-muted" style={{ marginTop: 'var(--space-md)' }}>
              Mobile Number for SOS Broadcasts
            </p>
            <div className="enrollment-phone-row">
              <input
                type="tel"
                className="input"
                placeholder="(206) 555-0199"
                value={enrollPhone}
                onChange={(e) => setEnrollPhone(e.target.value)}
              />
            </div>
            {/* FUTURE SCOPE: SMS broadcast — uses Nodemailer email in locked stack */}
            <button className="btn btn-primary enrollment-submit">
              📡 Join Emergency On-Call Network
            </button>
            <p className="label-md text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
              Encrypted protocols. Cancel anytime by replying STOP.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}


/* ─── Case Card Sub-component ────────────────────────────── */
function CaseCard({ data }) {
  const progressPercent = data.unitsNeeded > 0
    ? Math.round((data.unitsSecured / data.unitsNeeded) * 100)
    : 0;
    
  const fulfilled = progressPercent >= 100 || data.status === 'Completed';

  // Map backend triage to frontend CSS color classes
  let triageColor = 'high-priority';
  if (data.triageLevel === 'Code Red') triageColor = 'code-red';
  else if (data.triageLevel === 'Critical') triageColor = 'critical';
  else if (data.triageLevel === 'Matched') triageColor = 'matched';

  const triageClasses = {
    'code-red': 'case-triage--code-red',
    'high-priority': 'case-triage--high-priority',
    'critical': 'case-triage--critical',
    'matched': 'case-triage--matched',
  };

  return (
    <article className={`case-card card ${fulfilled ? 'case-card--fulfilled' : ''}`}>
      <div className="case-card__top">
        <div className="flex items-center gap-sm flex-wrap">
          <span className={`case-triage ${triageClasses[triageColor] || ''}`}>
            {data.triageLevel.toUpperCase()}
          </span>
          <span className="label-md text-muted">Case #{data._id.substring(0, 8)}</span>
        </div>
        <span className={`case-card__time ${triageColor === 'code-red' ? 'text-primary' : fulfilled ? 'text-secondary' : 'text-muted'}`}>
          {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="case-card__body">
        {/* Left: Blood badge + hospital */}
        <div className="case-card__info">
          <div className="case-blood-badge">
            <span className="case-blood-badge__type blood-badge">{data.bloodGroup}</span>
            <span className="case-blood-badge__label label-md">{data.componentType || 'Whole Blood'}</span>
          </div>
          <div className="case-card__hospital">
            <h3 className="headline-sm">{data.hospitalName}</h3>
            <p className="body-sm text-muted">📍 {data.department}</p>
            <p className="body-sm">
              <strong>Patient: {data.patientName || 'Anonymous'}</strong>
            </p>
          </div>
        </div>

        {/* Center: Progress */}
        <div className="case-card__progress">
          <div className="flex items-center justify-between">
            <span className="label-md">
              {fulfilled ? '✅ All' : '📋'} {data.unitsSecured} of {data.unitsNeeded} Units Secured
            </span>
            <span className="label-lg">{progressPercent}% {fulfilled ? 'Complete' : 'Filled'}</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar__fill ${fulfilled ? 'progress-bar__fill--secondary' : 'progress-bar__fill--primary'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Responders */}
          {data.matchedDonors && data.matchedDonors.length > 0 && (
            <div className="case-card__responders">
              <span className="label-md text-muted">MATCHED RESPONDERS</span>
              <div className="flex items-center gap-md flex-wrap">
                {data.matchedDonors.map((r, i) => (
                  <div key={i} className="responder-tag">
                    <span className="pulse-dot"></span>
                    <span className="label-md">Donor</span>
                    <span className="status-badge status-badge--available">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: CTA */}
        <div className="case-card__cta">
          <button className={`btn ${fulfilled ? 'btn-outline' : 'btn-primary'}`}>
            {fulfilled ? 'View Report' : '❤️ Respond as Donor'}
          </button>
        </div>
      </div>
    </article>
  );
}
