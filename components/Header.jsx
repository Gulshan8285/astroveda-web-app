"use client";

export default function Header({
  user,
  t,
  currentLang = "hinglish",
  onSelectLanguage,
  onOpenLogin,
  onNavigate,
  onStartChat,
  activeView
}) {
  const safeT = t || {};

  return (
    <div className="header-outer-wrapper">
      {/* Top subtle trust ticker line */}
      <div className="header-trust-ticker">
        <span>{safeT.trustRibbon || "⚡ 500,000+ Consultations • 4.9★ Rated • 100% Confidential • Kashi Vedic Certified"}</span>
      </div>

      {/* Floating Seamless Rounded Capsule Header */}
      <header className="site-header">
        <div className="header-container">
          {/* Brand Logo */}
          <div className="brand-badge" onClick={() => onNavigate(user ? "dashboard" : "landing")}>
            <div className="om-symbol-emblem">
              <span>ॐ</span>
            </div>
            <div className="brand-title-wrap">
              <h1>{safeT.brandName || "AstroVeda"}</h1>
            </div>
          </div>

          {/* Navigation Menu (Desktop) */}
          <nav className="desktop-nav-menu">
            <ul className="nav-menu-links">
              <li>
                <button
                  className={`nav-link-btn ${activeView === "landing" ? "active" : ""}`}
                  onClick={() => onNavigate("landing")}
                >
                  {safeT.navHome || "Home"}
                </button>
              </li>
              <li>
                <button className="nav-link-btn" onClick={() => onNavigate("astrologers")}>
                  {safeT.navGurus || "Gurus"}
                </button>
              </li>
              <li>
                <button className="nav-link-btn" onClick={() => onNavigate("kundli-modal")}>
                  {safeT.navKundli || "Kundli"}
                </button>
              </li>
              <li>
                <button className="nav-link-btn" onClick={() => onNavigate("milan-modal")}>
                  {safeT.navMatching || "Milan"}
                </button>
              </li>
              <li>
                <button className="nav-link-btn" onClick={() => onNavigate("panchang")}>
                  {safeT.navPanchang || "Panchang"}
                </button>
              </li>
              <li>
                <button className="nav-link-btn" onClick={() => onNavigate("horoscope")}>
                  {safeT.navHoroscope || "Horoscope"}
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Actions: Instant Language Switcher + Chat ₹1 Button + Auth */}
          <div className="header-right-actions">
            
            {/* Instant 3-Pill Language Switcher (1-Click Switch!) */}
            <div className="header-segmented-lang">
              <button
                type="button"
                className={`segmented-lang-pill ${currentLang === "hinglish" ? "active" : ""}`}
                onClick={() => onSelectLanguage("hinglish")}
                title="Hinglish"
              >
                Hinglish
              </button>
              <button
                type="button"
                className={`segmented-lang-pill ${currentLang === "hi" ? "active" : ""}`}
                onClick={() => onSelectLanguage("hi")}
                title="हिंदी"
              >
                हिंदी
              </button>
              <button
                type="button"
                className={`segmented-lang-pill ${currentLang === "en" ? "active" : ""}`}
                onClick={() => onSelectLanguage("en")}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Direct Talk to Astrologer ₹1 Golden Button */}
            <button className="btn-header-chat-gold" onClick={onStartChat}>
              <span className="live-dot-beacon-tiny"></span>
              <span>{safeT.btnHeaderChat || "✦ ₹1 Chat"}</span>
            </button>

            {/* User Auth / Sign In */}
            {user ? (
              <div className="user-badge-header" onClick={() => onNavigate("dashboard")}>
                <div className="user-avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{user.name.split(" ")[0]}</span>
                <span className="trial-token-badge">⚡ 1-Day Trial</span>
              </div>
            ) : (
              <button className="btn-header-login" onClick={onOpenLogin}>
                {safeT.signIn || "Sign In"}
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
