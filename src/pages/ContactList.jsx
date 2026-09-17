import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../supabaseClient";

export default function ContactList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      
      if (error) {
        alert("Error deleting: " + error.message);
      } else {
        setMessages(messages.filter(msg => msg.id !== id));
      }
    }
  };

  return (
    <PageWrapper title="ADMIN INBOX" icon="📥" accentColor="#06b6d4">
      <style>{`
        .inbox-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .msg-row { 
          background: #0c0c0c; 
          border: 1px solid #1a1a1a; 
          padding: 2rem; 
          border-radius: 16px; 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
        }
        .msg-info { flex: 1; margin-right: 2rem; }
        .msg-name { font-weight: 800; color: #fff; font-size: 1.1rem; display: block; margin-bottom: 4px; }
        .msg-email { color: #06b6d4; font-size: 0.9rem; display: block; margin-bottom: 12px; }
        .msg-subject { color: #f59e0b; font-size: 0.95rem; font-weight: 700; margin-bottom: 10px; }
        .msg-body { color: #ccc; font-size: 1rem; line-height: 1.6; font-style: italic; }
        
        .action-area { display: flex; flex-direction: column; gap: 0.8rem; }
        .btn-reply { background: #06b6d4; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 700; transition: 0.2s; }
        .btn-reply:hover { background: #0891b2; }
        .btn-delete { background: #e53e00; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 700; transition: 0.2s; }
        .btn-delete:hover { background: #c53030; }
      `}</style>

      <div className="inbox-list">
        {messages.length === 0 ? (
          <div style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>No messages available.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="msg-row">
              <div className="msg-info">
                <span className="msg-name">{msg.name}</span>
                <span className="msg-email">{msg.email}</span>
                <div className="msg-subject">Subject: {msg.subject || "No Subject"}</div>
                <div className="msg-body">"{msg.message}"</div>
              </div>
              
              <div className="action-area">
                <button 
                  className="btn-reply" 
                  onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=Regarding: ${msg.subject || 'Enquiry'}`, '_blank')}
                >
                  REPLY
                </button>
                <button className="btn-delete" onClick={() => deleteMessage(msg.id)}>
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}