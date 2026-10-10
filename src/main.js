// AstroVeda - Main Application Controller
import { translations } from "./i18n.js";
import { RASHIS, calculateVedicChart, calculateKundliMilan, renderNorthIndianKundliSVG } from "./astrology-engine.js";
import { getTodayPanchang } from "./panchang.js";
import { AstrologerChatEngine } from "./chat-bot.js";

class AstroVedaApp {
  constructor() {
    this.currentLang = "hi"; // Default to Hindi as per user request
    this.currentUser = null;
    this.currentView = "landing"; // 'landing' | 'dashboard' | 'chat'
    this.selectedRashiId = 1;
    this.chatEngine = null;

    this.astrologers = [
      {
        id: "acharya_divyanshu",
        nameEn: "Acharya Divyanshu",
        nameHi: "आचार्य दिव्यांशु",
        specialtyEn: "Vedic Kundli & Dasha Specialist",
        specialtyHi: "वैदिक कुंडली व महादशा विशेषज्ञ",
        exp: "18+ Yrs",
        rating: "4.98 ★",
        consultations: "42,000+",
        languages: "Hindi, English, Sanskrit",
        img: "./assets/acharya_portrait.jpg",
        status: "Online Now 🟢"
      },
      {
        id: "pandit_radheshyam",
        nameEn: "Pandit Radheshyam Shastri",
        nameHi: "पं. राधेश्याम शास्त्री",
        specialtyEn: "Vastu & Marriage Matchmaking",
        specialtyHi: "वास्तु शास्त्र एवं विवाह गुण मिलान",
        exp: "22+ Yrs",
        rating: "4.95 ★",
        consultations: "38,500+",
        languages: "Hindi, Gujrati",
        img: "./assets/acharya_portrait.jpg",
        status: "Online Now 🟢"
      },
      {
        id: "dr_ananya",
        nameEn: "Dr. Ananya Sharma",
        nameHi: "डॉ. अनन्या शर्मा",
        specialtyEn: "KP Astrology & Numerology",
        specialtyHi: "केपी ज्योतिष एवं अंकशास्त्र",
        exp: "12+ Yrs",
        rating: "4.96 ★",
        consultations: "29,000+",
        languages: "English, Hindi",
        img: "./assets/acharya_portrait.jpg",
        status: "Online Now 🟢"
      },
      {
        id: "acharya_vidyadhar",
        nameEn: "Acharya Vidyadhar",
        nameHi: "आचार्य विद्याधर",
        specialtyEn: "Gemology & Tantra Shanti",
        specialtyHi: "रत्न परामर्श एवं ग्रह शांति",
        exp: "16+ Yrs",
        rating: "4.92 ★",
        consultations: "31,200+",
        languages: "Hindi, Bengali",
        img: "./assets/acharya_portrait.jpg",
        status: "Online Now 🟢"
      }
    ];

    this.init();
  }

