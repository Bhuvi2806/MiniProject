import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  bloodGroupCounts,
  matchedDonors,
  donorSummaryStats,
  mapCenter,
  hospitalMarkers
} from '../../data/mockData';
import { matchDonors } from '../../services/api';
import './FindDonors.css';

export default function FindDonors() {
  const [activeGroup, setActiveGroup] = useState('ALL');
  const [locationInput, setLocationInput] = useState('GSVM Medical College, Kanpur');
  const [distanceRange, setDistanceRange] = useState('10');
  const [component, setComponent] = useState('All Components (Whole Blood)');
  const [sortBy, setSortBy] = useState('proximity');
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState('');

  // Runs the rule-based matching engine (POST /api/match)
  // Future Scope: engine swaps to LLM agent — this handler stays unchanged.
  const handleBroadcast = async () => {
    if (!activeGroup || activeGroup === 'ALL') {
      setMatchError('Please select a specific blood group before broadcasting.');
      return;
    }
    setMatchLoading(true);
    setMatchError('');
    setMatchResult(null);
    try {
      const result = await matchDonors({
        hospital: {
          name: 'GSVM Medical College (LLR Hospital)',
          locality: 'Swaroop Nagar',
          latitude: 26.4787938,
          longitude: 80.3092968,
        },
        request: {
          blood_group_needed: activeGroup,
          units_needed: 2,
          urgency: 'urgent',
        },
        radius_km: Number(distanceRange),
      });
      setMatchResult(result);
    } catch (err) {
      setMatchError(err.message);
    } finally {
      setMatchLoading(false);
    }
  };

  const allGroups = Object.keys(bloodGroupCounts);

  // Simple filter
  const filteredDonors = matchedDonors.filter((d) => {
    if (activeGroup === 'ALL') return true;
    return d.bloodGroup === activeGroup;
  });

  return (
    <div className="find-donors-page">
      {/* ── Critical Shortage Alert ── */}
      <div className="shortage-alert">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="shortage-alert__badge">CRITICAL SHORTAGE ALERT</span>
            <p className="shortage-alert__text">
              O-Negative & B-Negative blood needed urgently in Metro General sector. Fast-track courier standing by.
            </p>
          </div>
          <div className="flex items-center gap-md">
            <span className="body-sm" style={{ color: 'var(--text-white)', opacity: 0.85 }}>⏰ 4 Units Needed ASAP</span>
            <button className="btn btn-outline shortage-alert__cta">
              Donate Now (O- / B-) →
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Page Header ── */}
        <section className="find-header">
          <div className="find-header__left">
            <span className="label-md text-primary">⚙ PRECISION GEO-MATCHING ENGINE</span>
            <h1 className="headline-xl">Find Verified Blood Donors</h1>
            <p className="body-md text-muted">
              Screen, filter, and dispatch verified donors within acute clinical transit windows.
            </p>
          </div>
          <div className="find-header__stats">
            <div className="flex items-center gap-sm">
              <span className="pulse-dot"></span>
              <span className="label-lg">Live Dispatch Ready</span>
            </div>
            <span className="label-lg tabular-nums">98.4% Match Reliability</span>
          </div>
        </section>

        {/* ── Blood Group Chip Filter (with counts) ── */}
        <section className="blood-group-selector" aria-label="Filter by blood group">
          <p className="label-md text-muted">Select Recipient or Matching Blood Group</p>
          <div className="blood-group-selector__chips">
            {allGroups.map((group) => {
              const isUrgent = group === 'O-' || group === 'B-';
              return (
                <button
                  key={group}
                  className={`blood-group-chip ${activeGroup === group ? 'blood-group-chip--active' : ''}`}
                  onClick={() => setActiveGroup(group)}
                >
                  {isUrgent && <span className="blood-group-chip__urgent-tag">{group === 'O-' ? 'URGENT' : 'RARE'}</span>}
                  <span className="blood-group-chip__type blood-badge">{group}</span>
                  <span className="blood-group-chip__count tabular-nums">{bloodGroupCounts[group]} {group === 'ALL' ? 'Live' : 'Donors'}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Search Filters ── */}
        <section className="search-filters card">
          <div className="search-filters__grid">
            <div className="search-filter-group">
              <label className="label-md text-muted">Hospital or Geo Center</label>
              <div className="input-with-icon">
                <span className="input-icon">🏥</span>
                <input
                  type="text"
                  className="input"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Hospital or Geo Center"
                />
              </div>
            </div>
            <div className="search-filter-group">
              <label className="label-md text-muted">Transit Range</label>
              <select
                className="input select"
                value={distanceRange}
                onChange={(e) => setDistanceRange(e.target.value)}
              >
                <option value="5">Within 5 miles (~8 r)</option>
                <option value="10">Within 10 miles (~24 r)</option>
                <option value="25">Within 25 miles (~40 r)</option>
                <option value="50">Within 50 miles (~80 r)</option>
              </select>
            </div>
            <div className="search-filter-group">
              <label className="label-md text-muted">Requisition Component</label>
              <select
                className="input select"
                value={component}
                onChange={(e) => setComponent(e.target.value)}
              >
                <option>All Components (Whole Blood)</option>
                <option>Red Blood Cells</option>
                <option>Platelets</option>
                <option>Plasma</option>
              </select>
            </div>
            <div className="search-filter-actions">
              <label className="search-filter-checkbox">
                <input type="checkbox" defaultChecked /> 
                <span className="label-md">Ready &lt; 2 hrs</span>
              </label>
              <button className="btn btn-primary">
                🔍 Search {bloodGroupCounts[activeGroup] || bloodGroupCounts.ALL} Donors
              </button>
            </div>
          </div>
        </section>

        {/* ── Summary Stats ── */}
        <section className="donor-summary-row">
          <div className="donor-summary-stat">
            <span className="donor-summary-stat__icon">👥</span>
            <strong className="tabular-nums">{donorSummaryStats.activeDonorsNearby}</strong> Active Donors within {donorSummaryStats.radius} miles
          </div>
          <div className="donor-summary-stat">
            <span className="donor-summary-stat__icon">🚗</span>
            Avg Dispatch: <strong>{donorSummaryStats.avgDispatchTime}</strong>
          </div>
          <div className="donor-summary-stat text-secondary">
            ✅ <strong>{donorSummaryStats.requestsFulfilledToday}</strong> Hospital Requests fulfilled today
          </div>
          <div className="donor-summary-stat text-muted">
            ✅ FDA / AABB Standard Compliant
          </div>
        </section>

        {/* ── Main Content: Donor List + Sidebar ── */}
        <div className="find-main-grid">
          {/* Left: Donor List */}
          <div className="donor-list-section">
            <div className="donor-list-header">
              <div>
                <h2 className="headline-md">Matched Responders</h2>
                <span className="status-badge status-badge--critical">{filteredDonors.filter(d => d.urgent).length} Urgent Matches</span>
              </div>
              <div className="flex items-center gap-md">
                <span className="label-md text-muted">Sort by:</span>
                <select
                  className="input select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="proximity">Proximity: Closest First</option>
                  <option value="response">Response Time</option>
                  <option value="donations">Donation Count</option>
                </select>
              </div>
            </div>

            {/* Donor Cards */}
            <div className="donor-cards-list">
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.id} data={donor} />
              ))}
              {filteredDonors.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p className="headline-sm text-muted">No donors match the selected blood group</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <span className="body-sm text-muted">Showing {filteredDonors.length} of {donorSummaryStats.activeDonorsNearby} Nearby Donors</span>
              <div className="pagination__controls">
                <button className="btn btn-outline btn-sm" disabled>Previous</button>
                <button className="btn btn-primary btn-sm">1</button>
                <button className="btn btn-outline btn-sm">2</button>
                <button className="btn btn-outline btn-sm">3</button>
                <button className="btn btn-outline btn-sm">Next</button>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="find-sidebar">
            {/* Proximity Map */}
            <div className="sidebar-map card">
              <div className="sidebar-map__header">
                <h3 className="label-lg">🏥 Metro Proximity Map</h3>
                <span className="flex items-center gap-xs">
                  <span className="pulse-dot"></span>
                  <span className="label-md">18 Pins Live</span>
                </span>
              </div>
              {/* FUTURE SCOPE: Live GPS mesh map — currently illustrative Leaflet/OSM */}
              <div className="sidebar-map__container">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '240px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {hospitalMarkers.slice(0, 3).map((hospital, idx) => (
                    <Marker key={idx} position={[hospital.lat, hospital.lon]}>
                      <Popup>{hospital.name}</Popup>
                    </Marker>
                  ))}
                  <Marker position={[26.455, 80.340]}>
                    <Popup>Donor: O- (1.8mi)</Popup>
                  </Marker>
                  <Marker position={[26.460, 80.360]}>
                    <Popup>Donor: A+ (3.4mi)</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="sidebar-map__footer">
                <span className="body-sm text-muted">📍 14 Transit Match Points</span>
                <button className="btn btn-outline btn-sm">Full View</button>
              </div>
            </div>

            {/* Broadcast Emergency Alert */}
            {/* FUTURE SCOPE: Mass rapid-alert via SMS — locked stack uses Nodemailer email only */}
            <div className="sidebar-broadcast card">
              <div className="sidebar-broadcast__header">
                <span className="label-md text-primary">🚨 LIFE-SUPPORT PROTOCOL</span>
              </div>
              <h3 className="headline-sm">Need Emergency Blood Right Now?</h3>
              <p className="body-sm text-muted">
                Initiates mass rapid-alert to every verified donor within 15 miles and notifies emergency trauma dispatch.
              </p>
              <ol className="sidebar-broadcast__steps">
                <li className="sidebar-broadcast__step">
                  <span className="sidebar-broadcast__step-num">1</span>
                  <div>
                    <span className="label-lg">Select patient blood type</span>
                    <p className="body-sm text-muted">Compatible whole or packed cells locked.</p>
                  </div>
                </li>
                <li className="sidebar-broadcast__step">
                  <span className="sidebar-broadcast__step-num">2</span>
                  <div>
                    <span className="label-lg">Alert 45 nearby matched donors</span>
                    {/* FUTURE SCOPE: Simultaneous SMS, automated call & push ping */}
                    <p className="body-sm text-muted">Email notification to matched donors.</p>
                  </div>
                </li>
                <li className="sidebar-broadcast__step">
                  <span className="sidebar-broadcast__step-num">3</span>
                  <div>
                    <span className="label-lg">Dispatch verification</span>
                    {/* FUTURE SCOPE: Live GPS tracking directly into receptor facility */}
                    <p className="body-sm text-muted">Confirmation tracking to receptor facility.</p>
                  </div>
                </li>
              </ol>
              <div className="sidebar-broadcast__stats">
                <span className="pulse-dot"></span>
                <span className="label-md text-secondary">99.4% acceptance within 15 minutes in this sector</span>
              </div>
              <button
                className="btn btn-primary sidebar-broadcast__cta"
                onClick={handleBroadcast}
                disabled={matchLoading}
              >
                {matchLoading ? '⏳ Matching...' : '📡 Broadcast Emergency Alert'}
              </button>

              {/* ── Match Engine Result ── */}
              {matchError && (
                <p className="body-sm text-primary" style={{ marginTop: 'var(--space-sm)' }}>
                  ⚠️ {matchError}
                </p>
              )}
              {matchResult && matchResult.best_match && (
                <div className="match-result">
                  <p className="label-md text-secondary">✅ Best Match Found</p>
                  <p className="label-lg">{matchResult.best_match.name}</p>
                  <p className="body-sm text-muted">{matchResult.best_match.reason}</p>
                  {matchResult.alternates.length > 0 && (
                    <p className="body-sm text-muted">
                      +{matchResult.alternates.length} alternate(s) available
                    </p>
                  )}
                  <p className="body-sm text-muted" style={{ fontStyle: 'italic' }}>
                    {matchResult.locality_coverage_note}
                  </p>
                </div>
              )}
              {matchResult && !matchResult.best_match && (
                <div className="match-result">
                  <p className="body-sm text-primary">⚠️ {matchResult.locality_coverage_note}</p>
                </div>
              )}

              <p className="label-md text-muted" style={{ textAlign: 'center' }}>
                Toll-Free Direct Dispatch: <strong>1-800-BLOODLINK</strong>
              </p>
            </div>

            {/* Clinical Screening */}
            <div className="sidebar-screening card">
              <h3 className="label-lg">🔬 Verified Clinical Screening</h3>
              <p className="body-sm text-muted">
                All donors listed maintain active serological certifications including HIV, Hepatitis B/C, and rapid antibody panels.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


