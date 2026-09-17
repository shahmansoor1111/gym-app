import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../supabaseClient";

export default function Dashboard({ navigate }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Finance visibility aur custom modal control karne ke liye states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputPin, setInputPin] = useState("");
  const [modalError, setModalError] = useState("");

  // 1. Supabase se live records khinchne ka function
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("members")
        .select("*");

      if (error) {
        console.error("Dashboard fetch error:", error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // 2. LIVE DATA MATHEMATICS WITH MULTIPLE PLANS (Calculations)
  const totalMembers = members.length;
  const paidMembersList = members.filter(m => m.status?.toLowerCase() === "paid");
  const unpaidMembersList = members.filter(m => m.status?.toLowerCase() === "unpaid");

  const paidMembersCount = paidMembersList.length;
  const unpaidMembersCount = unpaidMembersList.length;
  
  // Active Ratio (%) Calculation
  const activeRatio = totalMembers > 0 ? Math.round((paidMembersCount / totalMembers) * 100) : 0;

  // Helper function: Plan ke mutabiq fees nikalne ke liye
  const getPlanFee = (planName) => {
    const plan = planName?.toLowerCase() || "";
    if (plan.includes("quarterly")) {
      return 5000;  // Quarterly Plan = Rs. 5000
    } else if (plan.includes("yearly")) {
      return 15000; // Yearly Plan = Rs. 15000
    } else {
      return 2000;  // Monthly Pass / Default = Rs. 2000
    }
  };

  // Paid income calculate karna
  const monthlyIncome = paidMembersList.reduce((total, member) => {
    return total + getPlanFee(member.plan);
  }, 0);

  // Recent Activity ke liye top 4 naye members nikalna
  const recentMembers = [...members].reverse().slice(0, 4);

  // Finance card click handler (bina default alert/prompt ke)
  const handleFinanceCardClick = () => {
    if (isAdminAuthenticated) {
      // Agar pehle se unlocked hai toh click karne par wapas lock kar do
      setIsAdminAuthenticated(false);
    } else {
      // Warna custom professional popup open karo
      setInputPin("");
      setModalError("");
      setIsModalOpen(true);
    }
  };

  // Custom modal ke andar PIN verify karne ka logic
  const handleVerifyPin = () => {
    if (inputPin === "112233") {
      setIsAdminAuthenticated(true);
      setIsModalOpen(false);
      setInputPin("");
      setModalError("");
    } else {
      setModalError("❌ Invalid Admin PIN! Access Denied.");
    }
  };

  // Dynamic Array for rendering UI cards
  const stats = [
    { id: "total", label: "Total Members",    value: loading ? "..." : totalMembers,      icon: "👥", color: "#3b82f6", clickAction: null },
    { id: "paid", label: "Paid Members",     value: loading ? "..." : paidMembersCount,  icon: "✅", color: "#22c55e", clickAction: null },
    { id: "unpaid", label: "Unpaid Members",   value: loading ? "..." : unpaidMembersCount,icon: "❌", color: "#e53e00", clickAction: null },
    
    // Monthly Income Card: Click action handle karega custom popup ke sath
    { 
      id: "income",
      label: isAdminAuthenticated ? "Monthly Income (🔓 Unlocked)" : "Monthly Income (🔒 Click to Unlock)", 
      value: loading ? "..." : (isAdminAuthenticated ? `₨${monthlyIncome.toLocaleString()}` : "••••••"), 
      icon: "💰", 
      color: isAdminAuthenticated ? "#f59e0b" : "#555",
      clickAction: handleFinanceCardClick 
    },
    
    { id: "ratio", label: "Active Ratio",     value: loading ? "..." : `${activeRatio}%`, icon: "📈", color: "#a855f7", clickAction: null },
  ];

  return (
    <PageWrapper
      icon="📊"
      title='DASH<span>BOARD</span>'
      subtitle="Overview of gym performance, members, and financials"
    >
      <style>{`
        /* Stats Grid Dashboard Style */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card-wrapper {
          background: #0c0c0c;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 1.6rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card-wrapper:hover {
          transform: translateY(-4px);
        }
        
        /* Lock card styling for income toggle */
        .stat-card-clickable {
          cursor: pointer;
          border: 1px dashed #333;
        }
        .stat-card-clickable:hover {
          border-color: #f59e0b;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.1);
        }
        
        .stat-icon { font-size: 1.8rem; margin-bottom: 0.8rem; display: block; }
        .stat-value {
          font-family: 'Barlow', sans-serif;
          font-weight: 900;
          font-size: 2.2rem;
          letter-spacing: 0.5px;
          margin: 0 0 0.3rem;
          color: #fff;
        }
        .stat-label { color: #555; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }
        
        .section-title {
          font-family: 'Barlow', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin: 0 0 1.2rem;
          color: #e53e00;
        }

        /* Recent Activity Feed Styles */
        .activity-feed-wrap {
          background: #0c0c0c;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #141414;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-user-info { display: flex; align-items: center; gap: 12px; }
        .activity-avatar { background: #141414; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #e53e00; border: 1px solid #222; }
        .activity-name { color: #fff; font-weight: 600; font-size: 0.95rem; }
        .activity-plan { color: #555; font-size: 0.8rem; margin-top: 2px; }
        .activity-badge { font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; }
        .act-paid { background: rgba(34,197,94,0.1); color: #22c55e; }
        .act-unpaid { background: rgba(229,62,0,0.1); color: #e53e00; }

        .no-activity-text { color: #444; text-align: center; padding: 30px; font-size: 0.95rem; font-weight: 600; }

        /* Navigation Quick Links */
        .quick-links { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
        .quick-link-btn {
          background: #111;
          border: 1px solid #222;
          color: #888;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .quick-link-btn:hover { background: linear-gradient(135deg, #e53e00 0%, #ff5500 100%); color: #fff; border-color: #e53e00; box-shadow: 0 4px 15px rgba(229,62,0,0.2); transform: translateY(-2px); }

        /* Professional Custom Security Popup Modal Style */
        .sec-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.2s ease; }
        .sec-card { background: #0c0c0c; border: 1px solid #e53e00; padding: 2.2rem; border-radius: 16px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 0 30px rgba(229,62,0,0.2); animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .sec-icon { font-size: 2.5rem; margin-bottom: 1rem; display: inline-block; }
        .sec-card h4 { margin: 0 0 0.5rem 0; font-size: 1.3rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #fff; }
        .sec-card p { margin: 0 0 1.5rem 0; color: #aaa; font-size: 0.9rem; line-height: 1.4; }
        .sec-input { width: 100%; background: #141414; border: 1px solid #333; text-align: center; padding: 12px; border-radius: 8px; color: #fff; font-size: 1.2rem; letter-spacing: 4px; font-weight: 700; outline: none; margin-bottom: 0.5rem; transition: border-color 0.2s; }
        .sec-input:focus { border-color: #e53e00; box-shadow: 0 0 10px rgba(229,62,0,0.1); }
        .sec-error { color: #ff3333; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem; display: block; }
        .sec-actions { display: flex; gap: 0.8rem; justify-content: center; margin-top: 1rem; }
        .sec-cancel { background: #141414; border: 1px solid #222; color: #888; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; flex: 1; transition: all 0.2s; }
        .sec-cancel:hover { background: #222; color: #fff; }
        .sec-confirm { background: #e53e00; border: none; color: #fff; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; flex: 1; transition: all 0.2s; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
        .sec-confirm:hover { background: #ff4d00; box-shadow: 0 4px 12px rgba(229,62,0,0.3); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Stats Counter Cards */}
      <div className="stats-grid">
        {stats.map(s => (
          <div 
            className={`stat-card-wrapper ${s.clickAction ? "stat-card-clickable" : ""}`} 
            key={s.id} 
            style={{ borderTop: `3px solid ${s.color}` }}
            onClick={s.clickAction ? s.clickAction : undefined}
          >
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value" style={s.id === "income" && !isAdminAuthenticated ? { letterSpacing: "3px", color: "#444" } : {}}>
              {s.value}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 🔥 NEW: 100% Professional Custom Popup Modal instead of window.prompt */}
      {isModalOpen && (
        <div className="sec-overlay">
          <div className="sec-card">
            <span className="sec-icon">🛡️</span>
            <h4>Finance Verification</h4>
            <p>Please enter Admin Secure PIN to access gym monthly income and accounting details.</p>
            <input
              type="password"
              className="sec-input"
              placeholder="••••••"
              maxLength="6"
              value={inputPin}
              onChange={e => setInputPin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleVerifyPin()}
              autoComplete="new-password"
              autoFocus
            />
            {modalError && <span className="sec-error">{modalError}</span>}
            <div className="sec-actions">
              <button 
                type="button" 
                className="sec-cancel" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className="sec-confirm" onClick={handleVerifyPin}>
                Unlock Finance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Recent Activity Feed Section */}
      <div className="section-title">Recent Joinees & Status</div>
      <div className="activity-feed-wrap">
        {loading ? (
          <div className="no-activity-text">SYNCING LOGS WITH DATABASE...</div>
        ) : recentMembers.length === 0 ? (
          <div className="no-activity-text">📋 No recent member transactions available.</div>
        ) : (
          recentMembers.map(m => (
            <div className="activity-item" key={m.id}>
              <div className="activity-user-info">
                <div className="activity-avatar">{m.name ? m.name.charAt(0).toUpperCase() : "?"}</div>
                <div>
                  <div className="activity-name">{m.name || "N/A"}</div>
                  <div className="activity-plan">Enrolled in {m.plan || "Monthly Pass"}</div>
                </div>
              </div>
              <span className={`activity-badge ${m.status?.toLowerCase() === "paid" ? "act-paid" : "act-unpaid"}`}>
                {m.status || "Unpaid"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Navigation Links */}
      <div className="quick-links">
        <button className="quick-link-btn" onClick={() => navigate("members")}>👥 Manage Members</button>
        <button className="quick-link-btn" onClick={() => navigate("alerts")}>🔔 View Alerts</button>
        <button className="quick-link-btn" onClick={() => navigate("exercises")}>💪 Exercises</button>
      </div>
      

    </PageWrapper>
  );
}