  init() {
    this.initStarfield();
    this.bindDomElements();
    this.renderPanchang();
    this.renderHoroscopeNav();
    this.renderHoroscopeDetails(1);
    this.renderAstrologers();
    this.updateLanguageUI();

    // Check if user was previously saved in session
    const savedUser = sessionStorage.getItem("astroveda_user");
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.updateAuthHeader();
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Animated Cosmic Starfield Background
  initStarfield() {
    const canvas = document.getElementById("starfieldCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const stars = [];
    const count = Math.min(140, Math.floor((width * height) / 9000));

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        twinkleSpeed: Math.random() * 0.02 + 0.008
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) {
          s.twinkleSpeed = -s.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${Math.abs(s.alpha)})`;
        ctx.shadowBlur = s.radius > 1 ? 6 : 0;
        ctx.shadowColor = "#fcd34d";
        ctx.fill();

        s.y -= s.speed * 8;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }
      }
      requestAnimationFrame(animate);
    };

    animate();
  }

  // Switch Active View
  switchView(viewName) {
    this.currentView = viewName;
    const landing = document.getElementById("landingView");
    const dashboard = document.getElementById("dashboardView");
    const chat = document.getElementById("chatView");

    if (landing) landing.style.display = viewName === "landing" ? "block" : "none";
    if (dashboard) dashboard.style.display = viewName === "dashboard" ? "block" : "none";
    if (chat) chat.style.display = viewName === "chat" ? "flex" : "none";

    // Update nav active states
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.dataset.nav === viewName) link.classList.add("active");
      else link.classList.remove("active");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (viewName === "chat") {
      this.mountChatEngine();
    }
  }

  // Mount the Astrologer Chat Engine
  mountChatEngine() {
    const mountPoint = document.getElementById("astrologerChatMount");
    if (!mountPoint) return;

    if (!this.chatEngine) {
      this.chatEngine = new AstrologerChatEngine(mountPoint, (nextView) => {
        if (nextView === "DASHBOARD") {
          this.switchView(this.currentUser ? "dashboard" : "landing");
        }
      });
    }

    this.chatEngine.setLanguage(this.currentLang);
    const userName = this.currentUser ? this.currentUser.name : "";
    this.chatEngine.init(userName);
  }

  // Bind DOM Event Listeners
  bindDomElements() {
    // Brand Logo click
    const logo = document.getElementById("logoBrand");
    if (logo) {
      logo.addEventListener("click", () => {
        this.switchView(this.currentUser ? "dashboard" : "landing");
      });
    }

    // Language Toggle
    const btnLang = document.getElementById("btnToggleLang");
    if (btnLang) {
      btnLang.addEventListener("click", () => {
        this.currentLang = this.currentLang === "hi" ? "en" : "hi";
        this.updateLanguageUI();
        if (this.chatEngine) {
          this.chatEngine.setLanguage(this.currentLang);
        }
      });
    }

    // Google Login from Hero (The primary trigger requested by user)
    const btnHeroGoogle = document.getElementById("btnGoogleLoginHero");
    if (btnHeroGoogle) {
      btnHeroGoogle.addEventListener("click", () => {
        this.openModal("modalGoogleLogin");
      });
    }

    // Trial ₹1 Offer Box triggers
    const trialBox = document.getElementById("trialOfferBox");
    const btnClaimTrial = document.getElementById("btnClaimTrialHero");
    if (trialBox) {
      trialBox.addEventListener("click", () => {
        if (!this.currentUser) this.openModal("modalGoogleLogin");
        else this.switchView("chat");
      });
    }
    if (btnClaimTrial) {
      btnClaimTrial.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this.currentUser) this.openModal("modalGoogleLogin");
        else this.switchView("chat");
      });
    }

    // Floating Astrologer live badge click
    const floatingBadge = document.getElementById("floatingGuruBadge");
    if (floatingBadge) {
      floatingBadge.addEventListener("click", () => {
        if (!this.currentUser) this.openModal("modalGoogleLogin");
        else this.switchView("chat");
      });
    }

    // Header Sign In button
    const btnHeaderLogin = document.getElementById("btnHeaderLogin");
    if (btnHeaderLogin) {
      btnHeaderLogin.addEventListener("click", () => {
        this.openModal("modalGoogleLogin");
      });
    }

    // Post-Login Dashboard "Chat Now" CTA Button
    const btnDashChatNow = document.getElementById("btnDashChatNow");
    if (btnDashChatNow) {
      btnDashChatNow.addEventListener("click", () => {
        this.switchView("chat");
      });
    }

    // Dashboard Quick Service Cards
    const cardQuickChat = document.getElementById("cardQuickChat");
    if (cardQuickChat) {
      cardQuickChat.addEventListener("click", () => this.switchView("chat"));
    }

    const cardQuickKundli = document.getElementById("cardQuickKundli");
    if (cardQuickKundli) {
      cardQuickKundli.addEventListener("click", () => this.openKundliModal());
    }

    const cardQuickMilan = document.getElementById("cardQuickMilan");
    if (cardQuickMilan) {
      cardQuickMilan.addEventListener("click", () => this.openKundliMilanModal());
    }

    const cardQuickTarot = document.getElementById("cardQuickTarot");
    if (cardQuickTarot) {
      cardQuickTarot.addEventListener("click", () => this.openTarotModal());
    }

    // Hero secondary buttons
    const btnHeroFreeKundli = document.getElementById("btnHeroFreeKundli");
    if (btnHeroFreeKundli) {
      btnHeroFreeKundli.addEventListener("click", () => this.openKundliModal());
    }

    const btnHeroMatchmaking = document.getElementById("btnHeroMatchmaking");
    if (btnHeroMatchmaking) {
      btnHeroMatchmaking.addEventListener("click", () => this.openKundliMilanModal());
    }

    const btnAskRemedyHero = document.getElementById("btnAskRemedyHero");
    if (btnAskRemedyHero) {
      btnAskRemedyHero.addEventListener("click", () => {
        if (!this.currentUser) this.openModal("modalGoogleLogin");
        else this.switchView("chat");
      });
    }

    // Nav Links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const nav = e.currentTarget.dataset.nav;
        if (nav === "landing") this.switchView("landing");
        else if (nav === "kundli") this.openKundliModal();
        else if (nav === "matching") this.openKundliMilanModal();
        else if (nav === "panchang") {
          this.switchView("landing");
          const el = document.getElementById("panchangSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (nav === "horoscope") {
          this.switchView("landing");
          const el = document.getElementById("horoscopeSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (nav === "astrologers") {
          this.switchView("landing");
          const el = document.getElementById("astrologersSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Google Sign-In Accounts Selection in Modal
    document.querySelectorAll("[data-login-user]").forEach((row) => {
      row.addEventListener("click", (e) => {
        const name = e.currentTarget.dataset.loginUser;
        const email = e.currentTarget.dataset.loginEmail;
        this.performGoogleLogin(name, email);
      });
    });

    const btnCustomGoogle = document.getElementById("btnCustomGoogleAccount");
    if (btnCustomGoogle) {
      btnCustomGoogle.addEventListener("click", () => {
        const customName = prompt(this.currentLang === "hi" ? "अपना नाम दर्ज करें:" : "Enter your full name:", "Gulshan Yadav");
        if (customName && customName.trim()) {
          this.performGoogleLogin(customName.trim(), `${customName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`);
        }
      });
    }

    // ₹1 Payment Modal Checkout complete
    const btnCompletePay = document.getElementById("btnCompleteRupeePay");
    if (btnCompletePay) {
      btnCompletePay.addEventListener("click", () => {
        this.closeModal("modalPayment");
        alert(this.currentLang === "hi" ? "🎉 ₹1 का भुगतान सफल रहा! आपका ट्रायल परामर्श अनलॉक हो चुका है।" : "🎉 Payment of ₹1 Successful! Your trial consultation is now unlocked.");
        this.switchView("chat");
      });
    }

    // Generic Modal Close Buttons
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modalId = e.currentTarget.dataset.closeModal;
        this.closeModal(modalId);
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("active");
        }
      });
    });
  }

  // Handle Google Login Flow
  performGoogleLogin(userName, userEmail) {
    this.closeModal("modalGoogleLogin");

    // Save user state
    this.currentUser = {
      name: userName,
      email: userEmail,
      trialActive: true,
      walletTokens: 1
    };
    sessionStorage.setItem("astroveda_user", JSON.stringify(this.currentUser));

    this.updateAuthHeader();

    // Show celebratory notification and transition to the Dashboard page
    const isHi = this.currentLang === "hi";
    const greetingMsg = isHi
      ? `🎉 स्वागतम् ${userName} जी! आपका Google लॉगिन सफल हुआ और ₹1 वेलकम ट्रायल सक्रिय हो गया है!`
      : `🎉 Welcome ${userName}! Google Login verified & ₹1 Welcome Trial activated!`;

    // Visual toast
    this.showToast(greetingMsg);

    // Switch to the Post-Login Dashboard Page (As requested by user: "Login with Google karne ke baad ek naya sa page aa jayega...")
    setTimeout(() => {
      this.switchView("dashboard");
    }, 600);
  }

  // Update Header with User Avatar
  updateAuthHeader() {
    const authArea = document.getElementById("authHeaderArea");
    if (!authArea) return;

    if (this.currentUser) {
      const initial = this.currentUser.name.charAt(0).toUpperCase();
      authArea.innerHTML = `
        <div class="user-profile-badge" id="btnUserDash">
          <div class="user-avatar-small">${initial}</div>
          <span class="user-badge-name">${this.currentUser.name}</span>
          <span class="wallet-pill">⚡ ₹1 Trial</span>
        </div>
      `;
      const btn = document.getElementById("btnUserDash");
      if (btn) {
        btn.addEventListener("click", () => this.switchView("dashboard"));
      }
    } else {
      authArea.innerHTML = `
        <button class="btn-outline-gold" id="btnHeaderLogin">
          <span>${this.currentLang === "hi" ? "साइन इन" : "Sign In"}</span>
        </button>
      `;
      const btn = document.getElementById("btnHeaderLogin");
      if (btn) {
        btn.addEventListener("click", () => this.openModal("modalGoogleLogin"));
      }
    }
  }

  // Toast Notification
  showToast(message) {
    const existing = document.getElementById("astroToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "astroToast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      padding: 14px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      animation: toastSlideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.4s ease";
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // Modal Open/Close helpers
  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add("active");
  }

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove("active");
  }

  // Render Daily Vedic Panchang
  renderPanchang() {
    const container = document.getElementById("panchangCardContent");
    if (!container) return;

    const p = getTodayPanchang();
    const isHi = this.currentLang === "hi";

    container.innerHTML = `
      <div class="panchang-top-bar">
        <div class="panchang-date-title">
          <h3>📅 ${isHi ? p.dayHi : p.dayEn}, ${p.dateFormatted}</h3>
          <span>${p.samvat} • ${p.ayana}</span>
        </div>
        <div class="muhurat-badge-live">
          ✨ ${isHi ? "अभिजीत मुहूर्त: " : "Abhijit Muhurat: "} ${p.abhijitMuhurat}
        </div>
      </div>

      <div class="panchang-elements-grid">
        <div class="panchang-col-item">
          <span class="p-item-label">${isHi ? "तिथि (Tithi)" : "Tithi"}</span>
          <span class="p-item-value">${isHi ? p.tithiHi : p.tithiEn}</span>
          <span class="p-item-sub">चंद्र कला</span>
        </div>
        <div class="panchang-col-item">
          <span class="p-item-label">${isHi ? "नक्षत्र (Nakshatra)" : "Nakshatra"}</span>
          <span class="p-item-value">${isHi ? p.nakshatraHi : p.nakshatraEn}</span>
          <span class="p-item-sub">चंद्र स्थिति</span>
        </div>
        <div class="panchang-col-item">
          <span class="p-item-label">${isHi ? "योग (Yoga)" : "Yoga"}</span>
          <span class="p-item-value">${isHi ? p.yogaHi : p.yogaEn}</span>
          <span class="p-item-sub">शुभ प्रभाव</span>
        </div>
        <div class="panchang-col-item">
          <span class="p-item-label">${isHi ? "सूर्योदय / सूर्यास्त" : "Sunrise / Sunset"}</span>
          <span class="p-item-value">🌅 ${p.sunrise} | 🌇 ${p.sunset}</span>
          <span class="p-item-sub">स्थान: भारत</span>
        </div>
        <div class="panchang-col-item" style="border-color: rgba(239, 68, 68, 0.35);">
          <span class="p-item-label" style="color: #f87171;">${isHi ? "राहु काल (अशुभ समय)" : "Rahu Kaal (Inauspicious)"}</span>
          <span class="p-item-value" style="color: #fca5a5;">⚠️ ${p.rahuKaal}</span>
          <span class="p-item-sub" style="color: #94a3b8;">नया कार्य टालें</span>
        </div>
      </div>
    `;
  }

  // Render Daily Horoscope 12 Zodiac Nav Tabs
  renderHoroscopeNav() {
    const nav = document.getElementById("zodiacSignsNav");
    if (!nav) return;

    const isHi = this.currentLang === "hi";

    nav.innerHTML = RASHIS.map((r) => `
      <button class="sign-tab-btn ${r.id === this.selectedRashiId ? "active" : ""}" data-rashi-id="${r.id}">
        <span class="sign-symbol-icon">${r.symbol}</span>
        <span>${isHi ? r.hi : r.en}</span>
      </button>
    `).join("");

    nav.querySelectorAll(".sign-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.rashiId, 10);
        this.selectedRashiId = id;
        nav.querySelectorAll(".sign-tab-btn").forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.renderHoroscopeDetails(id);
      });
    });
  }

  // Render Horoscope Details for selected sign
  renderHoroscopeDetails(rashiId) {
    const box = document.getElementById("horoscopeResultBox");
    if (!box) return;

    const rashi = RASHIS.find((r) => r.id === rashiId) || RASHIS[0];
    const isHi = this.currentLang === "hi";

    const predictions = {
      1: {
        careerEn: "Mars energizes your professional house today. Take bold initiative in negotiations. A lucrative opportunity is approaching.",
        careerHi: "मंगल देव आपके दशम भाव को ऊर्जा दे रहे हैं। कार्यक्षेत्र में साहस और तत्परता से लिए गए फैसले बहुत लाभकारी सिद्ध होंगे।",
        loveEn: "Warm harmony with partner. Single Aries may encounter someone fascinating during an evening gathering.",
        loveHi: "दांपत्य जीवन में मधुरता रहेगी। अविवाहित मेष जातकों के लिए नए संबंध की सुंदर शुरुआत के योग हैं।"
      },
      2: {
        careerEn: "Venus bestows financial clarity. Good day to plan long-term investments and clear pending receivables.",
        careerHi: "शुक्र देव की कृपा से आर्थिक स्थिति सुदृढ़ होगी। पुराने निवेश से अप्रत्याशित लाभ होने के संकेत हैं।",
        loveEn: "Express gratitude to your loved ones. Deep emotional bonding brings tranquility.",
        loveHi: "जीवनसाथी का पूरा सहयोग मिलेगा। आपसी बातचीत से पुरानी उलझनें समाप्त होंगी।"
      },
      3: {
        careerEn: "Mercury sharpens your communication. Ideal day for presentations, pitching, and creative writing.",
        careerHi: "बुध देव आपकी संवाद कला को निखार रहे हैं। व्यावसायिक बैठकों और साक्षात्कारों में बड़ी सफलता मिलेगी।",
        loveEn: "Lighthearted banter keeps sparks alive. Plan a pleasant evening outing.",
        loveHi: "प्रेम संबंधों में नया उत्साह रहेगा। शाम को परिवार के साथ आनंददायक समय बीतेगा।"
      },
      4: {
        careerEn: "The Moon promotes intuitive decision-making. Trust your inner compass when handling complex workplace dilemmas.",
        careerHi: "चंद्रमा का शुभ प्रभाव आपके मन को शांत रखेगा। महत्वपूर्ण निर्णयों में आपका अंतर्ज्ञान सही साबित होगा।",
        loveEn: "Domestic bliss and cozy family moments rejuvenate your heart.",
        loveHi: "घर-परिवार में मांगलिक वातावरण रहेगा। परिजनों से भरपूर स्नेह और आशीर्वाद प्राप्त होगा।"
      },
      5: {
        careerEn: "Sun grants royal confidence. You will naturally inspire team members and receive praise from seniors.",
        careerHi: "सूर्य देव की कृपा से आपका मान-सम्मान बढ़ेगा। उच्च अधिकारियों से सराहना मिलने का प्रबल योग है।",
        loveEn: "Your charisma shines brightly today. Passion and loyalty strengthen your relationship.",
        loveHi: "आपका आकर्षण सबको प्रभावित करेगा। पार्टनर के साथ यादगार समय व्यतीत होगा।"
      },
      6: {
        careerEn: "Mercury awards meticulous focus. Organizing paperwork and finishing pending projects proceeds effortlessly.",
        careerHi: "कार्यों में बारीकी और एकाग्रता से लाभ मिलेगा। रुके हुए सरकारी या तकनीकी कार्य आसानी से पूरे होंगे।",
        loveEn: "Listen attentively to your partner. Small gestures of care mean the world today.",
        loveHi: "जीवनसाथी की भावनाओं का सम्मान करें। प्रेम में समझदारी और धैर्य से रिश्ते प्रगाढ़ होंगे।"
      },
      7: {
        careerEn: "Venus balances workplace diplomacy. Partnerships and collaborative ventures yield excellent fruit.",
        careerHi: "साझेदारी और संयुक्त व्यापार में लाभ होगा। कानूनी मामलों में आपके पक्ष में फैसला आने के योग हैं।",
        loveEn: "Romance is in the air. A thoughtful surprise or dinner date creates magical memories.",
        loveHi: "दांपत्य जीवन में प्रेम की नई लहर आएगी। प्रियजन के साथ सुखद यात्रा की योजना बनेगी।"
      },
      8: {
        careerEn: "Mars sparks relentless determination. You overcome competition and crack complex challenges with ease.",
        careerHi: "विरोधी परास्त होंगे और आपके साहस से नए रास्ते खुलेंगे। गुप्त धन या आकस्मिक लाभ संभव है।",
        loveEn: "Deep passionate conversations reveal heartfelt truths. Trust your partner completely.",
        loveHi: "प्रेम में प्रगाढ़ता और विश्वास बढ़ेगा। मन की बात साझा करने के लिए आज का दिन श्रेष्ठ है।"
      },
      9: {
        careerEn: "Jupiter expands your horizon. Favorable day for education, publishing, and mentoring others.",
        careerHi: "बृहस्पति देव की शुभ दृष्टि से ज्ञान और भाग्य में वृद्धि होगी। उच्च शिक्षा व सलाहकारी कार्यों में सफलता।",
        loveEn: "Shared spiritual or philosophical interests strengthen your mutual bond.",
        loveHi: "साथी के साथ धार्मिक या दार्शनिक विषयों पर सुखद चर्चा होगी। मन प्रसन्न रहेगा।"
      },
      10: {
        careerEn: "Saturn rewards discipline and consistency. A long-pending milestone is within your grasp today.",
        careerHi: "शनि देव आपके अथक परिश्रम का फल देंगे। करियर में स्थायित्व और नई जिम्मेदारी मिलने के योग हैं।",
        loveEn: "Steadfast loyalty and practical care provide immense comfort to your soulmate.",
        loveHi: "पारिवारिक जिम्मेदारियों को निभाने में जीवनसाथी का अमूल्य सहयोग मिलेगा।"
      },
      11: {
        careerEn: "Saturn fosters visionary ideas. Networking with progressive minds opens unexpected doors of revenue.",
        careerHi: "नवीन विचारों और तकनीक के प्रयोग से बड़ा धन लाभ होगा। सामाजिक संपर्कों से लाभ मिलेगा।",
        loveEn: "Unconditional friendship is the anchor of your love life today. Cherish shared freedom.",
        loveHi: "रिश्ते में मित्रता और सम्मान का भाव बना रहेगा। मित्रों से शुभ समाचार मिलेगा।"
      },
      12: {
        careerEn: "Jupiter amplifies compassionate leadership. Creative and spiritual work flows with divine grace.",
        careerHi: "रचनात्मक और आध्यात्मिक कार्यों में भारी यश मिलेगा। दूसरों की सहायता करने से पुण्य और लाभ दोनों मिलेंगे।",
        loveEn: "Soulful empathy deepens emotional connection. Forgiveness heals old wounds effortlessly.",
        loveHi: "हृदय में करुणा और प्रेम का भाव रहेगा। साथी के साथ आत्मिक जुड़ाव महसूस होगा।"
      }
    };

    const pred = predictions[rashiId] || predictions[1];
    const luckyNum = (rashiId * 3) % 9 + 1;
    const luckyColors = ["Yellow", "Crimson", "Emerald", "Royal Blue", "Saffron", "Silver", "Coral"];
    const luckyColor = luckyColors[rashiId % luckyColors.length];

    box.innerHTML = `
      <div>
        <h4 class="h-col-title">
          <span>${rashi.symbol}</span>
          <span>${isHi ? `${rashi.hi} राशि - आजीविका एवं करियर` : `${rashi.en} - Career & Professional Destiny`}</span>
        </h4>
        <p class="h-text-body">${isHi ? pred.careerHi : pred.careerEn}</p>
        <div class="h-lucky-row">
          <span>✨ ${isHi ? "स्वामी ग्रह:" : "Ruling Lord:"} <strong>${rashi.lord}</strong></span>
          <span>🔥 ${isHi ? "तत्व:" : "Element:"} <strong>${rashi.element}</strong></span>
        </div>
      </div>

      <div>
        <h4 class="h-col-title">
          <span>❤️</span>
          <span>${isHi ? "प्रेम, संबंध एवं दांपत्य राशिफल" : "Love & Relationship Alignment"}</span>
        </h4>
        <p class="h-text-body">${isHi ? pred.loveHi : pred.loveEn}</p>
        <div class="h-lucky-row">
          <span>🎯 ${isHi ? "शुभ अंक:" : "Lucky Number:"} <strong>${luckyNum}</strong></span>
          <span>🎨 ${isHi ? "शुभ रंग:" : "Lucky Color:"} <strong>${luckyColor}</strong></span>
        </div>
      </div>
    `;
  }

  // Render Verified Astrologers Grid
  renderAstrologers() {
    const list = document.getElementById("astrologersGridList");
    const dashList = document.getElementById("dashAstrologersGrid");
    const isHi = this.currentLang === "hi";

    const html = this.astrologers.map((astro) => `
      <div class="astrologer-card-item">
        <div class="astrologer-card-header">
          <div class="astrologer-photo-box">
            <img src="${astro.img}" alt="${astro.nameEn}" />
            <span class="online-dot-mini" title="Online"></span>
          </div>
          <div class="astrologer-title-block">
            <h4>${isHi ? astro.nameHi : astro.nameEn}</h4>
            <span class="astrologer-specialty">${isHi ? astro.specialtyHi : astro.specialtyEn}</span>
            <div class="rating-star-tag">★ ${astro.rating}</div>
          </div>
        </div>

        <div class="astrologer-card-details">
          <span>Exp: <strong>${astro.exp}</strong></span>
          <span>Orders: <strong>${astro.consultations}</strong></span>
          <span>Lang: <strong>${isHi ? "हिंदी, EN" : "HI, EN"}</strong></span>
        </div>

        <div class="astrologer-action-row">
          <div class="trial-rate-display">
            <span>Special Offer</span>
            <strong>₹ 1 / Trial</strong>
          </div>
          <button class="btn-card-chat btn-astrologer-chat-trigger" data-astro-id="${astro.id}">
            <span>💬 ${isHi ? "अभी चैट करें" : "Chat Now"}</span>
          </button>
        </div>
      </div>
    `).join("");

    if (list) list.innerHTML = html;
    if (dashList) dashList.innerHTML = html;

    // Attach click events
    document.querySelectorAll(".btn-astrologer-chat-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!this.currentUser) {
          this.openModal("modalGoogleLogin");
        } else {
          this.switchView("chat");
        }
      });
    });
  }

  // Open Standalone Janam Kundli Calculator Modal
  openKundliModal() {
    const body = document.getElementById("milanModalBody");
    const title = document.getElementById("milanModalTitle");
    const isHi = this.currentLang === "hi";

    title.textContent = isHi ? "📜 संपूर्ण जन्म कुंडली जनरेटर" : "📜 Instant Janam Kundli Generator";

    const defaultDob = "1996-08-15";
    const chart = calculateVedicChart(defaultDob, "07:30 AM", "New Delhi");

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 0.88rem; color: #cbd5e1;">
          ${isHi ? "अपनी जन्म तिथि व समय के अनुसार वैदिक लग्न कुंडली का लाइव आरेख देखें:" : "View your Vedic North Indian Lagna Kundli chart according to your birth details:"}
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="date" id="kundliModalDob" class="astrology-date-picker" value="${defaultDob}" style="flex: 1;" />
          <button type="button" class="btn-confirm-step" id="btnRecalculateKundliModal">
            ${isHi ? "गणना करें ⚡" : "Generate Chart ⚡"}
          </button>
        </div>

        <div id="kundliModalChartMount" style="display: flex; justify-content: center; margin-top: 10px;">
          ${renderNorthIndianKundliSVG(chart, 320, 320)}
        </div>

        <div style="text-align: center; margin-top: 10px;">
          <button type="button" class="btn-grand-chat-now" id="btnDiscussKundliWithGuru">
            💬 ${isHi ? "आचार्य जी से इस कुंडली पर ₹1 में बात करें" : "Discuss this Kundli with Acharya (@ ₹1 Trial)"}
          </button>
        </div>
      </div>
    `;

    const btnRecalc = document.getElementById("btnRecalculateKundliModal");
    if (btnRecalc) {
      btnRecalc.addEventListener("click", () => {
        const input = document.getElementById("kundliModalDob");
        if (input && input.value) {
          const newChart = calculateVedicChart(input.value);
          const mount = document.getElementById("kundliModalChartMount");
          if (mount) mount.innerHTML = renderNorthIndianKundliSVG(newChart, 320, 320);
        }
      });
    }

    const btnDiscuss = document.getElementById("btnDiscussKundliWithGuru");
    if (btnDiscuss) {
      btnDiscuss.addEventListener("click", () => {
        this.closeModal("modalMilanCalculator");
        if (!this.currentUser) this.openModal("modalGoogleLogin");
        else this.switchView("chat");
      });
    }

    this.openModal("modalMilanCalculator");
  }

  // Open 36 Gun Milan Modal
  openKundliMilanModal() {
    const body = document.getElementById("milanModalBody");
    const title = document.getElementById("milanModalTitle");
    const isHi = this.currentLang === "hi";

    title.textContent = isHi ? "💍 वैदिक 36 गुण मिलान (विवाह अनुकूलता)" : "💍 Vedic 36 Gun Milan (Matchmaking)";

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 0.88rem; color: #cbd5e1;">
          ${isHi ? "वर (Boy) और वधू (Girl) की राशियां चुनकर विवाह हेतु अष्टकूट 36 गुण मिलान देखें:" : "Select Boy & Girl Moon signs to compute Ashta-Koota 36 Guna marriage compatibility:"}
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div>
            <label style="font-size: 0.8rem; color: var(--gold-glow); display: block; margin-bottom: 6px;">
              👦 ${isHi ? "वर की राशि (Boy's Rashi)" : "Boy's Rashi"}
            </label>
            <select id="selBoyRashi" class="astrology-date-picker" style="width: 100%;">
              ${RASHIS.map((r) => `<option value="${r.id}">${r.symbol} ${isHi ? r.hi : r.en}</option>`).join("")}
            </select>
          </div>

          <div>
            <label style="font-size: 0.8rem; color: var(--gold-glow); display: block; margin-bottom: 6px;">
              👧 ${isHi ? "कन्या की राशि (Girl's Rashi)" : "Girl's Rashi"}
            </label>
            <select id="selGirlRashi" class="astrology-date-picker" style="width: 100%;">
              ${RASHIS.map((r, i) => `<option value="${r.id}" ${i === 4 ? "selected" : ""}>${r.symbol} ${isHi ? r.hi : r.en}</option>`).join("")}
            </select>
          </div>
        </div>

        <button type="button" class="btn-grand-chat-now" id="btnCalculateMilanScore" style="padding: 12px;">
          ${isHi ? "गुण मिलान परिणाम देखें ⚡" : "Calculate Compatibility ⚡"}
        </button>

        <div id="milanResultArea"></div>
      </div>
    `;

    const btnCalc = document.getElementById("btnCalculateMilanScore");
    if (btnCalc) {
      btnCalc.addEventListener("click", () => {
        const boy = parseInt(document.getElementById("selBoyRashi").value, 10);
        const girl = parseInt(document.getElementById("selGirlRashi").value, 10);
        const res = calculateKundliMilan(boy, girl);
        const resultArea = document.getElementById("milanResultArea");

        resultArea.innerHTML = `
          <div style="background: #FAF7F2; border: 1.5px solid var(--border-gold); border-radius: 14px; padding: 18px; margin-top: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
              <span style="font-size: 0.9rem; color: #52525B; font-weight: 600;">${isHi ? "कुल प्राप्त गुण:" : "Total Gunas Matched:"}</span>
              <strong style="font-size: 1.8rem; color: #B45309; font-family: var(--font-serif);">${res.score} / 36</strong>
            </div>

            <p style="margin-top: 10px; font-size: 0.95rem; color: #059669; font-weight: 700;">
              ${isHi ? res.verdictHi : res.verdictEn}
            </p>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 14px; font-size: 0.75rem;">
              ${res.kootas.map((k) => `
                <div style="background: #FFFFFF; border: 1px solid var(--border-gold); padding: 8px 6px; border-radius: 8px; text-align: center;">
                  <span style="color: #71717A; display: block; font-weight: 600;">${k.name.split(" ")[0]}</span>
                  <strong style="color: #18181B; font-size: 0.9rem;">${k.score}/${k.max}</strong>
                </div>
              `).join("")}
            </div>

            <div style="margin-top: 16px; text-align: center;">
              <button class="btn-card-chat" id="btnConsultGuruMilan" style="width: 100%; justify-content: center;">
                💬 ${isHi ? "आचार्य जी से विस्तृत मिलान परामर्श लें (₹1)" : "Get Full Marriage Guidance with Acharya (₹1 Trial)"}
              </button>
            </div>
          </div>
        `;

        const btnConsult = document.getElementById("btnConsultGuruMilan");
        if (btnConsult) {
          btnConsult.addEventListener("click", () => {
            this.closeModal("modalMilanCalculator");
            if (!this.currentUser) this.openModal("modalGoogleLogin");
            else this.switchView("chat");
          });
        }
      });
    }

    this.openModal("modalMilanCalculator");
  }

  // Open Tarot Modal
  openTarotModal() {
    const body = document.getElementById("milanModalBody");
    const title = document.getElementById("milanModalTitle");
    const isHi = this.currentLang === "hi";

    title.textContent = isHi ? "🔮 कॉस्मिक टैरो कार्ड ड्रॉ (3 कार्ड)" : "🔮 Cosmic Tarot Card Reading (3 Cards)";

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; text-align: center;">
        <p style="font-size: 0.88rem; color: #cbd5e1;">
          ${isHi ? "अपने मन में एक प्रश्न सोचें और 3 दिव्य कार्ड चुनें:" : "Focus on an important question in your heart and draw 3 divine cards:"}
        </p>

        <div style="display: flex; justify-content: center; gap: 14px; margin: 15px 0;">
          <div class="tarot-card-flip" style="width: 100px; height: 160px; background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); border: 2px solid var(--border-gold); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; cursor: pointer; box-shadow: var(--shadow-card);" id="tarotCard1">
            <span>🎴</span>
          </div>
          <div class="tarot-card-flip" style="width: 100px; height: 160px; background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); border: 2px solid var(--border-gold); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; cursor: pointer; box-shadow: var(--shadow-card);" id="tarotCard2">
            <span>🎴</span>
          </div>
          <div class="tarot-card-flip" style="width: 100px; height: 160px; background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); border: 2px solid var(--border-gold); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; cursor: pointer; box-shadow: var(--shadow-card);" id="tarotCard3">
            <span>🎴</span>
          </div>
        </div>

        <div id="tarotRevealResult" style="min-height: 80px; font-size: 0.92rem; color: var(--gold-glow);">
          ${isHi ? "किसी भी कार्ड पर क्लिक करें..." : "Click any card to reveal guidance..."}
        </div>

        <button type="button" class="btn-grand-chat-now" id="btnDiscussTarotChat">
          💬 ${isHi ? "आचार्य जी से संपूर्ण समाधान पाएं (₹1)" : "Get Personal Astrological Reading (₹1 Trial)"}
        </button>
      </div>
    `;

    const cards = [
      { name: "The Sun (सूर्य - विजय व तेज)", meaning: isHi ? "भूतकाल: कठिन परिश्रम के बाद सफलता का उदय।" : "Past: Victory after sincere devotion and persistence." },
      { name: "The Wheel of Fortune (कालचक्र - भाग्य परिवर्तन)", meaning: isHi ? "वर्तमान: आपके पक्ष में नया भाग्य चक्र घूम रहा है। अवसरों को पहचानें।" : "Present: A karmic turning point shifts the odds in your favor." },
      { name: "The Star (नक्षत्र - आशा व मार्गदर्शन)", meaning: isHi ? "मार्गदर्शन: अपनी अंतरात्मा पर भरोसा रखें। ईश्वर आपके साथ हैं।" : "Guidance: Divine clarity guides your next pivotal decision." }
    ];

    [1, 2, 3].forEach((num, idx) => {
      const cardEl = document.getElementById(`tarotCard${num}`);
      if (cardEl) {
        cardEl.addEventListener("click", () => {
          cardEl.style.borderColor = "#ffd166";
          cardEl.style.boxShadow = "0 0 25px rgba(240, 195, 84, 0.6)";
          const res = document.getElementById("tarotRevealResult");
          if (res) {
            res.innerHTML = `
              <strong>✨ ${cards[idx].name}</strong><br>
              <span>${cards[idx].meaning}</span>
            `;
          }
        });
      }
    });

    const btnDiscuss = document.getElementById("btnDiscussTarotChat");
    if (btnDiscuss) {
      btnDiscuss.addEventListener("click", () => {
        this.closeModal("modalMilanCalculator");
        if (!this.currentUser) this.openModal("modalGoogleLogin");
        else this.switchView("chat");
      });
    }

    this.openModal("modalMilanCalculator");
  }

  // Update Language in UI
  updateLanguageUI() {
    const t = translations[this.currentLang] || translations.en;
    const isHi = this.currentLang === "hi";

    // Header & Nav
    const trustRibbon = document.getElementById("trustRibbon");
    if (trustRibbon) trustRibbon.innerHTML = `<span>${t.trustRibbon}</span>`;

    const brandSub = document.getElementById("brandSub");
    if (brandSub) brandSub.textContent = t.brandSubtitle;

    const navHome = document.getElementById("navHome");
    if (navHome) navHome.textContent = t.navHome;
    const navKundli = document.getElementById("navKundli");
    if (navKundli) navKundli.textContent = t.navKundli;
    const navMatching = document.getElementById("navMatching");
    if (navMatching) navMatching.textContent = t.navMatching;
    const navPanchang = document.getElementById("navPanchang");
    if (navPanchang) navPanchang.textContent = t.navPanchang;
    const navAstrologers = document.getElementById("navAstrologers");
    if (navAstrologers) navAstrologers.textContent = t.navAstrologers;
    const navHoroscope = document.getElementById("navHoroscope");
    if (navHoroscope) navHoroscope.textContent = t.navHoroscope;

    // Lang toggle button
    const langFlag = document.getElementById("langFlag");
    if (langFlag) langFlag.textContent = isHi ? "🇮🇳" : "🌐";
    const langLabel = document.getElementById("langLabel");
    if (langLabel) langLabel.textContent = isHi ? "हिंदी (Hindi)" : "English";

    // Hero Text
    const heroMainHeading = document.getElementById("heroMainHeading");
    if (heroMainHeading) heroMainHeading.textContent = t.heroTitle;
    const heroSubText = document.getElementById("heroSubText");
    if (heroSubText) heroSubText.textContent = t.heroSubtitle;

    const googleLoginText = document.getElementById("googleLoginText");
    if (googleLoginText) googleLoginText.textContent = t.loginWithGoogle;

    const trialOfferTitle = document.getElementById("trialOfferTitle");
    if (trialOfferTitle) trialOfferTitle.textContent = isHi ? "विशेष ऑफर: पहली बातचीत मात्र ₹1 में" : "Trial Consultation at just ₹1";

    // Dashboard Greetings
    const dashGreetingTitle = document.getElementById("dashGreetingTitle");
    if (dashGreetingTitle) {
      const name = this.currentUser ? this.currentUser.name : "Gulshan Ji";
      dashGreetingTitle.textContent = isHi ? `स्वागतम्, ${name}!` : `Welcome, ${name}!`;
    }

    const dashServicesTitle = document.getElementById("dashServicesTitle");
    if (dashServicesTitle) dashServicesTitle.textContent = t.quickServices;

    // Refresh Panchang & Horoscope
    this.renderPanchang();
    this.renderHoroscopeNav();
    this.renderHoroscopeDetails(this.selectedRashiId);
    this.renderAstrologers();
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new AstroVedaApp();
});
