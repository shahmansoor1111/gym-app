export default function PageWrapper({ title, subtitle, icon, children, accentColor = "#e53e00" }) {
  return (
    <>
      <style>{`
        .page-wrapper {
          padding-top: 68px;
          min-height: 100vh;
          background: #0a0a0a;
        }
        .page-hero {
          background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
          border-bottom: 3px solid ${accentColor};
          padding: 3rem 2rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .page-hero::before {
          content: '';
          position: absolute;
          right: -60px; top: -60px;
          width: 300px; height: 300px;
          background: ${accentColor};
          opacity: 0.04;
          border-radius: 50%;
        }
        .page-hero-icon {
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        .page-hero h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 5vw, 3.5rem);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 0.4rem;
          color: #fff;
          line-height: 1;
        }
        .page-hero h1 span { color: ${accentColor}; }
        .page-hero p {
          color: #888;
          font-size: 1rem;
          margin: 0;
          max-width: 500px;
        }
        .page-content {
          padding: 2.5rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
      <div className="page-wrapper">
        <div className="page-hero">
          <span className="page-hero-icon">{icon}</span>
          <h1 dangerouslySetInnerHTML={{ __html: title }} />
          <p>{subtitle}</p>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </>
  );
}
