"use client";
import { translations } from "../src/i18n.js";

export default function HeroSection({ t, onGoogleLogin, onOpenKundli, onOpenMilan, onStartChat }) {
  const safeT = t || translations.hinglish;

  return (
    <div className="hero-wrapper">
      {/* Left Content Box */}
      <div className="hero-left-box">
        <div className="trust-pill-tag">
          <span>{safeT.trustTag}</span>
        </div>

        <h2 className="hero-title-main">
          {safeT.heroTitle}
        </h2>

        <p className="hero-punchline-sub">
          {safeT.heroSub}
        </p>

        {/* PRIMARY HERO CTA CARD: Talk to Astrologer (Sirf ₹1) Prominent Action */}
        <div className="hero-cta-card-box">
          
          {/* 1. Grand Primary Glowing Button to Talk to Astrologer for ₹1 (1-Day Trial) */}
          <button className="btn-hero-talk-gold" onClick={onStartChat}>
            <span className="live-dot-beacon"></span>
            <span className="btn-talk-label">{safeT.heroPrimaryCta || "✦ Acharya Divyanshu Se Baat Karein (1 Day Trial Sirf ₹1) ✦"}</span>
          </button>

          {/* 2. PROMINENT & HIGH-CONTRAST Google Sign In Button (Crisp & 100% Visible) */}
          <button className="btn-google-prominent" onClick={onGoogleLogin}>
            <svg className="google-icon-svg" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{safeT.loginWithGoogle || "Continue with Google"}</span>
          </button>

          {/* 4. Luxury 2-Column Symmetrical Vedic Tools (Clean, Balanced, No Tacky Free Text) */}
          <div className="hero-tools-grid">
            <button className="btn-hero-tool" onClick={onOpenKundli}>
              <span className="tool-star-icon">✦</span>
              <span>{safeT.btnFreeKundli || "Janam Kundli"}</span>
            </button>
            <button className="btn-hero-tool" onClick={onOpenMilan}>
              <span className="tool-star-icon">✦</span>
              <span>{safeT.btnMilan || "Kundli Milan"}</span>
            </button>
          </div>
        </div>

        {/* Crisp Trust Badges */}
        <div className="hero-trust-micro-line">
          <span>{safeT.confidential}</span>
          <span>•</span>
          <span>{safeT.ratingTrust}</span>
          <span>•</span>
          <span>{safeT.instantConnect}</span>
        </div>
      </div>

      {/* Right Cosmic Wheel Visual */}
      <div className="hero-visual-right">
        <div className="cosmic-wheel-circle">
          <img
            src="/assets/cosmic_mandala.jpg"
            alt="Vedic Cosmic Wheel"
            className="cosmic-img-mandala"
          />

          {/* Floating Live Astrologer Pill */}
          <div className="floating-guru-pill" onClick={onStartChat}>
            <div className="floating-guru-avatar-wrap">
              <img
                src="/assets/acharya_portrait.jpg"
                alt="Acharya Divyanshu"
                className="guru-pill-img"
              />
              <span className="live-dot-beacon-small"></span>
            </div>
            <div className="guru-pill-info">
              <h4>Acharya Divyanshu</h4>
              <p>🟢 {safeT.chatOnlineStatus?.split("•")[1]?.trim() || "Online Now"} • 1 Day ₹1 Trial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
