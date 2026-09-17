import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../supabaseClient";

export default function Contact({ navigate }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all required fields!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("enquiries").insert([{ 
      name: form.name, email: form.email, subject: form.subject, message: form.message 
    }]);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }
    setLoading(false);
  };

  // Simple Alert Logic
  const handleAdminLogin = () => {
    const pin = prompt("Enter Admin PIN:");
    if (pin === "112233") {
      navigate("contact-list");
    } else if (pin !== null) {
      alert("❌ Invalid PIN!");
    }
  };

  return (
    <PageWrapper
      icon="📬"
      title='CON<span>TACT US</span>'
      subtitle="Get in touch with the gym management team"
      accentColor="#06b6d4"
    >
      <style>{`
        .contact-layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2rem; align-items: start; }
        @media (max-width: 700px) { .contact-layout { grid-template-columns: 1fr; } }
        .contact-info { display: flex; flex-direction: column; gap: 1rem; }
        .info-card { background: #111; border: 1px solid #1e1e1e; border-radius: 12px; padding: 1.3rem 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .info-icon { width: 42px; height: 42px; background: rgba(6,182,212,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
        .info-label { font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .info-value { color: #ccc; font-size: 0.9rem; margin-top: 2px; }
        .contact-form { background: #111; border: 1px solid #1e1e1e; border-radius: 14px; padding: 2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
        .field { margin-bottom: 1.2rem; }
        .field label { display: block; font-size: 0.78rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #777; margin-bottom: 0.45rem; }
        .field input, .field textarea { width: 100%; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; color: #fff; padding: 11px 14px; outline: none; }
        .field input:focus, .field textarea:focus { border-color: #06b6d4; }
        .field textarea { resize: vertical; min-height: 130px; }
        .submit-btn { width: 100%; background: #06b6d4; border: none; color: #000; padding: 13px; border-radius: 8px; font-weight: 900; cursor: pointer; }
        .submit-btn:hover { background: #0891b2; color: #fff; }
        .success-msg { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; border-radius: 10px; padding: 1rem; text-align: center; margin-bottom: 1.5rem; }
        .admin-login-btn { background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 1rem; font-size: 0.8rem; width: 100%; }
        .admin-login-btn:hover { border-color: #e53e00; color: #e53e00; }
      `}</style>

      <div className="contact-layout">
        <div className="contact-info">
          {[ { icon: "📍", label: "Address", value: "123 Fitness Street, Rawalpindi" }, { icon: "📞", label: "Phone", value: "+92 300 1234567" }, { icon: "✉️", label: "Email", value: "info@flexgym.pk" } ].map(info => (
            <div className="info-card" key={info.label}>
              <div className="info-icon">{info.icon}</div>
              <div><div className="info-label">{info.label}</div><div className="info-value">{info.value}</div></div>
            </div>
          ))}
          <button className="admin-login-btn" onClick={handleAdminLogin}>Admin Login</button>
        </div>

        <div className="contact-form">
          {sent && <div className="success-msg">✅ Message sent!</div>}
          <div className="form-row">
            <div className="field"><label>Name</label><input value={form.name} onChange={e => update("name", e.target.value)} /></div>
            <div className="field"><label>Email</label><input value={form.email} onChange={e => update("email", e.target.value)} /></div>
          </div>
          <div className="field"><label>Subject</label><input value={form.subject} onChange={e => update("subject", e.target.value)} /></div>
          <div className="field"><label>Message</label><textarea value={form.message} onChange={e => update("message", e.target.value)} /></div>
          <button className="submit-btn" onClick={submit} disabled={loading}>{loading ? "SENDING..." : "SEND MESSAGE →"}</button>
        </div>
      </div>
    </PageWrapper>
  );
}