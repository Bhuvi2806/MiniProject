import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  regionalStock,
  donationFacilities,
  eligibilityChecklist,
  mapCenter,
  hospitalMarkers
} from '../../data/mockData';
import './BloodBanks.css';

export default function BloodBanks() {
  const [activeTab, setActiveTab] = useState('all');
  const [headcount, setHeadcount] = useState(250);
  const [hostEmail, setHostEmail] = useState('');

  const estimatedDonors = Math.round(headcount * 0.2);
  const estimatedLives = estimatedDonors * 3;

  return (
    <div className="blood-banks-page">
      {/* ── Top Alert ── */}
      <div className="inventory-alert">
        <div className="container flex items-center justify-between">
          <p className="inventory-alert__text">
            <span className="inventory-alert__icon">⚠️</span>
            Emergency Inventory Deficit: Type O- and B- reserves are below 48-hour safety thresholds across 14 network facilities.
          </p>
          <div className="flex items-center gap-md">
            {/* FUTURE SCOPE: Live Dispatch Active — placeholder UI */}
            <span className="label-md">Live Dispatch Active</span>
            <button className="btn btn-outline inventory-alert__cta">View Protocol Stock</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Page Header ── */}
        <section className="bb-header">
          <div className="bb-header__left">
            <span className="label-md text-primary">🏥 METROPOLITAN BLOOD RESERVES • GRID SYNC 4M AGO</span>
            <h1 className="headline-xl">Blood Banks & Donation Drives</h1>
            <p className="body-md text-muted">
              Real-time institutional reserve tracker and appointment terminal. Mobilizing verified civilian donors into certified clinical transfusion hubs.
            </p>
          </div>
          <div className="bb-header__tabs">
            <button
              className={`bb-tab ${activeTab === 'all' ? 'bb-tab--active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Centers <span className="bb-tab__count">(18)</span>
            </button>
            <button
              className={`bb-tab ${activeTab === 'mobile' ? 'bb-tab--active' : ''}`}
              onClick={() => setActiveTab('mobile')}
            >
              Mobile Buses <span className="bb-tab__count">(5)</span>
            </button>
            <button
              className={`bb-tab ${activeTab === 'trauma' ? 'bb-tab--active' : ''}`}
              onClick={() => setActiveTab('trauma')}
            >
              Trauma Hubs <span className="bb-tab__count">(8)</span>
            </button>
          </div>
        </section>

        {/* ── Regional Stock Tracker ── */}
        <section className="stock-section card">
          <div className="stock-header">
            <div>
              <h2 className="headline-md">Regional Stock Tracker</h2>
              <p className="body-sm text-muted">Combined inventory across 24 affiliated clinical cold-storage vaults</p>
            </div>
            <div className="stock-legend">
              <div className="stock-legend__item">
                <span className="stock-legend__dot stock-legend__dot--critical"></span>
                <span className="label-md">Shortage (&lt;30%)</span>
              </div>
              <div className="stock-legend__item">
                <span className="stock-legend__dot stock-legend__dot--moderate"></span>
                <span className="label-md">Moderate</span>
              </div>
              <div className="stock-legend__item">
                <span className="stock-legend__dot stock-legend__dot--optimal"></span>
                <span className="label-md">Optimal (&gt;75%)</span>
              </div>
            </div>
          </div>

          <div className="stock-grid">
            {regionalStock.map((item) => (
              <StockCard key={item.group} data={item} />
            ))}
          </div>
        </section>

        {/* ── O-Negative Awareness Banner ── */}
        <section className="o-neg-banner alert-urgent">
          <div className="o-neg-banner__body">
            <span className="o-neg-banner__icon">⚠️</span>
            <div className="o-neg-banner__content">
              <h3 className="headline-sm">Why Type O- Negative is in Perpetually Urgent Demand</h3>
              <span className="status-badge status-badge--available" style={{ fontWeight: 700 }}>UNIVERSAL</span>
              <p className="body-sm text-muted" style={{ marginTop: 'var(--space-sm)' }}>
                Type O- red blood cells lack A, B, and Rh antigens, rendering them completely compatible with any human recipient.
                Emergency response squads, air ambulances, and level-1 trauma wards transfuse O- uncrossmatched when seconds
                determine patient survival before laboratory blood typing completes.
              </p>
            </div>
          </div>
          <div className="o-neg-banner__cta">
            <button className="btn btn-primary">Priority O- Donor Intake</button>
            <span className="body-sm text-secondary">✅ Double Red Cell eligible</span>
          </div>
        </section>

        {/* ── Main Content: Facilities + Sidebar ── */}
        <div className="bb-main-grid">
          {/* Left: Facilities */}
          <div className="facilities-section">
            <div className="facilities-header">
              <div>
                <h2 className="headline-md">Nearby Donation Facilities & Active Drives</h2>
                <p className="body-sm text-muted">Displaying verified operational sites sorted by real-time transit proximity</p>
              </div>
              <span className="label-md text-muted">📍 Location: Metro Central Core</span>
            </div>

            <div className="facilities-list">
              {donationFacilities.map((facility) => (
                <FacilityCard key={facility.id} data={facility} />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="bb-sidebar">
            {/* Drive Grid Map */}
            <div className="card">
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
                <h3 className="label-lg">Live Drive Grid</h3>
                <span className="status-badge status-badge--available">3 Drives Live</span>
              </div>
              {/* FUTURE SCOPE: Live drive grid map — illustrative Leaflet/OSM placeholder */}
              <div className="sidebar-map-wrap">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '200px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {hospitalMarkers.slice(0, 4).map((hospital, idx) => (
                    <Marker key={idx} position={[hospital.lat, hospital.lon]}>
                      <Popup>{hospital.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-sm)' }}>
                <span className="body-sm text-muted">📍 14 Transit Match Points</span>
                <button className="btn btn-outline btn-sm">Full View</button>
              </div>
              <div className="bb-transit-info">
                <div className="flex justify-between">
                  <span className="body-sm text-muted">Fastest transit route:</span>
                  <span className="label-md">Kanpur Ave Center (6 min drive)</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-sm text-muted">Active donor check-ins:</span>
                  <span className="label-lg tabular-nums">114 donors checked in</span>
                </div>
              </div>
            </div>

            {/* Can You Donate Today? */}
            <div className="card eligibility-card">
              <h3 className="headline-sm">🩸 Can You Donate Today?</h3>
              <p className="body-sm text-muted">
                Quick clinical check: Minimum age 16+ (with consent), weight at least 110 lbs,
                and no blood donation within the last 56 days.
              </p>
              <a href="#" className="label-lg text-primary eligibility-link">
                Take 60-Second Eligibility Quiz →
              </a>
              <ul className="eligibility-checklist">
                {eligibilityChecklist.map((item, i) => (
                  <li key={i} className="eligibility-item">
                    <span className={`eligibility-icon ${item.met === true ? 'eligibility-icon--yes' : item.met === false ? 'eligibility-icon--no' : 'eligibility-icon--unknown'}`}>
                      {item.met === true ? '✅' : item.met === false ? '❌' : '❓'}
                    </span>
                    <span className="body-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* First time giving blood */}
            <div className="card">
              <h3 className="label-lg">First time giving blood?</h3>
              <p className="body-sm text-muted">
                Hydrate with 16 oz of water and eat a nutritious, iron-rich meal 2 hours prior to your slot.
              </p>
            </div>
          </aside>
        </div>

        {/* ── Host a Blood Drive ── */}
        <section className="host-drive-section">
          <div className="host-drive-left">
            <span className="label-md text-primary">🏢 CORPORATE • ACADEMIC • CIVIC PARTNERSHIPS</span>
            <h2 className="headline-xl">Host a Blood Drive at Your Organization</h2>
            <p className="body-md text-muted">
              We bring certified phlebotomists, FDA-approved mobile units, and all medical cold-chain logistics directly to
              your office parking lot or conference hall at zero cost.
            </p>
            <div className="host-drive-impact-stats">
              <div className="impact-stat">
                <span className="impact-stat__value headline-lg text-primary tabular-nums">45</span>
                <span className="impact-stat__label body-sm text-muted">Avg lives saved per corporate drive</span>
              </div>
              <div className="impact-stat">
                <span className="impact-stat__value headline-lg text-secondary tabular-nums">0$</span>
                <span className="impact-stat__label body-sm text-muted">Cost to your firm or host venue</span>
              </div>
              <div className="impact-stat">
                <span className="impact-stat__value headline-lg tabular-nums">4 hrs</span>
                <span className="impact-stat__label body-sm text-muted">Turnkey setup to wrap-up time</span>
              </div>
            </div>
            <blockquote className="host-drive-quote">
              <p className="body-sm">
                "Our campus saved 128 trauma patients in one afternoon."
              </p>
              <cite className="label-md text-muted">TechCorp Global • Annual Spring Drive Host</cite>
            </blockquote>
          </div>

          <div className="host-drive-right card">
            <h3 className="headline-md">Drive Impact Estimator</h3>
            <p className="body-sm text-muted">Calculate potential lives touched by your team</p>

            <div className="estimator-slider-section">
              <div className="flex items-center justify-between">
                <span className="label-lg">Estimated Staff / Member Headcount</span>
                <span className="headline-md text-primary tabular-nums">{headcount} people</span>
              </div>
              <input
                type="range"
                min="10"
                max="2500"
                step="10"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="estimator-slider"
              />
              <div className="estimator-labels">
                <span className="label-md text-muted">Small Team (30)</span>
                <span className="label-md text-muted">Mid Campus (500)</span>
                <span className="label-md text-muted">Corporate (2,000+)</span>
              </div>
            </div>

            <div className="estimator-results">
              <div className="estimator-result card card-surface">
                <span className="label-md text-muted">Estimated Donors (20%)</span>
                <span className="headline-md tabular-nums">{estimatedDonors} donors</span>
                <span className="body-sm text-muted">🏥 Requires {Math.ceil(estimatedDonors / 15)} bus beds</span>
              </div>
              <div className="estimator-result card card-surface">
                <span className="label-md text-muted">Hospital Patients Saved</span>
                <span className="headline-md text-primary tabular-nums">{estimatedLives} lives</span>
                <span className="body-sm text-secondary">✨ Critical blood & plasma</span>
              </div>
            </div>

            <div className="estimator-cta-row">
              <input
                type="email"
                className="input"
                placeholder="Enter corporate or campus email"
                value={hostEmail}
                onChange={(e) => setHostEmail(e.target.value)}
              />
              <button className="btn btn-primary">Request Host Kit ▶</button>
            </div>
            <p className="label-md text-muted" style={{ textAlign: 'center' }}>
              Dedicated coordinator replies within 2 business hours • Full promotional toolkit supplied
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}


/* ─── Stock Card Sub-component ─────────────────────────────── */
function StockCard({ data }) {
  const barColor = data.percentage < 30 ? 'var(--primary-base)'
    : data.percentage < 50 ? '#F59E0B'
    : data.percentage < 75 ? '#3B82F6'
    : 'var(--secondary-base)';

  return (
    <div className="stock-card">
      <div className="stock-card__top">
        <span className="blood-badge">{data.group}</span>
        <span className="headline-sm tabular-nums">{data.percentage}%</span>
      </div>
      <div className="progress-bar" style={{ height: 6 }}>
        <div
          className="progress-bar__fill"
          style={{ width: `${data.percentage}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="stock-card__bottom">
        <span className={`status-badge status-badge--${data.statusColor}`}>
          {data.statusColor === 'critical' && '⚠ '}
          {data.status}
        </span>
        <span className="body-sm text-muted">{data.detail}</span>
      </div>
    </div>
  );
}

