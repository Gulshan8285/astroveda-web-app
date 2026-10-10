"use client";
import { useState, useEffect } from "react";
import Starfield from "../components/Starfield";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AstrologersSection from "../components/AstrologersSection";
import DashboardView from "../components/DashboardView";
import ChatRoom from "../components/ChatRoom";
import GoogleLoginModal from "../components/GoogleLoginModal";
import KundliMilanModal from "../components/KundliMilanModal";
import KundliModal from "../components/KundliModal";
import TarotModal from "../components/TarotModal";
import LanguageSelectModal from "../components/LanguageSelectModal";
import PaywallModal from "../components/PaywallModal";
import PanchangWidget from "../components/PanchangWidget";
import HoroscopeSection from "../components/HoroscopeSection";
import ExploreServicesSection from "../components/ExploreServicesSection";
import AppBottomDock from "../components/AppBottomDock";
import { translations } from "../src/i18n.js";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("landing"); // 'landing' | 'dashboard' | 'chat'
  const [lang, setLang] = useState("hinglish"); // 'hinglish' | 'hi' | 'en'
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Modals state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isMilanModalOpen, setIsMilanModalOpen] = useState(false);
  const [isKundliModalOpen, setIsKundliModalOpen] = useState(false);
  const [isTarotModalOpen, setIsTarotModalOpen] = useState(false);
  const [activeCalculationData, setActiveCalculationData] = useState(null);

  // Check saved session & first-time language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("astroveda_lang");
    if (savedLang && ["hinglish", "hi", "en"].includes(savedLang)) {
      setLang(savedLang);
    }

    const savedUser = sessionStorage.getItem("astroveda_next_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        if (u.trialActive) setIsUnlocked(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem("astroveda_lang", selectedLang);
  };

  const handleSelectGoogleAccount = (name, email) => {
    const newUser = {
      name,
      email,
      trialActive: true,
      walletTokens: 1
    };
    setUser(newUser);
    sessionStorage.setItem("astroveda_next_user", JSON.stringify(newUser));
    setIsLoginModalOpen(false);

    if (!isPaywallOpen) {
      setActiveView("dashboard");
    }
  };

  const handleRequirePaywall = (calcData = null) => {
    setActiveCalculationData(calcData);
    setIsPaywallOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    setIsPaywallOpen(false);

    if (user) {
      const updatedUser = { ...user, trialActive: true };
      setUser(updatedUser);
      sessionStorage.setItem("astroveda_next_user", JSON.stringify(updatedUser));
    }

    alert(
      lang === "hinglish"
        ? "🎉 ₹1 Payment Successful! Aapka 1-Day Unlimited Trial aur full Kundli report unlock ho gaya hai!"
        : lang === "hi"
        ? "🎉 ₹1 का भुगतान सफल! आपका 1 दिन का अनलिमिटेड ट्रायल एवं संपूर्ण कुंडली अनलॉक हो चुका है।"
        : "🎉 Payment of ₹1 Successful! Your 1-Day Unlimited Trial & full Kundli report are now active!"
    );

    setActiveView("chat");
  };

  const handleStartChat = () => {
    setActiveView("chat");
  };

  const handleNavigate = (dest) => {
    if (dest === "landing") setActiveView("landing");
    else if (dest === "dashboard") setActiveView("dashboard");
    else if (dest === "chat") handleStartChat();
    else if (dest === "kundli-modal") setIsKundliModalOpen(true);
    else if (dest === "milan-modal") setIsMilanModalOpen(true);
    else if (dest === "astrologers") {
      setActiveView("landing");
      setTimeout(() => {
        document.getElementById("astrologersSection")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (dest === "panchang") {
      setActiveView("landing");
      setTimeout(() => {
        document.getElementById("panchangSection")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (dest === "horoscope") {
      setActiveView("landing");
      setTimeout(() => {
        document.getElementById("horoscopeSection")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (dest === "remedies") {
      setActiveView("landing");
      setTimeout(() => {
        document.getElementById("remediesSection")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const t = translations[lang] || translations.hinglish;

  return (
    <div className="app-wrapper">
      {/* Dynamic Starry Night Canvas Background */}
      <Starfield />

      {/* Floating Rounded Frame Header (Aligned to exact max-width) */}
      <Header
        user={user}
        t={t}
        currentLang={lang}
        onSelectLanguage={handleSelectLanguage}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onNavigate={handleNavigate}
        onStartChat={handleStartChat}
        activeView={activeView}
      />

      {/* MAIN VIEW PANELS */}
      <main style={{ flex: 1 }}>
        {/* VIEW 1: LANDING PAGE */}
        {activeView === "landing" && (
          <div>
            {/* Minimalist Hero Section */}
            <HeroSection
              t={t}
              onGoogleLogin={() => setIsLoginModalOpen(true)}
              onOpenKundli={() => setIsKundliModalOpen(true)}
              onOpenMilan={() => setIsMilanModalOpen(true)}
              onStartChat={handleStartChat}
            />

            {/* Trust Stats Bar (Exact Container Width Aligned) */}
            <div className="stats-strip-wrapper">
              <div className="stats-grid-row">
                <div className="stat-item-box">
                  <div className="stat-big-num">{t.statConsultations}</div>
                  <div className="stat-label-text">{t.statConsultationsLbl}</div>
                </div>
                <div className="stat-item-box">
                  <div className="stat-big-num">{t.statGurus}</div>
                  <div className="stat-label-text">{t.statGurusLbl}</div>
                </div>
                <div className="stat-item-box">
                  <div className="stat-big-num">{t.statAccuracy}</div>
                  <div className="stat-label-text">{t.statAccuracyLbl}</div>
                </div>
                <div className="stat-item-box">
                  <div className="stat-big-num">{t.statRating}</div>
                  <div className="stat-label-text">{t.statRatingLbl}</div>
                </div>
              </div>
            </div>

            {/* Sacred Services Explore Grid (Signature Reference App Layout from Image 2) */}
            <ExploreServicesSection
              t={t}
              onOpenKundli={() => setIsKundliModalOpen(true)}
              onOpenMilan={() => setIsMilanModalOpen(true)}
              onNavigate={handleNavigate}
              onStartChat={handleStartChat}
            />

            {/* Verified Astrologers Showcase (Prominently Restored as Requested) */}
            <AstrologersSection
              t={t}
              onStartChat={handleStartChat}
            />

            {/* Daily Panchang Widget */}
            <div id="panchangSection" className="panchang-section-wrapper">
              <PanchangWidget t={t} lang={lang} />
            </div>

            {/* Daily 12 Zodiac Horoscope */}
            <div id="horoscopeSection" className="horoscope-section-wrapper">
              <HoroscopeSection t={t} lang={lang} />
            </div>

            {/* Sacred Vedic Gemstones & Upay Visual Showcase */}
            <section id="remediesSection" className="remedies-section-wrapper">
              <div className="remedies-card-box">
                <div className="remedies-img-wrap">
                  <img
                    src="/assets/vedic_remedies.jpg"
                    alt="Vedic Gemstones and Diya"
                    className="remedies-img"
                  />
                </div>
                <div className="remedies-content-wrap">
                  <span className="section-badge-pill">DIVINE UPAY & REMEDIES</span>
                  <h4 className="remedies-title">
                    {t.remedyTitle}
                  </h4>
                  <p className="remedies-desc">
                    {t.remedySub}
                  </p>
                  <ul className="remedies-list">
                    <li>{t.remedyPt1}</li>
                    <li>{t.remedyPt2}</li>
                    <li>{t.remedyPt3}</li>
                  </ul>
                  <button
                    className="btn-remedy-chat"
                    onClick={handleStartChat}
                  >
                    <span>{t.btnAskRemedy}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: NEW CUSTOMER PAGE / DASHBOARD */}
        {activeView === "dashboard" && (
          <DashboardView
            user={user}
            t={t}
            onStartChat={() => setActiveView("chat")}
            onOpenKundli={() => setIsKundliModalOpen(true)}
            onOpenMilan={() => setIsMilanModalOpen(true)}
            onOpenTarot={() => setIsTarotModalOpen(true)}
          />
        )}

        {/* VIEW 3: THE INTERACTIVE WHATSAPP-STYLE CHAT SCREEN */}
        {activeView === "chat" && (
          <ChatRoom
            user={user}
            t={t}
            lang={lang}
            onBackToDashboard={() => setActiveView(user ? "dashboard" : "landing")}
            onRequirePaywall={handleRequirePaywall}
            isUnlocked={isUnlocked}
          />
        )}
      </main>

      {/* FOOTER: Rounded Centered Frame Matching Header & Content Width */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="brand-badge" style={{ justifyContent: "center" }}>
            <div className="om-symbol-emblem" style={{ width: "34px", height: "34px", fontSize: "1.15rem" }}>
              <span>ॐ</span>
            </div>
            <div className="brand-title-wrap">
              <h2 style={{ fontSize: "1.15rem", background: "var(--gold-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t.brandName}
              </h2>
            </div>
          </div>

          <div className="footer-badges-line">
            <span>🔒 256-Bit SSL Secured</span>
            <span>•</span>
            <span>⚡ 100% Confidential</span>
            <span>•</span>
            <span>📜 Parashara Vedic Calculation</span>
            <span>•</span>
            <span>🇮🇳 Made with Devotion in India</span>
          </div>

          <p className="footer-copy">
            {t.footerCopy}
          </p>
        </div>
      </footer>

      {/* LUXURY FLOATING APP BOTTOM DOCK (Matching Reference App from Image 2) */}
      <AppBottomDock
        activeTab={activeView === "dashboard" ? "you" : "home"}
        onNavigate={handleNavigate}
        onStartChat={handleStartChat}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        user={user}
      />

      {/* MODALS */}
      <LanguageSelectModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={lang}
        onSelectLanguage={handleSelectLanguage}
      />

      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        user={user}
        onOpenGoogleLogin={() => setIsLoginModalOpen(true)}
        onPaymentSuccess={handlePaymentSuccess}
        calculatedSummary={activeCalculationData}
        lang={lang}
      />

      <KundliModal
        isOpen={isKundliModalOpen}
        onClose={() => setIsKundliModalOpen(false)}
        onRequirePaywall={handleRequirePaywall}
        isUnlocked={isUnlocked}
        lang={lang}
      />

      <KundliMilanModal
        isOpen={isMilanModalOpen}
        onClose={() => setIsMilanModalOpen(false)}
        onRequirePaywall={handleRequirePaywall}
        isUnlocked={isUnlocked}
        lang={lang}
      />

      <TarotModal
        isOpen={isTarotModalOpen}
        onClose={() => setIsTarotModalOpen(false)}
        onConsultChat={handleStartChat}
      />
    </div>
  );
}
