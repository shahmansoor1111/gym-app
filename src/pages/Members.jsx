import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../supabaseClient";

export default function Members() {
  const [members,        setMembers]        = useState([]);
  const [search,         setSearch]         = useState("");
  const [loading,        setLoading]        = useState(true);
  const [showDrawer,     setShowDrawer]     = useState(false);
  const [isEditMode,     setIsEditMode]     = useState(false);
  const [editingMemberId,setEditingMemberId]= useState(null);
  const [newName,        setNewName]        = useState("");
  const [newPlan,        setNewPlan]        = useState("Monthly");
  const [newStatus,      setNewStatus]      = useState("Paid");
  const [newDue,         setNewDue]         = useState("");

  const [securityModal, setSecurityModal] = useState({
    isOpen: false, type: "", targetId: null, errorMessage: ""
  });
  const [inputPin, setInputPin] = useState("");
  const [toast,    setToast]    = useState({ show: false, message: "", type: "success" });

  const showToastNotification = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("members").select("*");
    if (error) console.error("Fetch error:", error);
    else setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = showDrawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showDrawer]);

  const openAddDrawer = () => {
    setIsEditMode(false); setEditingMemberId(null);
    setNewName(""); setNewPlan("Monthly"); setNewStatus("Paid"); setNewDue("");
    setShowDrawer(true);
  };

  const openEditDrawer = (member) => {
    setIsEditMode(true); setEditingMemberId(member.id);
    setNewName(member.name || ""); setNewPlan(member.plan || "Monthly");
    setNewStatus(member.status || "Paid"); setNewDue(member.due_date || member.due || "");
    setShowDrawer(true);
  };

  const closeDrawer = () => setShowDrawer(false);

  const triggerFormVerification = (e) => {
    e.preventDefault();
    if (!newName || !newDue) {
      showToastNotification("⚠️ Name and Due Date are required!", "error");
      return;
    }
    setInputPin("");
    setSecurityModal({ isOpen: true, type: isEditMode ? "edit" : "add", targetId: editingMemberId, errorMessage: "" });
  };

  const triggerDeleteVerification = (id) => {
    setInputPin("");
    setSecurityModal({ isOpen: true, type: "delete", targetId: id, errorMessage: "" });
  };

  const handleSecurityVerify = async () => {
    if (inputPin !== "1234") {
      setSecurityModal(prev => ({ ...prev, errorMessage: "❌ Invalid Admin PIN! Access Denied." }));
      return;
    }
    if (securityModal.type === "add") {
      const { error } = await supabase.from("members").insert([{ name: newName, plan: newPlan, status: newStatus, due_date: newDue }]);
      if (error) showToastNotification("❌ Could not save: " + error.message, "error");
      else { showToastNotification("🎯 New member added successfully!"); fetchMembers(); closeDrawer(); }
    } else if (securityModal.type === "edit") {
      const { error } = await supabase.from("members").update({ name: newName, plan: newPlan, status: newStatus, due_date: newDue }).eq("id", securityModal.targetId);
      if (error) showToastNotification("❌ Update failed: " + error.message, "error");
      else { showToastNotification("⚡ Member record updated!"); fetchMembers(); closeDrawer(); }
    } else if (securityModal.type === "delete") {
      const { error } = await supabase.from("members").delete().eq("id", securityModal.targetId);
      if (error) showToastNotification("❌ Delete failed.", "error");
      else { showToastNotification("🗑️ Record permanently deleted."); fetchMembers(); }
    }
    setSecurityModal({ isOpen: false, type: "", targetId: null, errorMessage: "" });
    setInputPin("");
  };

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper
      icon="👥"
      title='MEM<span>BERS</span>'
      subtitle="Add, edit, and manage gym member records and payment status"
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        /* ── TOOLBAR ── */
        .mem-toolbar {
          display: flex; gap: 1rem;
          margin-bottom: 2rem; flex-wrap: wrap; align-items: center;
        }
        .mem-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .mem-search {
          width: 100%; background: #141414; border: 1px solid #222;
          border-radius: 10px; color: #fff; padding: 12px 16px 12px 42px;
          font-family: 'Barlow', sans-serif; font-size: 0.95rem; outline: none;
          transition: all 0.3s;
        }
        .mem-search:focus { border-color: #e53e00; background: #161616; box-shadow: 0 0 15px rgba(229,62,0,0.15); }
        .mem-search::placeholder { color: #555; }
        .mem-search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #555; pointer-events: none; }

        .mem-add-btn {
          background: linear-gradient(135deg, #e53e00, #ff5500);
          border: none; color: #fff; padding: 12px 22px;
          border-radius: 10px; font-family: 'Barlow', sans-serif;
          font-weight: 700; cursor: pointer; font-size: 0.9rem;
          white-space: nowrap; letter-spacing: 0.5px;
          transition: all 0.3s; box-shadow: 0 4px 15px rgba(229,62,0,0.2);
          display: flex; align-items: center; gap: 7px;
        }
        .mem-add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(229,62,0,0.4); }

        /* ── STAT STRIP (mobile summary) ── */
        .mem-stat-strip {
          display: none;
          gap: 0.75rem; margin-bottom: 1.5rem;
        }
        .mem-stat-pill {
          flex: 1; background: #111; border: 1px solid #1e1e1e;
          border-radius: 10px; padding: 0.75rem 1rem;
          text-align: center;
        }
        .mem-stat-pill-val {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: 1.4rem; color: #e53e00; display: block; line-height: 1;
        }
        .mem-stat-pill-lbl { font-size: 0.7rem; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; display: block; }

        /* ── DESKTOP TABLE ── */
        .mem-table-wrap {
          overflow-x: auto; background: #0c0c0c;
          border: 1px solid #1a1a1a; border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          -webkit-overflow-scrolling: touch;
        }
        .mem-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 560px; }
        .mem-table th {
          background: #111; color: #777;
          font-size: 0.75rem; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 18px 24px; font-weight: 700; border-bottom: 1px solid #1a1a1a;
          white-space: nowrap;
        }
        .mem-table td {
          padding: 16px 24px; border-bottom: 1px solid #141414;
          color: #eee; font-size: 0.95rem; transition: all 0.2s;
        }
        .mem-table tr:last-child td { border-bottom: none; }
        .mem-table tr:hover td { background: rgba(229,62,0,0.02); color: #fff; }

        /* ── MOBILE CARD LIST ── */
        .mem-cards { display: none; flex-direction: column; gap: 0.75rem; }
        .mem-card {
          background: #0f0f0f; border: 1px solid #1e1e1e;
          border-radius: 12px; overflow: hidden;
          transition: border-color 0.2s;
        }
        .mem-card-body { padding: 1rem 1.1rem 0.9rem; }
        .mem-card-top {
          display: flex; justify-content: space-between;
          align-items: center; gap: 0.5rem; margin-bottom: 0.6rem;
        }
        .mem-card-num  { color: #444; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
        .mem-card-name { color: #fff; font-weight: 700; font-size: 0.97rem; flex: 1; margin-left: 6px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mem-card-meta {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.35rem 0.75rem; margin-bottom: 0.85rem;
          font-size: 0.8rem; color: #666;
        }
        .mem-card-meta-item { display: flex; align-items: center; gap: 5px; min-width: 0; overflow: hidden; }
        .mem-card-meta-item strong { color: #999; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        /* Full-width action bar at bottom of card */
        .mem-card-actions {
          display: grid; grid-template-columns: 1fr auto;
          border-top: 1px solid #1a1a1a;
        }
        .mem-card-edit {
          background: transparent; border: none; border-right: 1px solid #1a1a1a;
          color: #aaa; padding: 11px 0; text-align: center;
          font-family: 'Barlow', sans-serif; font-size: 0.82rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
        }
        .mem-card-edit:hover { color: #e53e00; background: rgba(229,62,0,0.04); }
        .mem-card-del {
          background: transparent; border: none;
          color: #e53e00; padding: 11px 18px; text-align: center;
          font-size: 1rem; cursor: pointer; transition: background 0.2s;
        }
        .mem-card-del:hover { background: rgba(229,62,0,0.08); }

        /* ── BADGES ── */
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 50px;
          font-size: 0.73rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          flex-shrink: 0;
        }
        .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
        .badge-paid   { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.15); }
        .badge-paid::before   { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
        .badge-unpaid { background: rgba(229,62,0,0.1);  color: #e53e00; border: 1px solid rgba(229,62,0,0.15); }
        .badge-unpaid::before { background: #e53e00; box-shadow: 0 0 6px #e53e00; }

        /* Desktop action btns */
        .action-group { display: flex; gap: 8px; }
        .action-btn-edit {
          background: #141414; border: 1px solid #222; color: #aaa;
          padding: 7px 14px; border-radius: 8px; cursor: pointer;
          font-size: 0.8rem; font-weight: 600; transition: all 0.2s;
        }
        .action-btn-edit:hover { border-color: #e53e00; color: #e53e00; background: rgba(229,62,0,0.05); }
        .action-btn-del {
          background: rgba(229,62,0,0.05); border: 1px solid rgba(229,62,0,0.1);
          color: #e53e00; padding: 7px 12px; border-radius: 8px;
          cursor: pointer; font-size: 0.85rem; transition: all 0.2s;
        }
        .action-btn-del:hover { background: #e53e00; color: #fff; border-color: #e53e00; }

        /* ── DRAWER OVERLAY ── */
        .drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        .drawer-overlay.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        /* ── DRAWER ── */
        /* NOTE: positioned via "right" offset (not transform) so the closed
           drawer never gets counted in the page's scrollable width */
        .drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 100%; max-width: 440px;
          background: #0a0a0a; border-left: 1px solid #1a1a1a;
          padding: 0; color: #fff; z-index: 1011;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1);
        }
           @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideIn {
          from { right: -100%; }
          to   { right: 0; }
        }
        .drawer.open {
          right: 0;
          visibility: visible;
        }
        .drawer-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.5rem 1.75rem; border-bottom: 1px solid #1a1a1a; flex-shrink: 0;
        }
        .drawer-header h3 {
          margin: 0; font-family: 'Barlow', sans-serif; font-size: 1.3rem;
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .drawer-header h3 span { color: #e53e00; }
        .drawer-close {
          background: none; border: none; color: #555; font-size: 1.4rem;
          cursor: pointer; width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: all 0.2s;
        }
        .drawer-close:hover { background: #1a1a1a; color: #fff; }

        .drawer-body {
          flex: 1; overflow-y: auto; padding: 1.75rem;
          display: flex; flex-direction: column; gap: 0;
        }
        .form-group { margin-bottom: 1.4rem; display: flex; flex-direction: column; gap: 0.55rem; }
        .form-group label { color: #666; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input,
        .form-group select {
          background: #111; border: 1px solid #222;
          padding: 13px 15px; border-radius: 8px;
          color: #fff; font-size: 0.95rem; outline: none;
          font-family: 'Barlow', sans-serif; transition: all 0.3s; width: 100%;
        }
        .form-group select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px;
        }
        .form-group input:focus, .form-group select:focus { border-color: #e53e00; background: #141414; box-shadow: 0 0 10px rgba(229,62,0,0.1); }
        .form-group input::placeholder { color: #444; }
        .form-group input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }

        .drawer-footer { padding: 1rem 1.75rem 1.5rem; flex-shrink: 0; border-top: 1px solid #1a1a1a; }
        .drawer-submit {
          width: 100%; background: #e53e00; border: none; color: #fff;
          padding: 14px; border-radius: 8px; font-family: 'Barlow', sans-serif;
          font-weight: 700; cursor: pointer; font-size: 1rem;
          transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .drawer-submit:hover { background: #ff4d00; box-shadow: 0 4px 15px rgba(229,62,0,0.3); }

        /* ── SECURITY MODAL ── */
        .sec-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.88); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; padding: 1rem;
        }
        .sec-card {
          background: #0c0c0c; border: 1px solid #e53e00;
          padding: 2rem 1.75rem; border-radius: 16px;
          width: 100%; max-width: 380px; text-align: center;
          box-shadow: 0 0 30px rgba(229,62,0,0.2);
        }
        .sec-icon { font-size: 2.2rem; margin-bottom: 0.75rem; display: block; }
        .sec-card h4 { margin: 0 0 0.4rem; font-size: 1.2rem; font-weight: 800; text-transform: uppercase; color: #fff; }
        .sec-card p  { margin: 0 0 1.3rem; color: #aaa; font-size: 0.88rem; line-height: 1.5; }
        .sec-input {
          width: 100%; background: #141414; border: 1px solid #333;
          text-align: center; padding: 12px; border-radius: 8px;
          color: #fff; font-size: 1.2rem; letter-spacing: 4px;
          font-weight: 700; outline: none; margin-bottom: 0.5rem;
        }
        .sec-error { color: #ff3333; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem; display: block; }
        .sec-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }
        .sec-cancel  {
          flex: 1; background: #141414; border: 1px solid #222; color: #888;
          padding: 11px; border-radius: 8px; font-weight: 700; cursor: pointer;
          font-family: 'Barlow', sans-serif;
        }
        .sec-confirm {
          flex: 1; background: #e53e00; border: none; color: #fff;
          padding: 11px; border-radius: 8px; font-weight: 700;
          cursor: pointer; text-transform: uppercase; font-size: 0.85rem;
          font-family: 'Barlow', sans-serif; transition: background 0.2s;
        }
        .sec-confirm:hover { background: #ff4d00; }

        /* ── TOAST ── */
        .mem-toast {
          position: fixed; top: -120px; left: 50%;
          transform: translateX(-50%);
          background: #0d0d0d; padding: 12px 20px;
          border-radius: 12px; border: 1px solid #1a1a1a;
          border-bottom: 3px solid #22c55e;
          box-shadow: 0 16px 40px rgba(0,0,0,0.8);
          display: flex; align-items: center; gap: 10px;
          z-index: 9999; width: max-content; max-width: calc(100vw - 32px);
          transition: top 0.4s cubic-bezier(0.175,0.885,0.32,1.23);
          pointer-events: none;
        }
        .mem-toast.show { top: 78px; }
        .mem-toast.error { border-bottom-color: #ff3333; }
        .mem-toast-msg { color: #fff; font-weight: 700; font-size: 0.88rem; font-family: 'Barlow', sans-serif; }

        .empty-msg { color: #555; text-align: center; padding: 40px; font-size: 1rem; font-weight: 600; }

        /* ═══════════════════════════════
           RESPONSIVE BREAKPOINTS
        ═══════════════════════════════ */

        /* Tablet ≤ 768px: switch to card list */
        @media (max-width: 768px) {
          .mem-toolbar { flex-direction: column; align-items: stretch; }
          .mem-search-wrap { min-width: unset; }
          .mem-add-btn { justify-content: center; padding: 13px; font-size: 0.95rem; }

          .mem-stat-strip { display: flex; }

          .mem-table-wrap { display: none; }
          .mem-cards { display: flex; }

          /* Drawer: full width on mobile */
          .drawer { max-width: 100%; border-left: none; border-top: 1px solid #1a1a1a; }
        }

        /* Small mobile ≤ 480px */
        @media (max-width: 480px) {
          .sec-card { padding: 1.5rem 1.1rem; }
          .sec-actions { flex-direction: column; }
          .mem-toast { font-size: 0.82rem; padding: 10px 15px; }
          .mem-card-meta { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Toast */}
      <div className={`mem-toast ${toast.show ? "show" : ""} ${toast.type === "error" ? "error" : ""}`}>
        <span style={{ fontSize: "1.1rem" }}>{toast.type === "success" ? "⚡" : "⚠️"}</span>
        <span className="mem-toast-msg">{toast.message}</span>
      </div>

      {/* Toolbar */}
      <div className="mem-toolbar">
        <div className="mem-search-wrap">
          <span className="mem-search-icon">🔍</span>
          <input
            className="mem-search"
            placeholder="Search by member name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="mem-add-btn" onClick={openAddDrawer}>
          <span>➕</span> Add New Member
        </button>
      </div>

      {/* Mobile stat strip */}
      <div className="mem-stat-strip">
        <div className="mem-stat-pill">
          <span className="mem-stat-pill-val">{members.length}</span>
          <span className="mem-stat-pill-lbl">Total</span>
        </div>
        <div className="mem-stat-pill">
          <span className="mem-stat-pill-val" style={{ color: "#22c55e" }}>
            {members.filter(m => m.status === "Paid").length}
          </span>
          <span className="mem-stat-pill-lbl">Paid</span>
        </div>
        <div className="mem-stat-pill">
          <span className="mem-stat-pill-val">
            {members.filter(m => m.status === "Unpaid").length}
          </span>
          <span className="mem-stat-pill-lbl">Unpaid</span>
        </div>
      </div>

      {/* Security Modal */}
      {securityModal.isOpen && (
        <div className="sec-overlay">
          <div className="sec-card">
            <span className="sec-icon">🛡️</span>
            <h4>Admin Verification</h4>
            <p>
              {securityModal.type === "add"    && "Enter Admin PIN to create a new member record."}
              {securityModal.type === "edit"   && "Enter Admin PIN to update this member's record."}
              {securityModal.type === "delete" && "Enter Admin PIN to permanently delete this record."}
            </p>
            <input
              type="password" className="sec-input"
              placeholder="••••" maxLength="4"
              value={inputPin}
              onChange={e => setInputPin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSecurityVerify()}
              autoFocus
            />
            {securityModal.errorMessage && (
              <span className="sec-error">{securityModal.errorMessage}</span>
            )}
            <div className="sec-actions">
              <button type="button" className="sec-cancel"
                onClick={() => setSecurityModal({ isOpen: false, type: "", targetId: null, errorMessage: "" })}>
                Cancel
              </button>
              <button type="button" className="sec-confirm" onClick={handleSecurityVerify}>
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Drawer overlay + Sliding Drawer — only exist in the page when open */}
      {showDrawer && (
        <>
          <div className="drawer-overlay" onClick={closeDrawer} />
          <div className="drawer">
            <div className="drawer-header">
              <h3>{isEditMode ? "Edit" : "Add"} Gym <span>Member</span></h3>
              <button className="drawer-close" onClick={closeDrawer}>✕</button>
            </div>
            <form onSubmit={triggerFormVerification} style={{ display: "contents" }}>
              <div className="drawer-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Muhammad Ahmed" maxLength="40" required />
                </div>
                <div className="form-group">
                  <label>Membership Plan</label>
                  <select value={newPlan} onChange={e => setNewPlan(e.target.value)}>
                    <option value="Monthly">Monthly Pass</option>
                    <option value="Quarterly">Quarterly Plan</option>
                    <option value="Yearly">VIP Yearly Access</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="Paid">Paid (Active)</option>
                    <option value="Unpaid">Unpaid (Pending)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Next Due Date</label>
                  <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} required />
                </div>
              </div>
              <div className="drawer-footer">
                <button type="submit" className="drawer-submit">
                  {isEditMode ? "Update Member Record" : "Save Member Record"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Desktop Table ── */}
      <div className="mem-table-wrap">
        <table className="mem-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Name</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Due Date</th>
              <th style={{ width: 160, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="empty-msg">FETCHING DATA FROM CLOUD…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="empty-msg">NO GYM RECORDS FOUND.</td></tr>
            ) : (
              filtered.map((m, i) => (
                <tr key={m.id}>
                  <td style={{ color: "#444", fontWeight: 700 }}>{String(i+1).padStart(2,"0")}</td>
                  <td style={{ color: "#fff", fontWeight: 600 }}>{m.name || "N/A"}</td>
                  <td style={{ color: "#aaa" }}>{m.plan || "Monthly"}</td>
                  <td>
                    <span className={`badge badge-${(m.status || "unpaid").toLowerCase()}`}>
                      {m.status || "Unpaid"}
                    </span>
                  </td>
                  <td style={{ color: "#aaa", fontFamily: "monospace" }}>{m.due_date || m.due || "N/A"}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="action-group" style={{ justifyContent: "flex-end" }}>
                      <button className="action-btn-edit" onClick={() => openEditDrawer(m)}>✏️ Edit</button>
                      <button className="action-btn-del"  onClick={() => triggerDeleteVerification(m.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card List ── */}
      <div className="mem-cards">
        {loading ? (
          <p className="empty-msg">FETCHING DATA FROM CLOUD…</p>
        ) : filtered.length === 0 ? (
          <p className="empty-msg">NO GYM RECORDS FOUND.</p>
        ) : (
          filtered.map((m, i) => (
            <div className="mem-card" key={m.id}>
              <div className="mem-card-body">
                <div className="mem-card-top">
                  <span className="mem-card-num">{String(i+1).padStart(2,"0")}</span>
                  <span className="mem-card-name">{m.name || "N/A"}</span>
                  <span className={`badge badge-${(m.status || "unpaid").toLowerCase()}`}>
                    {m.status || "Unpaid"}
                  </span>
                </div>
                <div className="mem-card-meta">
                  <div className="mem-card-meta-item">📋 <strong>{m.plan || "Monthly"}</strong></div>
                  <div className="mem-card-meta-item">📅 <strong style={{ fontFamily: "monospace" }}>{m.due_date || m.due || "N/A"}</strong></div>
                </div>
              </div>
              <div className="mem-card-actions">
                <button className="mem-card-edit" onClick={() => openEditDrawer(m)}>✏️ Edit Record</button>
                <button className="mem-card-del"  onClick={() => triggerDeleteVerification(m.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

    </PageWrapper>
  );
}