/* ─── Facility Card Sub-component ──────────────────────────── */
function FacilityCard({ data }) {
  const ctaClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
  };

  return (
    <article className="facility-card card">
      <div className="facility-card__header">
        <div className="flex items-center gap-sm flex-wrap">
          <span className="status-badge status-badge--available">{data.openHours}</span>
          <span className="body-sm text-muted">📍 {data.distance}</span>
          <span className="body-sm text-muted">🗓 {data.slotsAvailable || '?'} slots available today</span>
        </div>
        {data.urgentNeed && (
          <span className="status-badge status-badge--critical">{data.urgentNeed}</span>
        )}
      </div>
      <div className="facility-card__body">
        <div className="facility-card__info">
          <h3 className="headline-sm">{data.name}</h3>
          <p className="body-sm text-muted">{data.address}</p>
          <div className="facility-card__tags">
            {data.tags.map((tag, i) => (
              <span key={i} className="facility-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="facility-card__actions">
          <button className={ctaClasses[data.ctaVariant]}>{data.cta}</button>
          {data.nursesOnStation && (
            <span className="body-sm text-secondary flex items-center gap-xs">
              <span className="pulse-dot"></span> {data.nursesOnStation} Nurses on Station
            </span>
          )}
          {data.earlySlots && (
            <span className="body-sm text-muted">{data.earlySlots}</span>
          )}
          <button className="btn btn-outline btn-sm">📍 Navigate</button>
        </div>
      </div>
    </article>
  );
}
