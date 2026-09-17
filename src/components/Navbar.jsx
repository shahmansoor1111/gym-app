import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

const navItems = [
  { id: "home",      label: "Home",       icon: "🏠" },
  { id: "dashboard", label: "Dashboard",  icon: "📊" },
  { id: "members",   label: "Members",    icon: "👥" },
  { id: "exercises", label: "Exercises",  icon: "💪" },
  { id: "diet",      label: "Diet Plans", icon: "🥗" },
  { id: "alerts",    label: "Alerts",     icon: "🔔" },
  { id: "gallery",   label: "Gallery",    icon: "🖼️" },
  { id: "contact",   label: "Contact Us", icon: "📬" },
];

export default function Navbar({ currentPage, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [msgCount, setMsgCount] = useState(0);

  // Memoized fetch function
  const fetchCount = useCallback(async () => {
    const { count, error } = await supabase
      .from("enquiries")
      .select("*", { count: 'exact', head: true });

    if (!error) {
      setMsgCount(count || 0);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchCount();

    // Setup Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'enquiries'
      },
      () => fetchCount())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCount]);

  // Auto-close mobile menu when resizing back to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .nav-badge { background: #ef4444; color: white; padding: 1px 6px; border-radius: 10px; font-size: 0.7rem; font-weight: 800; margin-left: 5px; vertical-align: super; }
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(10,10,10,0.96); backdrop-filter: blur(12px); border-bottom: 2px solid #e53e00; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 68px; }
        .navbar-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none; }
        .logo-icon { width: 40px; height: 40px; background: #e53e00; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 900; color: #fff; }
        .logo-text { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 1.5rem; letter-spacing: 1px; color: #fff; }
        .logo-text span { color: #e53e00; }
        .nav-links { display: flex; align-items: center; gap: 0.2rem; list-style: none; margin: 0; padding: 0; }
        .nav-links li button { background: none; border: none; cursor: pointer; padding: 8px 13px; border-radius: 6px; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 0.88rem; color: #aaa; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
        .nav-links li button:hover { color: #fff; background: rgba(229,62,0,0.12); }
        .nav-links li button.active { color: #fff; background: #e53e00; }
        .hamburger { display: none; background: none; border: 2px solid #e53e00; border-radius: 6px; color: #e53e00; font-size: 1.3rem; cursor: pointer; padding: 4px 10px; }
        .mobile-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; background: #111; border-bottom: 2px solid #e53e00; padding: 1rem; flex-direction: column; z-index: 999; }
        .mobile-menu.open { display: flex; }
        .mobile-menu button { background: none; border: none; color: #aaa; padding: 12px; font-size: 1rem; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 10px; }
        .mobile-menu button.active { color: #fff; background: #e53e00; }
        @media (max-width: 900px) { .nav-links { display: none; } .hamburger { display: block; } }

        /* Force-hide mobile dropdown on desktop, regardless of open state */
        @media (min-width: 901px) {
          .mobile-menu {
            display: none !important;
          }
          .hamburger {
            display: none !important;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("home")}>
          <div className="logo-icon">FG</div>
          <div className="logo-text">FLEX<span>GYM</span></div>
        </div>

        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.id}>
              <button className={currentPage === item.id ? "active" : ""} onClick={() => navigate(item.id)}>
                {item.icon} {item.label}
                {item.id === "contact" && msgCount > 0 && <span className="nav-badge">{msgCount}</span>}
              </button>
            </li>
          ))}
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navItems.map(item => (
          <button key={item.id} className={currentPage === item.id ? "active" : ""} onClick={() => { navigate(item.id); setMenuOpen(false); }}>
            {item.icon} {item.label}
            {item.id === "contact" && msgCount > 0 && <span className="nav-badge">{msgCount}</span>}
          </button>
        ))}
      </div>
    </>
  );
}