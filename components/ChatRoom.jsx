"use client";
import { useState, useEffect, useRef } from "react";
import { calculateVedicChart, renderNorthIndianKundliSVG } from "../src/astrology-engine.js";
import BirthDetailsSelector from "./BirthDetailsSelector";

export default function ChatRoom({ user, t, lang = "hinglish", onBackToDashboard, onRequirePaywall, isUnlocked = false }) {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState("ASK_NAME");
  const [userData, setUserData] = useState({
    name: user ? user.name : "Gulshan Yadav",
    dob: "1996-05-15",
    tob: "08:15 AM",
    pob: "New Delhi",
    concern: "career"
  });
  const [chartData, setChartData] = useState(null);
  const [inputText, setInputText] = useState("");
  const [nameInput, setNameInput] = useState(user ? user.name : "");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const isHi = lang === "hi";
  const isEn = lang === "en";

  // Initialize greeting dynamically based on language
  useEffect(() => {
    const initialName = user ? user.name : "";
    setMessages([
      {
        id: "msg_1",
        sender: "astro",
        text: t.chatGreeting,
        time: "Just now",
        actionType: "NAME_INPUT_FORM",
        namePreset: initialName
      }
    ]);
  }, [lang, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addAstroMessage = (text, actionType = null, extraData = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: "astro",
          text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionType,
          extraData
        }
      ]);
    }, 600);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: "user",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  // Step 1: Name
  const handleNameSelect = (name) => {
    setUserData((prev) => ({ ...prev, name }));
    addUserMessage(name);
    setStep("ASK_BIRTH_DETAILS");
    const askMsg = t.askBirthDetails.replace("{name}", name);
    addAstroMessage(askMsg, "BIRTH_DETAILS_SELECTOR");
  };

  // Step 2: Birth Details
  const handleBirthDetailsConfirm = (details) => {
    setUserData((prev) => ({
      ...prev,
      dob: details.dob,
      tob: details.tob,
      pob: details.pob
    }));
    addUserMessage(`DOB: ${details.dob} | Time: ${details.tob} | Place: ${details.pob}`);
    setStep("ASK_CONCERN");
    const concernMsg = t.askConcern.replace("{name}", userData.name);
    addAstroMessage(concernMsg, "CONCERN_CARDS");
  };

  // Step 3: Concern -> Calculation -> Final Stage Paywall Lock
  const handleConcernSelect = (concernKey, label) => {
    setUserData((prev) => ({ ...prev, concern: concernKey }));
    addUserMessage(label);
    setStep("CALCULATING");

    addAstroMessage(t.calculatingText);

    setTimeout(() => {
      const calculated = calculateVedicChart(userData.dob, userData.tob, userData.pob);
      setChartData(calculated);

      if (!isUnlocked) {
        setStep("PAYWALL_STAGE");
        const lockPrompt = isHi
          ? `🔒 **${userData.name} जी**, आपकी जन्म कुंडली व ग्रह दशा की गणना तैयार है!\n\nसंपूर्ण लग्न चार्ट, महादशा विश्लेषण व आचार्य जी से 1 दिन के असीमित परामर्श हेतु मात्र **₹1** का ट्रायल शुरू करें:`
          : isEn
          ? `🔒 **${userData.name}**, your Janam Kundli & planetary Dasha calculations are ready!\n\nTo unlock your full North Indian chart and start your 1-Day unlimited live reading, pay just **₹1**:`
          : `🔒 **${userData.name} ji**, aapki Janam Kundli calculate ho chuki hai!\n\nComplete North Indian chart, secret predictions aur 1-Day unlimited consultation unlock karne ke liye sirf **₹1** pay karein:`;

        addAstroMessage(lockPrompt, "PAYWALL_TEASER_CARD", { chartData: calculated });
        if (onRequirePaywall) onRequirePaywall(calculated);
      } else {
        renderUnlockedReport(calculated, concernKey);
      }
    }, 1400);
  };

  // Render Unlocked Report
  useEffect(() => {
    if (isUnlocked && chartData && step === "PAYWALL_STAGE") {
      renderUnlockedReport(chartData, userData.concern);
    }
  }, [isUnlocked]);

  const renderUnlockedReport = (calculated, concernKey) => {
    const lagna = isHi ? calculated.lagnaRashi.hi : calculated.lagnaRashi.en;
    const moon = isHi ? calculated.moonRashi.hi : calculated.moonRashi.en;
    const gem = isHi ? calculated.luckyGemstone.nameHi : calculated.luckyGemstone.nameEn;
    const color = isHi ? calculated.luckyColor.hi : calculated.luckyColor.en;
    const dasha = calculated.currentDasha;

    let summaryBullets = [];

    if (concernKey === "career") {
      summaryBullets = isHi ? [
        `💼 **करियर व पदोन्नति:** आपके 10वें भाव में शुभ गोचर चल रहा है। आगामी 3 से 5 माह के भीतर पदोन्नति अथवा नई नौकरी का प्रबल योग है।`,
        `🌟 **महादशा प्रभाव:** ${dasha} आपके कार्यक्षेत्र में मान-सम्मान व नई जिम्मेदारियां दिलाएगी।`,
        `🕉️ **वैदिक उपाय:** प्रातःकाल सूर्य देव को तांबे के लोटे से जल अर्पित करें और ${color} रंग का प्रयोग करें।`,
        `💎 **शुभ रत्न:** आपके लिए **${gem}** धारण करना अत्यंत लाभकारी रहेगा।`
      ] : isEn ? [
        `💼 **Career Growth:** Benefic transits illuminate your 10th house. A strong window for promotion or job change opens in 3-5 months.`,
        `🌟 **Mahadasha Impact:** ${dasha} brings professional leadership and recognition.`,
        `🕉️ **Vedic Remedy:** Offer water to the rising Sun daily and wear touches of ${color}.`,
        `💎 **Empowering Gemstone:** Wearing **${gem}** strengthens your ruling ascendant.`
      ] : [
        `💼 **Career Growth:** 10th house me favorable transit chal raha hai. Agli 3-5 months me promotion ya job switch ka strong yoga hai.`,
        `🌟 **Mahadasha:** ${dasha} nayi responsibilities aur authority dilayega.`,
        `🕉️ **Remedy:** Daily Surya Dev ko jal chadhayein aur ${color} touch pehnein.`,
        `💎 **Lucky Gemstone:** Aapke liye **${gem}** sabse auspicious rahega.`
      ];
    } else if (concernKey === "love") {
      summaryBullets = isHi ? [
        `❤️ **दांपत्य व विवाह योग:** सप्तम भाव में गुरु व शुक्र का शुभ प्रभाव है। जीवनसाथी बुद्धिमान, संस्कारी व सहयोगी होंगे।`,
        `💍 **शुभ समय:** आगामी वर्ष के उत्तरार्ध में विवाह संबंध पक्का होने का सुंदर योग बन रहा है।`,
        `🕉️ **उपाय:** शुक्रवार को कन्याओं को सफेद मिठाई अथवा खीर का दान करें।`,
        `💎 **शुभ रंग:** ${color} रंग आपके संबंधों में प्रेम व मधुरता बढ़ाएगा।`
      ] : isEn ? [
        `❤️ **Marriage Yoga:** Jupiter and Venus cast auspicious aspects on your 7th house. Your partner will be loving and supportive.`,
        `💍 **Timeline:** Auspicious commitment window opens during the upcoming quarters.`,
        `🕉️ **Remedy:** Offer white flowers or sweet milk on Fridays.`,
        `💎 **Auspicious Color:** ${color} fosters domestic harmony.`
      ] : [
        `❤️ **Marriage Yoga:** 7th house me Venus aur Jupiter ka auspicious aspect hai. Partner caring aur supportive honge.`,
        `💍 **Timeline:** Next year early phase me rishta confirm hone ke chances high hain.`,
        `🕉️ **Remedy:** Friday ko white sweets offer karein.`,
        `💎 **Lucky Color:** ${color} relationship me harmony layega.`
      ];
    } else {
      summaryBullets = isHi ? [
        `💎 **शुभ रत्न:** आपका प्रमुख भाग्यशाली रत्न **${gem}** है।`,
        `🕉️ **सिद्ध मंत्र:** *'ॐ नमो भगवते वासुदेवाय'* का नित्य 108 बार जप करें।`,
        `🎨 **शुभ रंग:** ${color} | **शुभ अंक:** ${calculated.luckyNumber.join(", ")}`
      ] : isEn ? [
        `💎 **Auspicious Gemstone:** Your primary birth stone is **${gem}**.`,
        `🕉️ **Sacred Mantra:** Chant *'Om Namo Bhagavate Vasudevaya'* 108 times daily.`,
        `🎨 **Lucky Color:** ${color} | **Lucky Numbers:** ${calculated.luckyNumber.join(", ")}`
      ] : [
        `💎 **Lucky Gemstone:** Aapka primary gemstone **${gem}** hai.`,
        `🕉️ **Mantra Chanting:** *'Om Namo Bhagavate Vasudevaya'* ka daily 108 baar jaap karein.`,
        `🎨 **Auspicious Color:** ${color} | **Lucky Number:** ${calculated.luckyNumber.join(", ")}`
      ];
    }

    addAstroMessage(t.reportReadyTitle, "KUNDLI_REPORT_CARD", {
      chartData: calculated,
      bullets: summaryBullets
    });

    setStep("CHATTING");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!isUnlocked) {
      if (onRequirePaywall) onRequirePaywall(chartData);
      return;
    }

    const query = inputText.trim();
    setInputText("");
    addUserMessage(query);

    const qLower = query.toLowerCase();
    let reply = "";

    if (qLower.includes("job") || qLower.includes("naukri") || qLower.includes("promotion")) {
      reply = isHi
        ? `आपके 10वें भाव में कर्मेश की स्थिति बहुत सुदृढ़ है। देवगुरु बृहस्पति के गोचर से आगामी तिमाही में पदोन्नति के स्पष्ट संकेत हैं। ऑफिस में वाद-विवाद से बचें।`
        : isEn
        ? `Your 10th house Karma lord is strongly placed. Jupiter's aspect brings breakthrough career opportunities in the coming quarter.`
        : `Aapke 10th house me Karma lord strong hai. Upcoming quarter me job offer ya promotion ka solid chance hai. Bas focus maintain karein!`;
    } else if (qLower.includes("shadi") || qLower.includes("marriage") || qLower.includes("love")) {
      reply = isHi
        ? `सप्तम भाव में शुक्र व गुरु का सुंदर योग है। जीवनसाथी कर्तव्यनिष्ठ व संस्कारी होंगे। आगामी मांगलिक ऋतु में संबंध पक्का होने की प्रबल संभावना है।`
        : isEn
        ? `Venus and Jupiter create harmonious aspects in your 7th house. Marriage talks will progress fruitfully in the upcoming festive months.`
        : `7th house me Venus aur Jupiter ka positive yoga hai. Life partner understanding honge aur festive season me rishta confirm hone ka high chance hai.`;
    } else {
      reply = isHi
        ? `आपकी कुंडली में लग्न स्वामी आपको आत्मबल प्रदान कर रहे हैं। वर्तमान दशा चक्र के अनुसार धैर्यपूर्वक आगे बढ़ें, विजय निश्चित है।`
        : isEn
        ? `Your Ascendant lord grants fortitude. As planetary alignments mature, obstacles will dissolve steadily. Have faith in divine timing.`
        : `Aapki Kundli me Lagna lord aapko strong willpower de raha hai. Obstacles current dasha phase complete hote hi clear ho jayenge!`;
    }

    addAstroMessage(reply);
  };

  const speakVoice = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHi ? "hi-IN" : isEn ? "en-IN" : "hi-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="chat-window-wrapper">
      <div className="whatsapp-chat-card">
        {/* WhatsApp Top Bar */}
        <div className="whatsapp-chat-header">
          <div className="chat-user-profile-left">
            <div className="chat-avatar-wrap">
              <img
                src="/assets/acharya_portrait.jpg"
                alt="Acharya Divyanshu"
                className="chat-avatar-img"
              />
              <span className="chat-online-dot" title="Online"></span>
            </div>
            <div className="chat-meta-titles">
              <h3>
                Acharya Divyanshu <span className="verified-tick-badge">✓ Verified Guru</span>
              </h3>
              <p className="chat-status-sub">
                {isUnlocked ? "🟢 1-Day Trial Active • 24 Hours Unlimited Chat" : t.chatOnlineStatus}
              </p>
            </div>
          </div>

          <div className="chat-header-right-btns">
            <button
              className="btn-close-chat"
              onClick={onBackToDashboard}
              title="Dashboard par wapas jayein"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Offer Notice Strip */}
        <div className="chat-offer-banner-strip">
          <span>
            {isUnlocked
              ? "✨ Welcome! 1-Day Unlimited Trial Active • 24 Hours Access"
              : t.trialTitle}
          </span>
        </div>

        {/* Messages Stream */}
        <div className="whatsapp-messages-box">
          {messages.map((m) => {
            const isAstro = m.sender === "astro";
            return (
              <div
                key={m.id}
                className={`msg-row ${isAstro ? "astro-msg-row" : "user-msg-row"}`}
              >
                <div className="msg-bubble-box">
                  <div className={`msg-bubble ${isAstro ? "astro-bubble" : "user-bubble"}`}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: m.text
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n\n/g, "<br/><br/>")
                          .replace(/\n/g, "<br/>")
                      }}
                    />

                    {/* 1. Blank Name Input Form (Zero Dummy Names) */}
                    {m.actionType === "NAME_INPUT_FORM" && (
                      <div className="chat-action-card name-input-card">
                        <span className="action-card-label">
                          {isHi ? "✍️ अपना शुभ नाम दर्ज करें:" : isEn ? "✍️ Enter your full name:" : "✍️ Apna pura naam enter karein:"}
                        </span>
                        <form
                          className="name-input-form-row"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const finalName = nameInput.trim();
                            if (finalName) {
                              handleNameSelect(finalName);
                            }
                          }}
                        >
                          <input
                            type="text"
                            className="name-blank-input"
                            placeholder={isHi ? "यहाँ अपना पूरा नाम लिखें..." : isEn ? "Type your name here..." : "Apna naam yahan likhein..."}
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="btn-name-submit"
                            disabled={!nameInput.trim()}
                          >
                            <span>{isHi ? "आगे बढ़ें ➔" : isEn ? "Continue ➔" : "Aage Badhein ➔"}</span>
                          </button>
                        </form>
                      </div>
                    )}

                    {/* 2. Birth Details Selector */}
                    {m.actionType === "BIRTH_DETAILS_SELECTOR" && (
                      <div style={{ marginTop: "12px" }}>
                        <BirthDetailsSelector
                          initialDob={userData.dob}
                          initialTob={userData.tob}
                          initialPob={userData.pob}
                          onConfirm={handleBirthDetailsConfirm}
                          lang={lang}
                        />
                      </div>
                    )}

                    {/* 3. Concern Chips */}
                    {m.actionType === "CONCERN_CARDS" && (
                      <div className="concerns-grid-2col">
                        <button
                          className="concern-tap-card"
                          onClick={() => handleConcernSelect("career", t.concernCareer)}
                        >
                          <span className="concern-card-icon">💼</span>
                          <div>
                            <strong>{t.concernCareer}</strong>
                            <small>Promotion, Growth</small>
                          </div>
                        </button>
                        <button
                          className="concern-tap-card"
                          onClick={() => handleConcernSelect("love", t.concernLove)}
                        >
                          <span className="concern-card-icon">❤️</span>
                          <div>
                            <strong>{t.concernLove}</strong>
                            <small>Marriage Yoga</small>
                          </div>
                        </button>
                        <button
                          className="concern-tap-card"
                          onClick={() => handleConcernSelect("wealth", t.concernWealth)}
                        >
                          <span className="concern-card-icon">💰</span>
                          <div>
                            <strong>{t.concernWealth}</strong>
                            <small>Income, Prosperity</small>
                          </div>
                        </button>
                        <button
                          className="concern-tap-card"
                          onClick={() => handleConcernSelect("dosha", t.concernDosha)}
                        >
                          <span className="concern-card-icon">🪐</span>
                          <div>
                            <strong>{t.concernDosha}</strong>
                            <small>Sade Sati, Doshas</small>
                          </div>
                        </button>
                        <button
                          className="concern-tap-card"
                          onClick={() => handleConcernSelect("gemstone", t.concernGemstone)}
                        >
                          <span className="concern-card-icon">💍</span>
                          <div>
                            <strong>{t.concernGemstone}</strong>
                            <small>Ratna, Upay</small>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* 4. Paywall Teaser Card at Last Stage */}
                    {m.actionType === "PAYWALL_TEASER_CARD" && (
                      <div
                        style={{
                          marginTop: "12px",
                          background: "#FAF7F2",
                          border: "1.5px solid var(--gold-500)",
                          borderRadius: "14px",
                          padding: "16px",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "2rem", marginBottom: "4px" }}>🔒</div>
                        <h4 style={{ color: "#B45309", fontSize: "1.1rem" }}>
                          {t.lockTitle}
                        </h4>
                        <p style={{ fontSize: "0.84rem", color: "#52525B", margin: "8px 0 14px" }}>
                          {isHi
                            ? "आपकी कुंडली तैयार है। संपूर्ण लग्न चक्र व लाइव परामर्श हेतु मात्र ₹1 का भुगतान करें:"
                            : isEn
                            ? "Your chart is calculated. To unlock the full report and live chat, pay just ₹1:"
                            : "Aapka calculation ready hai. Full report aur live consultation unlock karne ke liye sirf ₹1 pay karein:"}
                        </p>
                        <button
                          className="btn-grand-chat-now"
                          style={{ padding: "12px", fontSize: "0.95rem" }}
                          onClick={() => onRequirePaywall(m.extraData?.chartData)}
                        >
                          {t.paywallCta}
                        </button>
                      </div>
                    )}

                    {/* 5. Unlocked Full Kundli Report */}
                    {m.actionType === "KUNDLI_REPORT_CARD" && m.extraData && (
                      <div className="kundli-chat-report-box">
                        <div style={{ textAlign: "center", color: "var(--gold-400)", fontWeight: "700", fontSize: "1rem" }}>
                          ✦ Lagna Kundli (North Indian Chart) ✦
                        </div>

                        <div
                          className="kundli-svg-wrap"
                          dangerouslySetInnerHTML={{
                            __html: renderNorthIndianKundliSVG(m.extraData.chartData, 280, 280)
                          }}
                        />

                        <div className="metrics-row-pill-grid">
                          <div className="metric-pill-item">
                            <span>Lagna</span>
                            <span>👑 {isHi ? m.extraData.chartData.lagnaRashi.hi : m.extraData.chartData.lagnaRashi.en}</span>
                          </div>
                          <div className="metric-pill-item">
                            <span>Rashi</span>
                            <span>🌙 {isHi ? m.extraData.chartData.moonRashi.hi : m.extraData.chartData.moonRashi.en}</span>
                          </div>
                          <div className="metric-pill-item">
                            <span>Nakshatra</span>
                            <span>✨ {m.extraData.chartData.nakshatra.name}</span>
                          </div>
                        </div>

                        <div className="report-bullets-box">
                          <h5>🔮 Key Astrological Insights:</h5>
                          <ul>
                            {m.extraData.bullets.map((b, i) => (
                              <li
                                key={i}
                                dangerouslySetInnerHTML={{
                                  __html: b.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                }}
                              />
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Time & Read/Voice Bar */}
                    <div className="msg-time-bar">
                      <span>{m.time}</span>
                      {isAstro ? (
                        <button
                          className="btn-speak-voice"
                          onClick={() => speakVoice(m.text)}
                          title="Listen in voice"
                        >
                          🔊
                        </button>
                      ) : (
                        <span style={{ color: "#38bdf8" }}>✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="msg-row typing-row">
              <div className="typing-bubble-dots">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span style={{ fontSize: "0.76rem", color: "#94a3b8", marginLeft: "4px" }}>
                  {isHi ? "आचार्य जी विचार कर रहे हैं..." : "Acharya ji is analyzing the stars..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="whatsapp-input-bar">
          <form className="whatsapp-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="whatsapp-text-input"
              placeholder={isUnlocked ? t.typePlaceholder : "Pehle ₹1 pay karke chat unlock karein..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!isUnlocked && step === "PAYWALL_STAGE"}
            />
            <button type="submit" className="btn-send-whatsapp">
              <span>{isUnlocked ? t.sendBtn : "Unlock ⚡"}</span>
              <span>➤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
