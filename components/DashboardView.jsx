"use client";
import { translations } from "../src/i18n.js";

export default function DashboardView({ user, t, onStartChat, onOpenKundli, onOpenMilan, onOpenTarot }) {
  const safeT = t || translations.hinglish;

  const astrologers = [
    {
      id: "acharya_divyanshu",
      name: "Acharya Divyanshu",
      specialty: "Kundli & Career Specialist",
      exp: "18+ Yrs",
      rating: "4.98 ★",
      orders: "42,000+",
      img: "/assets/acharya_portrait.jpg",
      status: "Online Now 🟢"
    },
    {
      id: "pandit_radheshyam",
      name: "Pt. Radheshyam Shastri",
      specialty: "Vastu & Marriage Matchmaking",
      exp: "22+ Yrs",
      rating: "4.95 ★",
      orders: "38,500+",
      img: "/assets/acharya_portrait.jpg",
      status: "Online Now 🟢"
    },
    {
      id: "dr_ananya",
      name: "Dr. Ananya Sharma",
      specialty: "KP Astrology & Numerology",
      exp: "12+ Yrs",
      rating: "4.96 ★",
      orders: "29,000+",
      img: "/assets/acharya_portrait.jpg",
      status: "Online Now 🟢"
    }
  ];

  const greeting = (safeT.dashGreeting || "Welcome, {name}!").replace("{name}", user ? user.name : "Gulshan Ji");

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="dash-welcome-card">
        <div className="dash-welcome-left">
          <div className="dash-status-pill">
            <span>{safeT.trialActiveBadge}</span>
          </div>
          <h2>{greeting}</h2>
          <p>{safeT.dashGreetingSub}</p>
        </div>

        {/* The Grand "Chat Now" CTA Card */}
        <div className="dash-chat-now-card">
          <div className="guru-circle-pulse">
            <img src="/assets/acharya_portrait.jpg" alt="Acharya Divyanshu" />
            <span className="live-green-badge" title="Online Now"></span>
          </div>
          <div>
            <h3>Acharya Divyanshu</h3>
            <p>{safeT.guruStatus}</p>
          </div>
          <button className="btn-grand-chat-now" onClick={onStartChat}>
            <span>{safeT.btnChatNowDash}</span>
          </button>
        </div>
      </div>

      {/* Quick Services Tiles */}
      <div>
        <h3 style={{ fontSize: "1.35rem", color: "var(--gold-400)", marginBottom: "16px" }}>
          {safeT.quickServicesTitle}
        </h3>
        <div className="dash-services-grid">
          
          <div className="dash-service-tile" onClick={onStartChat}>
            <div className="tile-icon-box">💬</div>
            <h4>{safeT.serviceChatTitle}</h4>
            <p>{safeT.serviceChatDesc}</p>
            <div className="tile-action-link">Start Chat Now &rarr;</div>
          </div>

          <div className="dash-service-tile" onClick={onOpenKundli}>
            <div className="tile-icon-box">📜</div>
            <h4>{safeT.serviceKundliTitle}</h4>
            <p>{safeT.serviceKundliDesc}</p>
            <div className="tile-action-link">View Kundli &rarr;</div>
          </div>

          <div className="dash-service-tile" onClick={onOpenMilan}>
            <div className="tile-icon-box">💍</div>
            <h4>{safeT.serviceMilanTitle}</h4>
            <p>{safeT.serviceMilanDesc}</p>
            <div className="tile-action-link">Match Kundlis &rarr;</div>
          </div>

          <div className="dash-service-tile" onClick={onOpenTarot}>
            <div className="tile-icon-box">🔮</div>
            <h4>{safeT.serviceTarotTitle}</h4>
            <p>{safeT.serviceTarotDesc}</p>
            <div className="tile-action-link">Draw Cards &rarr;</div>
          </div>

        </div>
      </div>

      {/* Online Verified Astrologers List */}
      <div>
        <h3 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "14px" }}>
          {safeT.onlineGurusTitle}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {(safeT.gurus || astrologers).map((astro) => (
            <div
              key={astro.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-gold)",
                borderRadius: "var(--radius-lg)",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={astro.img}
                  alt={astro.name}
                  style={{ width: "52px", height: "52px", borderRadius: "50%", border: "2px solid var(--gold-500)" }}
                />
                <div>
                  <h4 style={{ fontSize: "1rem", color: "#fff" }}>{astro.name}</h4>
                  <span style={{ fontSize: "0.76rem", color: "var(--gold-400)" }}>{astro.specialty}</span>
                  <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: "700" }}>{astro.status}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#94a3b8", borderTop: "1px solid var(--border-subtle)", paddingTop: "8px" }}>
                <span>Exp: <strong>{astro.exp}</strong></span>
                <span>Rating: <strong>{astro.rating}</strong></span>
                <span>Orders: <strong>{astro.consultations || astro.orders}</strong></span>
              </div>

              <button
                className="btn-grand-chat-now"
                style={{ padding: "9px", fontSize: "0.85rem" }}
                onClick={onStartChat}
              >
                {safeT.btnChatAstro1Rs || "💬 Chat Now (1 Day ₹1 Trial)"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
