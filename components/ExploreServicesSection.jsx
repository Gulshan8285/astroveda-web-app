"use client";

export default function ExploreServicesSection({
  t,
  onOpenKundli,
  onOpenMilan,
  onNavigate,
  onStartChat
}) {
  const safeT = t || {};

  return (
    <section className="explore-services-container" id="exploreSection">
      {/* 1. Lucky Time Prediction Banner (from reference app design) */}
      <div className="lucky-time-card-luxury" onClick={() => onNavigate("panchang")}>
        <div className="lucky-time-blur-preview">
          <div className="lucky-time-header">
            <span className="lock-glyph">🔒</span>
            <span className="lucky-time-label">
              {safeT.unlockLuckyTime || "UNLOCK YOUR SACRED TIMELINE"}
            </span>
          </div>
          <div className="lucky-time-teaser-times">
            <span>Abhijit: 11:45 AM - 12:35 PM</span>
            <span>•</span>
            <span>Shubh Muhurat: 04:15 PM</span>
          </div>
        </div>
        <div className="lucky-time-action-strip">
          <span>{safeT.seeTodayPrediction || "SEE TODAY'S PREDICTION"}</span>
          <span className="chevron-gold">›</span>
        </div>
      </div>

      {/* 2. Quick Ask Capsule Pill (with female guru avatar from reference) */}
      <div className="quick-ask-capsule-luxury" onClick={onStartChat}>
        <div className="quick-ask-avatar-wrap">
          <img
            src="/assets/guru_priya_avatar.jpg"
            alt="Vedic Astrologer"
            className="quick-ask-avatar-img"
          />
          <span className="live-dot-beacon-tiny"></span>
        </div>
        <div className="quick-ask-text-wrap">
          <span className="quick-ask-prompt">
            {safeT.quickAskPrompt || "Ask about love, career, or money"}
          </span>
        </div>
        <div className="quick-ask-cta-pill">
          <span>1 Day ₹1 ➔</span>
        </div>
      </div>

      {/* 3. Ornamental Section Divider ("— ❖ Explore More ❖ —") */}
      <div className="ornament-divider-luxury">
        <div className="ornament-gold-line"></div>
        <div className="ornament-center-box">
          <span className="ornament-diamond">❖</span>
          <h3 className="ornament-heading">{safeT.exploreMoreTitle || "Explore More"}</h3>
          <span className="ornament-diamond">❖</span>
        </div>
        <div className="ornament-gold-line"></div>
      </div>

      {/* 4. The 4-Card Luxury Grid (Signature reference app layout) */}
      <div className="explore-grid-luxury">
        
        {/* Left Column (Kundli & Milan) */}
        <div className="explore-left-col">
          {/* Card 1: Your Kundli */}
          <div className="explore-card-item" onClick={onOpenKundli}>
            <div className="explore-card-text">
              <div className="explore-card-title-row">
                <h4>{safeT.cardKundliTitle || "Your Kundli"}</h4>
                <span className="card-chevron-gold">›</span>
              </div>
              <p>{safeT.cardKundliSub || "Birth Chart and Planets"}</p>
            </div>
            <div className="explore-card-img-wrap">
              <img
                src="/assets/golden_scroll_kundli.jpg"
                alt="Your Kundli Scroll"
                className="explore-3d-asset"
              />
            </div>
          </div>

          {/* Card 2: Kundali Matching */}
          <div className="explore-card-item" onClick={onOpenMilan}>
            <div className="explore-card-text">
              <div className="explore-card-title-row">
                <h4>{safeT.cardMatchingTitle || "Kundali Matching"}</h4>
                <span className="card-chevron-gold">›</span>
              </div>
              <p>{safeT.cardMatchingSub || "See compatibility and guna score"}</p>
            </div>
            <div className="explore-card-img-wrap">
              <img
                src="/assets/golden_hearts_matching.jpg"
                alt="Kundali Matching Hearts"
                className="explore-3d-asset"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Panchang (Tall Card) */}
        <div className="explore-right-col">
          <div className="explore-card-item tall-panchang-card" onClick={() => onNavigate("panchang")}>
            <div className="explore-card-img-wrap-tall">
              <img
                src="/assets/golden_calendar_panchang.jpg"
                alt="Vedic Panchang Calendar"
                className="explore-3d-asset-tall"
              />
            </div>
            <div className="explore-card-text">
              <div className="explore-card-title-row">
                <h4>{safeT.cardPanchangTitle || "Panchang"}</h4>
                <span className="card-chevron-gold">›</span>
              </div>
              <p>{safeT.cardPanchangSub || "Your daily vedic calendar. Tithi, festivals, nakshatra & muhurat"}</p>
            </div>
          </div>
        </div>

        {/* Wide Bottom Card: Remedies */}
        <div className="explore-wide-bottom-col">
          <div className="explore-card-item wide-remedy-card" onClick={() => onNavigate("remedies")}>
            <div className="explore-card-text">
              <div className="explore-card-title-row">
                <h4>{safeT.cardRemediesTitle || "Remedies"}</h4>
                <span className="card-chevron-gold">›</span>
              </div>
              <p>{safeT.cardRemediesSub || "Track your pujas, mantras & remedies"}</p>
            </div>
            <div className="explore-card-img-wrap-wide">
              <img
                src="/assets/golden_namaste_remedies.jpg"
                alt="Sacred Vedic Remedies"
                className="explore-3d-asset-wide"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
