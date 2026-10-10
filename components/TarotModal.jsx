"use client";
import { useState } from "react";

export default function TarotModal({ isOpen, onClose, onConsultChat }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!isOpen) return null;

  const cards = [
    { title: "The Sun (सूर्य - Success)", desc: "Past: Hard work ke baad success aur recognition mil rahi hai." },
    { title: "The Wheel of Fortune (भाग्य चक्र)", desc: "Present: Destiny aapke favor me turn le rahi hai. Naye opportunities ko grab karein." },
    { title: "The Star (नक्षत्र - Hope)", desc: "Guidance: Apne inner intuition par bharosa rakhein. Positive results aane wale hain." }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog-box" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>🔮 Cosmic Tarot Draw (3 Sacred Cards)</h3>
          <button className="btn-modal-x" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-content" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.86rem", color: "#52525B", marginBottom: "14px" }}>
            Dil me apna sawal sochein aur 3 me se kisi bhi card par click karein:
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "14px", margin: "16px 0" }}>
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  width: "100px",
                  height: "150px",
                  background: selectedIdx === idx ? "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)" : "linear-gradient(135deg, #FAF7F2 0%, #F5EEDB 100%)",
                  border: selectedIdx === idx ? "2px solid #D97706" : "1.5px solid var(--border-gold)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  cursor: "pointer",
                  boxShadow: selectedIdx === idx ? "0 0 20px rgba(245, 158, 11, 0.45)" : "var(--shadow-card)",
                  transition: "var(--transition)"
                }}
              >
                🎴
              </div>
            ))}
          </div>

          <div style={{ minHeight: "65px", color: "var(--gold-500)", fontSize: "0.92rem", padding: "10px" }}>
            {selectedIdx !== null ? (
              <div>
                <strong>✨ {cards[selectedIdx].title}</strong>
                <p style={{ color: "#18181B", fontSize: "0.85rem", marginTop: "4px" }}>{cards[selectedIdx].desc}</p>
              </div>
            ) : (
              <span style={{ color: "#71717A" }}>Kisi bhi card par click karein to guidance reveal ho...</span>
            )}
          </div>

          <button
            className="btn-grand-chat-now"
            style={{ marginTop: "14px", padding: "12px", fontSize: "0.92rem" }}
            onClick={() => {
              onClose();
              onConsultChat();
            }}
          >
            💬 Acharya Ji Se Full Solution lein (₹1 Trial)
          </button>
        </div>
      </div>
    </div>
  );
}
