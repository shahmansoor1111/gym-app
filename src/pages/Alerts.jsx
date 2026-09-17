import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../supabaseClient";

const colors = { overdue: "#e53e00", "due-soon": "#f59e0b", info: "#3b82f6" };
const icons  = { overdue: "🚨", "due-soon": "⚠️", info: "ℹ️" };
const labels = { overdue: "OVERDUE", "due-soon": "DUE SOON", info: "INFO" };

export default function Alerts() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Supabase se fresh records fetch karna
  useEffect(() => {
    const fetchAlertsData = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("members")
        .select("*");

      if (error) {
        console.error("Alerts data fetch error:", error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };

    fetchAlertsData();
  }, []);

  // Helper Function: Plan cost generator
  const getPlanFee = (planName) => {
    const plan = planName?.toLowerCase() || "";
    if (plan.includes("quarterly")) return 5000;
    if (plan.includes("yearly")) return 15000;
    return 2000; // Monthly pass
  };

  // 2. LIVE DATE CALCULATIONS & ALERT ENGINE
  const generatedAlerts = [];
  let overdueCount = 0;
  let dueSoonCount = 0;
  let expiringCount = 0;
  let pendingTotalAmount = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time factor for accurate day diffs

  members.forEach(member => {
    if (!member.due_date) return;

    const dueDate = new Date(member.due_date);
    dueDate.setHours(0, 0, 0, 0);

    // Days difference calculate karna
    const timeDiff = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const feeAmount = getPlanFee(member.plan);
    const formattedAmount = `₨${feeAmount.toLocaleString()}`;

    // CASE A: Fee Unpaid hai aur due date guzar chuki hai (OVERDUE)
    if (member.status?.toLowerCase() === "unpaid" && diffDays < 0) {
      overdueCount++;
      pendingTotalAmount += feeAmount;
      generatedAlerts.push({
        type: "overdue",
        member: member.name || "Unknown Member",
        msg: `Payment overdue by ${Math.abs(diffDays)} days.`,
        amount: formattedAmount,
        date: member.due_date
      });
    }
    // CASE B: Fee Unpaid hai aur due date aane wali hai (DUE SOON - 0 se 7 din ke andar)
    else if (member.status?.toLowerCase() === "unpaid" && diffDays >= 0 && diffDays <= 7) {
      dueSoonCount++;
      pendingTotalAmount += feeAmount;
      generatedAlerts.push({
        type: "due-soon",
        member: member.name || "Unknown Member",
        msg: diffDays === 0 ? "Payment is due today!" : `Payment due in ${diffDays} days.`,
        amount: formattedAmount,
        date: member.due_date
      });
    }
    // CASE C: Fee Paid hai lekin package end hone wala hai (INFO - Aglay 15 din mein due)
    else if (member.status?.toLowerCase() === "paid" && diffDays >= 0 && diffDays <= 15) {
      expiringCount++;
      generatedAlerts.push({
        type: "info",
        member: member.name || "Unknown Member",
        msg: `Current tier expires in ${diffDays} days. Renewal upcoming.`,
        amount: formattedAmount,
        date: member.due_date
      });
    }
  });

  // Sort Alerts so that Overdue always stays on top
  generatedAlerts.sort((a, b) => {
    const order = { overdue: 1, "due-soon": 2, info: 3 };
    return order[a.type] - order[b.type];
  });

  return (
    <PageWrapper
      icon="🔔"
      title='PAY<span>MENT ALERTS</span>'
      subtitle="Track unpaid fees and upcoming payment due dates"
      accentColor="#f59e0b"
    >
      <style>{`
        /* Alert Summary Cards styling */
        .alert-summary { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .alert-sum-card {
          flex: 1;
          min-width: 140px;
          background: #0c0c0c;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 1.2rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .alert-sum-val {
          font-family: 'Barlow', sans-serif;
          font-weight: 900;
          font-size: 2rem;
        }
        .alert-sum-label { font-size: 0.78rem; color: #555; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
        
        /* Alerts List view */
        .alert-list { display: grid; gap: 0.8rem; }
        .alert-card {
          background: #0c0c0c;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }
        .alert-card:hover { transform: translateX(4px); }
        .alert-icon-box {
          width: 42px; height: 42px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .alert-body { flex: 1; min-width: 150px; }
        .alert-member { font-weight: 700; color: #fff; font-size: 0.95rem; }
        .alert-msg { color: #aaa; font-size: 0.85rem; margin-top: 4px; }
        
        .alert-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .alert-amount-wrap { text-align: right; min-width: 90px; }
        .alert-amount { font-family: 'Barlow', sans-serif; font-weight: 900; font-size: 1.2rem; }
        .alert-date { font-size: 0.8rem; color: #555; margin-top: 2px; font-family: monospace; }
        
        .section-label {
          font-family: 'Barlow', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #e53e00;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
        }
        .no-alerts { color: #444; font-weight: 600; text-align: center; padding: 40px; background: #0c0c0c; border: 1px dashed #1a1a1a; border-radius: 12px; }
      `}</style>

      {/* Dynamic Summary Cards Layout */}
      <div className="alert-summary">
        <div className="alert-sum-card">
          <div className="alert-sum-val" style={{ color: "#e53e00" }}>{loading ? "..." : overdueCount}</div>
          <div className="alert-sum-label">Overdue</div>
        </div>
        <div className="alert-sum-card">
          <div className="alert-sum-val" style={{ color: "#f59e0b" }}>{loading ? "..." : dueSoonCount}</div>
          <div className="alert-sum-label">Due Soon</div>
        </div>
        <div className="alert-sum-card">
          <div className="alert-sum-val" style={{ color: "#3b82f6" }}>{loading ? "..." : expiringCount}</div>
          <div className="alert-sum-label">Upcoming</div>
        </div>
        <div className="alert-sum-card">
          <div className="alert-sum-val" style={{ color: "#22c55e" }}>
            {loading ? "..." : `₨${pendingTotalAmount.toLocaleString()}`}
          </div>
          <div className="alert-sum-label">Pending Total</div>
        </div>
      </div>

      <div className="section-label">Active System Notifications</div>
      
      <div className="alert-list">
        {loading ? (
          <div className="no-alerts">GENERATING SYSTEM INTELLIGENCE LOGS...</div>
        ) : generatedAlerts.length === 0 ? (
          <div className="no-alerts">🎉 Awesome! No pending dues or payment alerts at the moment.</div>
        ) : (
          generatedAlerts.map((a, i) => (
            <div className="alert-card" key={i} style={{ borderLeft: `3px solid ${colors[a.type]}` }}>
              <div className="alert-icon-box" style={{ background: `${colors[a.type]}15` }}>
                {icons[a.type]}
              </div>
              <div className="alert-body">
                <div className="alert-member">{a.member}</div>
                <div className="alert-msg">{a.msg}</div>
              </div>
              <span className="alert-badge" style={{ background: `${colors[a.type]}15`, color: colors[a.type] }}>
                {labels[a.type]}
              </span>
              <div className="alert-amount-wrap">
                <div className="alert-amount" style={{ color: colors[a.type] }}>{a.amount}</div>
                <div className="alert-date">{a.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}