"use client";

export default function AstrologersSection({ t, onStartChat }) {
  const gurus = t.gurus || [];

  return (
    <section className="astrologers-section-wrapper" id="astrologersSection">
      {/* Section Header */}
      <div className="section-header-contained">
        <span className="section-badge-pill">{t.gurusSectionTag || "VERIFIED VEDIC SCHOLARS"}</span>
        <h3 className="section-title-gold">{t.gurusSectionTitle}</h3>
        <p className="section-sub-clean">{t.gurusSectionSub}</p>
      </div>

      {/* 3 Astrologer Cards Grid */}
      <div className="gurus-cards-grid">
        {gurus.map((guru) => (
          <div key={guru.id} className="guru-card-frame">
            <div className="guru-card-top">
              <div className="guru-avatar-wrapper">
                <img src={guru.img} alt={guru.name} className="guru-card-avatar" />
                <span className="guru-online-indicator" title="Online Now"></span>
              </div>
              <div className="guru-meta-info">
                <h4 className="guru-name">{guru.name}</h4>
                <p className="guru-specialty">{guru.specialty}</p>
                <div className="guru-rating-badge">{guru.rating}</div>
              </div>
            </div>

            <div className="guru-stats-strip">
              <div className="guru-stat-chip">
                <span>Exp:</span>
                <strong>{guru.exp}</strong>
              </div>
              <div className="guru-stat-chip">
                <span>Orders:</span>
                <strong>{guru.consultations}</strong>
              </div>
              <div className="guru-stat-chip">
                <span>Status:</span>
                <strong style={{ color: "var(--emerald-400)" }}>Live 🟢</strong>
              </div>
            </div>

            <div className="guru-card-bottom">
              <div className="guru-price-tag">
                <span className="guru-offer-label">{t.specialOfferTrial || "1-Day Trial Offer"}</span>
                <strong className="guru-rupee-price">{t.trialPriceAstro || "₹1 / 1-Day Trial"}</strong>
              </div>
              <button
                className="btn-guru-chat-action"
                onClick={() => onStartChat(guru)}
              >
                <span>{t.btnChatAstro1Rs || "💬 Baat Karein (₹1 / 1 Day)"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
