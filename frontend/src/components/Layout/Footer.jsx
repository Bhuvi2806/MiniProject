import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Emergency hotline bar */}
      <div className="footer__hotline">
        <div className="container flex items-center justify-between">
          <p className="footer__hotline-text">
            <span className="footer__hotline-icon">📞</span>
            <strong>Need immediate emergency hospital matching?</strong> 24/7 Hotline: 1-800-BLOODLINK
          </p>
          <span className="footer__dispatch-tag">Rapid Transfusion Dispatch Unit</span>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="footer__bottom">
        <div className="container flex items-center justify-between flex-wrap gap-md">
          <p className="body-sm text-muted">
            ✅ Verified Blood Transfusion Network Protocol
          </p>
          <nav className="footer__links">
            <a href="#" className="footer__link">Donor Privacy Pledge</a>
            <a href="#" className="footer__link">Clinical Accreditation</a>
            <a href="#" className="footer__link">Hospital API</a>
          </nav>
          <p className="body-sm text-muted">
            © 2025 BloodLink LifeBlood Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
