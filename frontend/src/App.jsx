import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './pages/Login/Login';
import EmergencyDashboard from './pages/EmergencyDashboard/EmergencyDashboard';
import FindDonors from './pages/FindDonors/FindDonors';
import BloodBanks from './pages/BloodBanks/BloodBanks';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css';

export default function App() {
  // authState: { role: 'user'|'hospital', token: null }
  // Phase 2 demo — regex-only gate in Login.jsx.
  // Real shape (JWT + user object from Express) wired in Phase 1 backend.
  const [authState, setAuthState] = useState(null);

  if (!authState) {
    return <Login onLogin={(data) => setAuthState(data)} />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app__main">
          <Routes>
            {/* 
              Both roles see the dashboard for this demo.
              In Phase 4, the hospital admin view would be separate.
            */}
            <Route path="/" element={<EmergencyDashboard />} />
            <Route path="/find-donors" element={<FindDonors />} />
            <Route path="/blood-banks" element={<BloodBanks />} />
            <Route path="/eligibility" element={<PlaceholderPage title="Eligibility & Quiz" />} />
            <Route path="/community" element={<PlaceholderPage title="Community Impact" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

/* Placeholder for pages not in scope for this build */
function PlaceholderPage({ title }) {
  return (
    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 className="headline-xl" style={{ marginBottom: '1rem' }}>{title}</h1>
      <p className="body-lg text-muted">This page is planned for a future build phase.</p>
    </div>
  );
}
