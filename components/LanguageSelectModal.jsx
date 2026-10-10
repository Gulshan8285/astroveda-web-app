"use client";

export default function LanguageSelectModal({ isOpen, onClose, currentLang, onSelectLanguage }) {
  if (!isOpen) return null;

  const languages = [
    {
      id: "hinglish",
      icon: "💬",
      title: "Hinglish (WhatsApp Language)",
      subtitle: "Apna future jano, career aur shadi predictions",
      badge: "Most Popular 🔥"
    },
    {
      id: "hi",
      icon: "🇮🇳",
      title: "हिंदी (शुद्ध हिंदी)",
      subtitle: "सटीक जन्म कुंडली, महादशा एवं वैदिक मार्गदर्शन",
      badge: "वैदिक लिपि"
    },
    {
      id: "en",
      icon: "🌐",
      title: "English (Global)",
      subtitle: "Accurate Vedic Kundli & Astrologer consultation",
      badge: "International"
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <div>
            <h3 style={{ fontSize: "1.2rem", color: "#18181B" }}>🌐 Choose Your Language</h3>
            <span style={{ fontSize: "0.78rem", color: "#71717A" }}>अपनी पसंदीदा भाषा चुनें</span>
          </div>
          <button className="btn-modal-x" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-content">
          <p style={{ fontSize: "0.85rem", color: "#52525B", marginBottom: "16px" }}>
            Select how you would like to read your horoscope and chat with Acharya ji:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {languages.map((l) => (
              <div
                key={l.id}
                onClick={() => {
                  onSelectLanguage(l.id);
                  onClose();
                }}
                style={{
                  background: currentLang === l.id ? "#FEF3C7" : "#FAF7F2",
                  border: currentLang === l.id ? "1.5px solid var(--gold-500)" : "1px solid var(--border-gold)",
                  borderRadius: "14px",
                  padding: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "var(--transition)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "1.8rem" }}>{l.icon}</span>
                  <div>
                    <strong style={{ display: "block", color: currentLang === l.id ? "#92400E" : "#18181B", fontSize: "1rem" }}>
                      {l.title}
                    </strong>
                    <span style={{ fontSize: "0.78rem", color: "#71717A" }}>{l.subtitle}</span>
                  </div>
                </div>
                <span
                  style={{
                    background: currentLang === l.id ? "var(--gold-gradient)" : "#FFFFFF",
                    color: currentLang === l.id ? "#18181B" : "#71717A",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    border: "1px solid var(--border-gold)"
                  }}
                >
                  {l.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