/* ─── Donor Card Sub-component ─────────────────────────────── */
function DonorCard({ data }) {
  const ctaClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
  };

  return (
    <article className="donor-card card">
      <div className="donor-card__body">
        {/* Blood Badge */}
        <div className={`donor-card__badge ${data.urgent ? 'donor-card__badge--urgent' : ''}`}>
          <span className="blood-badge">{data.bloodGroup}</span>
          <span className="donor-card__badge-label">{data.bloodLabel}</span>
          {data.statusColor === 'available' && <span className="pulse-dot" style={{ marginTop: 4 }}></span>}
        </div>

        {/* Info */}
        <div className="donor-card__info">
          <div className="donor-card__name-row">
            <h3 className="headline-sm">{data.name}</h3>
            {data.badge && <span className="donor-card__tag">{data.badge}</span>}
          </div>
          <div className="donor-card__meta">
            {data.donations && (
              <span className="body-sm">🏅 {data.donations} Donations{data.donationYear ? ` in ${data.donationYear}` : ''}</span>
            )}
          </div>
          <div className="donor-card__status-row">
            <span className={`status-badge status-badge--${data.statusColor}`}>
              {data.statusColor === 'available' && <span className="pulse-dot" style={{ width: 6, height: 6 }}></span>}
              {data.status}
            </span>
            <span className="body-sm text-muted">• {data.distance}</span>
            {data.location && <span className="body-sm text-muted">• {data.location}</span>}
            {data.responseTime && <span className="body-sm text-muted">• ⚡ {data.responseTime}</span>}
          </div>
          {data.lastDonated && (
            <p className="body-sm text-secondary">Eligible Today • {data.lastDonated}</p>
          )}
          <p className="body-sm text-muted donor-card__cert">{data.certifications}</p>
        </div>

        {/* CTA */}
        <div className="donor-card__actions">
          <button className={ctaClasses[data.ctaVariant]}>
            {data.ctaVariant === 'primary' && '🚨 '}
            {data.ctaVariant === 'secondary' && '▶ '}
            {data.ctaVariant === 'outline' && '🏥 '}
            {data.cta}
          </button>
          {data.responseTime && (
            <span className="body-sm text-muted" style={{ textAlign: 'right' }}>{data.responseTime}</span>
          )}
          <button className="btn btn-outline btn-sm">🏥 View Clearance</button>
        </div>
      </div>
    </article>
  );
}
