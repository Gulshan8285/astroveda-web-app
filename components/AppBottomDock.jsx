"use client";

export default function AppBottomDock({
  activeTab = "home",
  onNavigate,
  onStartChat,
  onOpenLogin,
  user
}) {
  return (
    <nav className="app-bottom-dock-nav">
      <div className="dock-container">
        
        {/* Tab 1: Home */}
        <button
          className={`dock-tab-btn ${activeTab === "home" ? "active" : ""}`}
          onClick={() => onNavigate("landing")}
          title="Home"
        >
          <svg className="dock-icon-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="dock-tab-label">Home</span>
        </button>

        {/* Tab 2: Remedies */}
        <button
          className={`dock-tab-btn ${activeTab === "remedies" ? "active" : ""}`}
          onClick={() => onNavigate("remedies")}
          title="Remedies"
        >
          <svg className="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="dock-tab-label">Remedies</span>
        </button>

        {/* Tab 3 (CENTER HIGHLIGHTED HERO): Live Astrologer Chat (1 Day ₹1) */}
        <div className="dock-center-guru-wrap" onClick={onStartChat} title="Talk to Astrologer (1 Day ₹1 Trial)">
          <div className="dock-guru-ring-pulse">
            <img
              src="/assets/guru_priya_avatar.jpg"
              alt="Talk to Astrologer"
              className="dock-guru-avatar-img"
            />
            <span className="dock-live-beacon"></span>
          </div>
          <span className="dock-center-trial-badge">₹1 Trial</span>
        </div>

        {/* Tab 4: Prediction / Horoscope */}
        <button
          className={`dock-tab-btn ${activeTab === "prediction" ? "active" : ""}`}
          onClick={() => onNavigate("horoscope")}
          title="Prediction"
        >
          <svg className="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span className="dock-tab-label">Prediction</span>
        </button>

        {/* Tab 5: You / Dashboard / Profile */}
        <button
          className={`dock-tab-btn ${activeTab === "you" ? "active" : ""}`}
          onClick={() => (user ? onNavigate("dashboard") : onOpenLogin())}
          title={user ? user.name : "Sign In"}
        >
          <svg className="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="dock-tab-label">{user ? "You" : "Sign In"}</span>
        </button>

      </div>
    </nav>
  );
}
