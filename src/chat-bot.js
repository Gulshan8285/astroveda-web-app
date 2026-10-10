// AstroVeda - Interactive Vedic Astrologer Chat Flow Engine
import { calculateVedicChart, renderNorthIndianKundliSVG, generateVedicInterpretation, RASHIS } from "./astrology-engine.js";
import { translations } from "./i18n.js";

export class AstrologerChatEngine {
  constructor(containerElement, onStateChange) {
    this.container = containerElement;
    this.onStateChange = onStateChange;
    this.lang = "hi"; // default to Hindi as requested by Indian user, switchable anytime
    this.currentStep = "GREETING"; // GREETING -> ASK_NAME -> ASK_DOB -> ASK_TOB -> ASK_POB -> ASK_CONCERN -> GENERATING -> REPORT -> OPEN_CHAT
    this.userData = {
      name: "",
      dob: "1996-06-15",
      tob: "08:15 AM",
      pob: "New Delhi",
      concern: "career"
    };
    this.chartData = null;
    this.messages = [];
    this.isTyping = false;
  }

  setLanguage(newLang) {
    if (this.lang === newLang) return;
    this.lang = newLang;
    this.render();
  }

  init(userDefaultName = "") {
    if (userDefaultName) {
      this.userData.name = userDefaultName;
    }
    this.messages = [];
    this.currentStep = "GREETING";
    this.startConversation();
  }

  startConversation() {
    const isHi = this.lang === "hi";
    const initialText = isHi
      ? `नमस्ते! मैं **आचार्य दिव्यांशु** हूँ। भगवान श्री गणेश एवं महादेव की कृपा आप पर सदैव बनी रहे। 🙏\n\nआपकी जन्म कुंडली का सटीक अध्ययन करने के लिए कृपया अपनी पसंदीदा भाषा चुनें और अपना शुभ नाम बताएं:`
      : `Namaste! I am **Acharya Divyanshu**. May Lord Ganesha illuminate your destiny. 🙏\n\nTo study your Janam Kundli and planetary transits, please choose your language and share your full name:`;

    this.addAstrologerMessage(initialText, {
      type: "LANGUAGE_AND_NAME",
      namePreset: this.userData.name || "Gulshan Yadav"
    });
    this.currentStep = "ASK_NAME";
  }

  addAstrologerMessage(text, meta = null) {
    this.messages.push({
      sender: "astrologer",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      meta
    });
    this.render();
    this.scrollToBottom();
  }

  addUserMessage(text) {
    this.messages.push({
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    this.render();
    this.scrollToBottom();
  }

  handleUserInput(inputText) {
    if (!inputText || !inputText.trim()) return;
    const text = inputText.trim();

    if (this.currentStep === "ASK_NAME") {
      this.userData.name = text;
      this.addUserMessage(text);
      this.currentStep = "ASK_DOB";
      this.simulateAstrologerTyping(() => {
        const isHi = this.lang === "hi";
        const reply = isHi
          ? `प्रणाम **${this.userData.name}** जी! आपके ग्रह नक्षत्रों की स्थिति जानने के लिए कृपया अपनी जन्म तिथि (Date of Birth) बताएं:`
          : `Pranam **${this.userData.name}** ji! To calculate your planetary degrees, please provide your Date of Birth:`;
        this.addAstrologerMessage(reply, { type: "DOB_PICKER" });
      });
      return;
    }

    if (this.currentStep === "ASK_DOB") {
      this.userData.dob = text;
      this.addUserMessage(text);
      this.currentStep = "ASK_TOB";
      this.simulateAstrologerTyping(() => {
        const isHi = this.lang === "hi";
        const reply = isHi
          ? `शुभ! आपका जन्म समय (Time of Birth) क्या है? (उदा. सुबह 07:30 AM, दोपहर, या सटीक समय न पता होने पर 'अनुमानित' चुनें):`
          : `Excellent. At what time were you born? (e.g. 07:30 AM, or select 'Approximate / Don't Know'):`;
        this.addAstrologerMessage(reply, { type: "TOB_OPTIONS" });
      });
      return;
    }

    if (this.currentStep === "ASK_TOB") {
      this.userData.tob = text;
      this.addUserMessage(text);
      this.currentStep = "ASK_POB";
      this.simulateAstrologerTyping(() => {
        const isHi = this.lang === "hi";
        const reply = isHi
          ? `आपका जन्म स्थान (Place of Birth - शहर/राज्य) क्या है?`
          : `Where were you born? (City / State / Country):`;
        this.addAstrologerMessage(reply, { type: "POB_OPTIONS" });
      });
      return;
    }

    if (this.currentStep === "ASK_POB") {
      this.userData.pob = text;
      this.addUserMessage(text);
      this.currentStep = "ASK_CONCERN";
      this.simulateAstrologerTyping(() => {
        const isHi = this.lang === "hi";
        const reply = isHi
          ? `धन्यवाद ${this.userData.name} जी। आज आप मुख्य रूप से किस विषय पर मार्गदर्शन व समाधान चाहते हैं?`
          : `Thank you ${this.userData.name} ji. Which primary sphere of life would you like astrological guidance on?`;
        this.addAstrologerMessage(reply, { type: "CONCERN_CHIPS" });
      });
      return;
    }

    // Free Open Chat Mode
    this.addUserMessage(text);
    this.simulateAstrologerTyping(() => {
      this.generateAIResponse(text);
    });
  }

  handleConcernSelect(concernKey) {
    this.userData.concern = concernKey;
    const isHi = this.lang === "hi";
    const concernLabels = {
      career: isHi ? "💼 करियर, नौकरी और तरक्की" : "💼 Career, Job & Promotion",
      love: isHi ? "❤️ प्रेम, विवाह योग और दांपत्य" : "❤️ Love, Marriage & Relationship",
      wealth: isHi ? "💰 धन लाभ, व्यापार और आर्थिक स्थिति" : "💰 Wealth, Business & Finances",
      health: isHi ? "🩺 स्वास्थ्य और ऊर्जा" : "🩺 Health & Vitality",
      dosha: isHi ? "🪐 शनि साढ़े साती व राहु-केतु दोष" : "🪐 Shani Sade Sati & Doshas",
      remedy: isHi ? "💍 शुभ रत्न व सिद्ध वैदिक उपाय" : "💍 Gemstone & Divine Remedies"
    };

    this.addUserMessage(concernLabels[concernKey] || concernKey);
    this.currentStep = "GENERATING";

    // Show calculating state
    const calculatingMsg = isHi
      ? `⏳ ॐ गं गणपतये नमः... आपकी जन्म कुंडली, लग्न चक्र, नवमांश और विंशोत्तरी महादशा की गणना की जा रही है...`
      : `⏳ Om Gam Ganapataye Namah... Calculating your Lagna, Chandra Rashi, Nakshatra, and Vimshottari Mahadasha...`;
    this.addAstrologerMessage(calculatingMsg, { type: "CALCULATING_ANIMATION" });

    setTimeout(() => {
      // Remove calculation message and present chart & interpretation
      this.messages.pop();
      this.chartData = calculateVedicChart(this.userData.dob, this.userData.tob, this.userData.pob);
      const interpretation = generateVedicInterpretation(this.chartData, concernKey, this.lang);

      const intro = isHi
        ? `✨ **${this.userData.name} जी**, आपकी जन्म कुंडली का वैदिक विश्लेषण तैयार है। नीचे आपकी लग्न कुंडली एवं ग्रह स्थिति दी गई है:`
        : `✨ **${this.userData.name} ji**, your sacred Vedic horoscope has been calculated. Below is your Lagna Kundli and planetary alignment:`;

      this.addAstrologerMessage(intro, {
        type: "KUNDLI_REPORT",
        chartData: this.chartData,
        interpretation
      });

      this.currentStep = "OPEN_CHAT";
      this.render();
      this.scrollToBottom();
    }, 1800);
  }

  generateAIResponse(userQuery) {
    const isHi = this.lang === "hi";
    const qLower = userQuery.toLowerCase();
    const chart = this.chartData || calculateVedicChart(this.userData.dob, this.userData.tob, this.userData.pob);
    const lagna = isHi ? chart.lagnaRashi.hi : chart.lagnaRashi.en;
    const moon = isHi ? chart.moonRashi.hi : chart.moonRashi.en;
    const nakshatra = chart.nakshatra.name;
    const gem = isHi ? chart.luckyGemstone.nameHi : chart.luckyGemstone.nameEn;
    const color = isHi ? chart.luckyColor.hi : chart.luckyColor.en;

    let response = "";

    if (qLower.includes("job") || qLower.includes("career") || qLower.includes("नौकरी") || qLower.includes("प्रमोशन") || qLower.includes("काम")) {
      response = isHi
        ? `आपके **${lagna} लग्न** के दशम भाव में कर्मेश की स्थिति बहुत अनुकूल है। वर्तमान गोचर के अनुसार आगामी 3 से 5 माह के भीतर पदोन्नति या नई बेहतर नौकरी के स्पष्ट संकेत हैं।\n\n🔹 **मार्गदर्शन:** सूर्य देव को नित्य अर्घ्य दें और महत्वपूर्ण साक्षात्कार या बैठकों में ${color} रंग का प्रयोग करें।`
        : `In your **${lagna} Ascendant**, the 10th House lord of career indicates a powerful breakthrough within 3 to 5 months. Jupiter's aspect protects your professional status.\n\n🔹 **Remedy:** Offer water to the morning Sun and wear touches of ${color} during major career discussions.`;
    } else if (qLower.includes("marriage") || qLower.includes("shadi") || qLower.includes("love") || qLower.includes("विवाह") || qLower.includes("शादी") || qLower.includes("प्यार")) {
      response = isHi
        ? `आपके सप्तम भाव (विवाह भाव) का स्वामी ग्रह आपके दांपत्य में सुखद सामंजस्य दर्शाता है। ${chart.hasMangalDosha ? "आपकी कुंडली में आंशिक मांगलिक प्रभाव है, इसलिए गुण मिलान के साथ आगे बढ़ना सर्वोत्तम रहेगा।" : "आपकी कुंडली में विवाह योग बहुत सुदृढ़ है।"}\n\n🔹 **संकेत:** आगामी वर्ष के आरंभ में शुभ संबंध पक्का होने की प्रबल संभावना है। गुरुवार को विष्णु सहस्त्रनाम का पाठ करें।`
        : `Your 7th House (Kalatra Bhava) indicates an empathetic and loving life partner. ${chart.hasMangalDosha ? "A mild Mangal aspect is present, so Gun Milan compatibility is advised." : "Your chart holds auspicious configurations for domestic happiness."}\n\n🔹 **Timeline:** An auspicious transit arrives within the upcoming festive cycles.`;
    } else if (qLower.includes("money") || qLower.includes("paisa") || qLower.includes("wealth") || qLower.includes("धन") || qLower.includes("पैसा") || qLower.includes("कर्ज")) {
      response = isHi
        ? `आपकी राशि **${moon}** के अनुसार द्वितीय एवं एकादश भाव में धन योग बन रहा है। पुराना रुका हुआ धन मिलने की संभावना है।\n\n🔹 **अचूक उपाय:** शुक्रवार को महालक्ष्मी जी के समक्ष घी का दीपक जलाएं और शुक्रवार को सफेद वस्तु (खीर या मिश्री) का दान करें।`
        : `Your 2nd and 11th Houses indicate strong wealth accumulation yogas. Delayed payments or financial opportunities will materialize.\n\n🔹 **Vedic Upay:** Light a pure ghee lamp before Goddess Maha Lakshmi on Friday evenings.`;
    } else if (qLower.includes("shani") || qLower.includes("sade sati") || qLower.includes("शनि") || qLower.includes("साढ़ेसाती")) {
      response = isHi
        ? `शनि देव की स्थिति का विश्लेषण: आपकी राशि ${moon} पर ${chart.sadeSatiStatus !== "None" ? chart.sadeSatiStatus : "वर्तमान में कोई अनिष्टकारी साढ़ेसाती नहीं है"}।\n\n🔹 **शनि कृपा उपाय:** प्रत्येक शनिवार को पीपल के वृक्ष पर जल अर्पित करें और सरसों के तेल का दीपक जलाएं। असहाय व्यक्तियों की सेवा करें।`
        : `Saturn Transit Analysis: For your ${moon} Moon sign, ${chart.sadeSatiStatus !== "None" ? `you are in ${chart.sadeSatiStatus}` : "there is no negative Sade Sati affliction currently"}.\n\n🔹 **Saturn Remedy:** Light a mustard oil lamp under a Peepal tree on Saturdays and help the needy.`;
    } else if (qLower.includes("gemstone") || qLower.includes("stone") || qLower.includes("रत्न")) {
      response = isHi
        ? `आपकी कुंडली के लग्नेश अनुसार आपके लिए सर्वोत्तम शुभ रत्न **${gem}** है।\n\n🔹 **धारण विधि:** इसे शुक्ल पक्ष के शुभ दिन विधि-विधान से अभिमंत्रित करवाकर धारण करें। यह आपके आत्मविश्वास, भाग्य और आरोग्य में चमत्कारी वृद्धि करेगा।`
        : `Based on your Ascendant lord, your most empowering Vedic gemstone is **${gem}**.\n\n🔹 **Wearing Instructions:** Wear it energized during Shukla Paksha on its planetary weekday for maximum aura protection and prosperity.`;
    } else {
      response = isHi
        ? `आपके इस प्रश्न पर गहन दृष्टि डालने पर ज्ञात होता है कि आपकी कुंडली के ग्रह आपको दृढ़ संकल्प और विजय का आशीर्वाद दे रहे हैं। वर्तमान **${chart.currentDasha}** आपको धैर्य रखने और सही समय पर कदम उठाने का संदेश दे रही है।\n\n🔹 **शुभ मंत्र:** *ॐ नमो नारायणाय* का प्रतिदिन 108 बार जप करें। आपका शुभ अंक **${chart.luckyNumber.join(", ")}** है। क्या आप किसी अन्य विशेष पहलू पर चर्चा करना चाहते हैं?`
        : `Reflecting deeply on your query with respect to your ${lagna} Lagna and ${chart.currentDasha}, planetary energies urge balanced discipline and strategic patience.\n\n🔹 **Divine Advice:** Recite *'Om Namo Narayanaya'* daily. Your lucky numbers are **${chart.luckyNumber.join(", ")}**. Feel free to ask any other specific query, ${this.userData.name} ji!`;
    }

    this.addAstrologerMessage(response, {
      type: "FOLLOW_UP_SUGGESTIONS"
    });
  }

  simulateAstrologerTyping(callback) {
    this.isTyping = true;
    this.render();
    this.scrollToBottom();

    setTimeout(() => {
      this.isTyping = false;
      callback();
    }, 900);
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBox = this.container.querySelector(".chat-messages-container");
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 50);
  }

  speakMessage(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown formatting
    const cleanText = text.replace(/[*#_~`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  render() {
    const isHi = this.lang === "hi";

    let html = `
      <div class="astrologer-chat-wrapper">
        <!-- Chat Top Bar -->
        <div class="chat-top-header">
          <div class="chat-astrologer-profile">
            <div class="astrologer-avatar-wrap">
              <img src="/assets/acharya_portrait.jpg" alt="Acharya Divyanshu" class="astrologer-header-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23D4AF37\\'/><text x=\\'50\\' y=\\'55\\' font-size=\\'30\\' text-anchor=\\'middle\\' fill=\\'black\\'>ॐ</text></svg>'">
              <span class="online-pulse-dot" title="Live Online"></span>
            </div>
            <div class="astrologer-meta-info">
              <div class="astrologer-name-title">
                <h3>${isHi ? "आचार्य दिव्यांशु" : "Acharya Divyanshu"} <span class="verified-gold-badge">✓ ${isHi ? "प्रमाणित" : "Verified"}</span></h3>
              </div>
              <p class="astrologer-status-sub">${isHi ? "काशी वैदिक विद्वान • 18+ वर्ष अनुभव • ₹1 ट्रायल सत्र" : "Vedic Jyotish Master • 18+ Yrs Exp • ₹1 Trial Session"}</p>
            </div>
          </div>

          <div class="chat-header-actions">
            <!-- Language Switcher in Chat -->
            <div class="chat-lang-switch">
              <button class="lang-pill ${this.lang === 'hi' ? 'active' : ''}" data-lang="hi">🇮🇳 हिंदी</button>
              <button class="lang-pill ${this.lang === 'en' ? 'active' : ''}" data-lang="en">🌐 English</button>
            </div>
            <button class="chat-tool-btn" id="btnEndChat" title="${isHi ? 'डैशबोर्ड पर लौटें' : 'Back to Dashboard'}">✕</button>
          </div>
        </div>

        <!-- Trial Banner Alert -->
        <div class="chat-trial-strip">
          <span class="pulse-sparkle">✨</span>
          <span>${isHi ? "विशेष वेलकम ऑफर: आपका ₹1 ट्रायल परामर्श सक्रिय है • 100% गोपनीय एवं प्रामाणिक" : "Special Welcome Offer: Your ₹1 Trial Consultation is Active • 100% Confidential & Authentic"}</span>
        </div>

        <!-- Messages Container -->
        <div class="chat-messages-container" id="chatMessages">
          ${this.messages.map((m, idx) => this.renderMessageItem(m, idx)).join("")}

          ${this.isTyping ? `
            <div class="chat-msg-row astrologer-row typing-row">
              <div class="chat-avatar-mini">
                <img src="/assets/acharya_portrait.jpg" alt="Acharya" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23D4AF37\\'/></svg>'">
              </div>
              <div class="chat-bubble typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-status-text">${isHi ? "आचार्य जी गणना कर रहे हैं..." : "Acharya ji is analyzing the stars..."}</span>
              </div>
            </div>
          ` : ""}
        </div>

        <!-- Quick Question Prompts -->
        ${this.currentStep === "OPEN_CHAT" ? `
          <div class="quick-prompts-scroller">
            <span class="quick-prompts-label">${isHi ? "सुझाए गए प्रश्न:" : "Quick Inquiries:"}</span>
            <button class="prompt-chip" data-prompt="${isHi ? 'मेरी नई नौकरी या प्रमोशन कब लगेगा?' : 'When will I get a job promotion?'}">${isHi ? '💼 नौकरी व प्रमोशन कब?' : '💼 Promotion Timing?'}</button>
            <button class="prompt-chip" data-prompt="${isHi ? 'मेरा विवाह कब और किसके साथ होगा?' : 'When will I get married?'}">${isHi ? '❤️ विवाह व जीवनसाथी?' : '❤️ Marriage Timeline?'}</button>
            <button class="prompt-chip" data-prompt="${isHi ? 'क्या मुझ पर शनि की साढ़ेसाती चल रही है?' : 'Do I have Shani Sade Sati?'}">${isHi ? '🪐 शनि साढ़े साती?' : '🪐 Shani Sade Sati?'}</button>
            <button class="prompt-chip" data-prompt="${isHi ? 'मेरे लिए सबसे शुभ रत्न कौन सा है?' : 'Which gemstone should I wear?'}">${isHi ? '💍 मेरा शुभ रत्न?' : '💍 Best Gemstone?'}</button>
            <button class="prompt-chip" data-prompt="${isHi ? 'आर्थिक लाभ के लिए कोई अचूक वैदिक उपाय बताएं' : 'Remedies for wealth and business success'}">${isHi ? '💰 धन लाभ के उपाय?' : '💰 Wealth Remedy?'}</button>
          </div>
        ` : ""}

        <!-- Chat Input Field -->
        <div class="chat-input-area">
          <form id="chatInputForm" class="chat-form">
            <input type="text" id="chatUserText" class="chat-text-input" placeholder="${isHi ? 'यहाँ अपना प्रश्न या जानकारी लिखें...' : 'Type your question or birth details here...'}" autocomplete="off" />
            <button type="button" class="voice-mic-btn" id="btnVoiceInput" title="${isHi ? 'बोलकर पूछें (Voice Input)' : 'Speak Question'}">🎙️</button>
            <button type="submit" class="chat-send-btn" id="btnSendChat">
              <span>${isHi ? "भेजें" : "Send"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            </button>
          </form>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();
  }

  renderMessageItem(m, idx) {
    const isAstrologer = m.sender === "astrologer";
    const isHi = this.lang === "hi";

    let contentHtml = this.formatMarkdownText(m.text);

    // Interactive custom widgets based on message metadata
    let interactiveWidget = "";

    if (m.meta) {
      if (m.meta.type === "LANGUAGE_AND_NAME") {
        interactiveWidget = `
          <div class="interactive-input-card">
            <div class="lang-selector-box">
              <label class="input-card-label">${isHi ? "पसंदीदा परामर्श भाषा:" : "Preferred Consultation Language:"}</label>
              <div class="lang-btns-row">
                <button type="button" class="lang-choice-btn ${this.lang === 'hi' ? 'selected' : ''}" data-choose-lang="hi">🇮🇳 हिंदी (Hindi)</button>
                <button type="button" class="lang-choice-btn ${this.lang === 'en' ? 'selected' : ''}" data-choose-lang="en">🌐 English</button>
              </div>
            </div>
            <div class="quick-name-suggestions">
              <label class="input-card-label">${isHi ? "अपना शुभ नाम दर्ज करें:" : "Enter or Select Your Full Name:"}</label>
              <div class="chips-row">
                <button type="button" class="name-quick-chip" data-name="${m.meta.namePreset}">${m.meta.namePreset}</button>
                <button type="button" class="name-quick-chip" data-name="Rahul Sharma">Rahul Sharma</button>
                <button type="button" class="name-quick-chip" data-name="Priya Patel">Priya Patel</button>
                <button type="button" class="name-quick-chip" data-name="Amit Verma">Amit Verma</button>
              </div>
            </div>
          </div>
        `;
      } else if (m.meta.type === "DOB_PICKER") {
        interactiveWidget = `
          <div class="interactive-input-card">
            <label class="input-card-label">${isHi ? "जन्म तिथि चुनें:" : "Select Date of Birth:"}</label>
            <div class="dob-picker-row">
              <input type="date" id="dobInputInteractive" class="astrology-date-picker" value="${this.userData.dob}" max="${new Date().toISOString().split('T')[0]}" />
              <button type="button" class="btn-confirm-step" id="btnConfirmDob">${isHi ? "पुष्टि करें ✓" : "Confirm ✓"}</button>
            </div>
            <div class="chips-row mt-2">
              <button type="button" class="name-quick-chip" data-dob="1995-04-12">12 Apr 1995</button>
              <button type="button" class="name-quick-chip" data-dob="1998-10-24">24 Oct 1998</button>
              <button type="button" class="name-quick-chip" data-dob="1992-08-15">15 Aug 1992</button>
              <button type="button" class="name-quick-chip" data-dob="2000-01-01">01 Jan 2000</button>
            </div>
          </div>
        `;
      } else if (m.meta.type === "TOB_OPTIONS") {
        interactiveWidget = `
          <div class="interactive-input-card">
            <label class="input-card-label">${isHi ? "जन्म समय चुनें या दर्ज करें:" : "Select or Enter Time of Birth:"}</label>
            <div class="tob-picker-row">
              <input type="time" id="tobInputInteractive" class="astrology-time-picker" value="08:15" />
              <button type="button" class="btn-confirm-step" id="btnConfirmTob">${isHi ? "पुष्टि करें ✓" : "Confirm ✓"}</button>
            </div>
            <div class="chips-row mt-2">
              <button type="button" class="name-quick-chip" data-tob="06:30 AM">🌅 प्रातः काल (06:30 AM)</button>
              <button type="button" class="name-quick-chip" data-tob="12:15 PM">☀️ दोपहर (12:15 PM)</button>
              <button type="button" class="name-quick-chip" data-tob="07:45 PM">🌙 सायं काल (07:45 PM)</button>
              <button type="button" class="name-quick-chip" data-tob="12:00 PM (Approximate)">⌛ सटीक पता नहीं / Approximate</button>
            </div>
          </div>
        `;
      } else if (m.meta.type === "POB_OPTIONS") {
        interactiveWidget = `
          <div class="interactive-input-card">
            <label class="input-card-label">${isHi ? "जन्म स्थान चुनें या नीचे टाइप करें:" : "Select or Type Birth City:"}</label>
            <div class="chips-row">
              <button type="button" class="name-quick-chip" data-pob="New Delhi, India">📍 New Delhi</button>
              <button type="button" class="name-quick-chip" data-pob="Varanasi, UP">📍 Varanasi</button>
              <button type="button" class="name-quick-chip" data-pob="Mumbai, Maharashtra">📍 Mumbai</button>
              <button type="button" class="name-quick-chip" data-pob="Jaipur, Rajasthan">📍 Jaipur</button>
              <button type="button" class="name-quick-chip" data-pob="Lucknow, UP">📍 Lucknow</button>
              <button type="button" class="name-quick-chip" data-pob="Bengaluru, Karnataka">📍 Bengaluru</button>
            </div>
          </div>
        `;
      } else if (m.meta.type === "CONCERN_CHIPS") {
        interactiveWidget = `
          <div class="concern-grid-selector">
            <button class="concern-card-btn" data-concern="career">
              <span class="concern-icon">💼</span>
              <div class="concern-btn-text">
                <strong>${isHi ? "करियर व नौकरी" : "Career & Job"}</strong>
                <small>${isHi ? "प्रमोशन, नई नौकरी, व्यापार" : "Promotion, Switching, Growth"}</small>
              </div>
            </button>
            <button class="concern-card-btn" data-concern="love">
              <span class="concern-icon">❤️</span>
              <div class="concern-btn-text">
                <strong>${isHi ? "प्रेम व विवाह" : "Love & Marriage"}</strong>
                <small>${isHi ? "विवाह समय, जीवनसाथी, प्रेम योग" : "Marriage Timing, Partner, Love"}</small>
              </div>
            </button>
            <button class="concern-card-btn" data-concern="wealth">
              <span class="concern-icon">💰</span>
              <div class="concern-btn-text">
                <strong>${isHi ? "धन व आर्थिक समृद्धि" : "Wealth & Finances"}</strong>
                <small>${isHi ? "धन लाभ, कर्ज मुक्ति, निवेश" : "Income Growth, Investments"}</small>
              </div>
            </button>
            <button class="concern-card-btn" data-concern="dosha">
              <span class="concern-icon">🪐</span>
              <div class="concern-btn-text">
                <strong>${isHi ? "शनि साढ़े साती व दोष" : "Shani & Planetary Dosha"}</strong>
                <small>${isHi ? "शनि शांति, कालसर्प, मंगल दोष" : "Sade Sati, Manglik, Rahu"}</small>
              </div>
            </button>
            <button class="concern-card-btn" data-concern="remedy">
              <span class="concern-icon">💍</span>
              <div class="concern-btn-text">
                <strong>${isHi ? "शुभ रत्न व सिद्ध उपाय" : "Gemstones & Remedies"}</strong>
                <small>${isHi ? "धारण विधि, मंत्र, दान" : "Wearing Guide, Mantras, Charity"}</small>
              </div>
            </button>
            <button class="concern-card-btn" data-concern="health">
              <span class="concern-icon">🩺</span>
              <div class="concern-btn-text">
                <strong>${isHi ? "स्वास्थ्य व ऊर्जा" : "Health & Longevity"}</strong>
                <small>${isHi ? "आरोग्य, मानसिक शांति" : "Vitality, Inner Peace"}</small>
              </div>
            </button>
          </div>
        `;
      } else if (m.meta.type === "KUNDLI_REPORT") {
        const { chartData, interpretation } = m.meta;
        interactiveWidget = `
          <div class="kundli-chat-report-card">
            <!-- Kundli Chart SVG Visualizer -->
            <div class="chart-display-panel">
              <div class="chart-header-row">
                <h4 class="chart-heading-title">✦ ${isHi ? "लग्न कुंडली (North Indian Lagna Chart)" : "Lagna Kundli (North Indian Chart)"} ✦</h4>
                <span class="chart-badge-tag">${chartData.currentDasha}</span>
              </div>
              <div class="chart-svg-container">
                ${renderNorthIndianKundliSVG(chartData, 340, 340)}
              </div>
            </div>

            <!-- Vedic Planetary Metrics Grid -->
            <div class="vedic-metrics-grid">
              <div class="metric-pill">
                <span class="metric-lbl">${isHi ? "लग्न (Ascendant)" : "Lagna"}</span>
                <span class="metric-val">👑 ${isHi ? chartData.lagnaRashi.hi : chartData.lagnaRashi.en} (${chartData.lagnaRashi.lord})</span>
              </div>
              <div class="metric-pill">
                <span class="metric-lbl">${isHi ? "चंद्र राशि (Moon Sign)" : "Moon Sign"}</span>
                <span class="metric-val">🌙 ${isHi ? chartData.moonRashi.hi : chartData.moonRashi.en}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-lbl">${isHi ? "सूर्य राशि (Sun Sign)" : "Sun Sign"}</span>
                <span class="metric-val">☀️ ${isHi ? chartData.sunRashi.hi : chartData.sunRashi.en}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-lbl">${isHi ? "जन्म नक्षत्र" : "Nakshatra"}</span>
                <span class="metric-val">✨ ${chartData.nakshatra.name} (${chartData.nakshatra.lord})</span>
              </div>
              <div class="metric-pill">
                <span class="metric-lbl">${isHi ? "मांगलिक प्रभाव" : "Mangal Status"}</span>
                <span class="metric-val ${chartData.hasMangalDosha ? 'text-amber' : 'text-emerald'}">
                  ${chartData.hasMangalDosha ? (isHi ? "आंशिक मंगल प्रभाव" : "Mild Mangal Presence") : (isHi ? "दोष रहित (शुभ)" : "No Dosha (Favorable)")}
                </span>
              </div>
              <div class="metric-pill">
                <span class="metric-lbl">${isHi ? "शनि साढ़े साती" : "Sade Sati Phase"}</span>
                <span class="metric-val">${chartData.sadeSatiStatus !== 'None' ? chartData.sadeSatiStatus : (isHi ? "सक्रिय नहीं" : "Inactive")}</span>
              </div>
            </div>

            <!-- Interpretation Section -->
            <div class="interpretation-content-box">
              <h4 class="interp-title">${interpretation.title}</h4>
              <p class="interp-summary">${this.formatMarkdownText(interpretation.summary)}</p>

              <div class="predictions-list-box">
                <h5>${isHi ? "🔮 आगामी भविष्यवाणी व ग्रह संकेत:" : "🔮 Key Astrological Predictions:"}</h5>
                <ul>
                  ${interpretation.predictions.map(p => `<li>${this.formatMarkdownText(p)}</li>`).join("")}
                </ul>
              </div>

              <div class="remedies-list-box">
                <h5>${isHi ? "✨ आचार्य जी के सिद्ध वैदिक उपाय एवं मंत्र:" : "✨ Acharya Ji's Vedic Remedies & Mantras:"}</h5>
                <ul>
                  ${interpretation.remedies.map(r => `<li>${this.formatMarkdownText(r)}</li>`).join("")}
                </ul>
              </div>

              <!-- Action Bar inside report -->
              <div class="report-action-buttons">
                <button type="button" class="btn-action-outline btn-listen-voice" data-msg-idx="${idx}">
                  🔊 ${isHi ? "आचार्य जी की वाणी में सुनें" : "Listen in Voice"}
                </button>
                <button type="button" class="btn-action-gold btn-download-kundli">
                  📜 ${isHi ? "कुंडली रिपोर्ट सेव करें" : "Download Kundli PDF"}
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="chat-msg-row ${isAstrologer ? 'astrologer-row' : 'user-row'}">
        ${isAstrologer ? `
          <div class="chat-avatar-mini">
            <img src="/assets/acharya_portrait.jpg" alt="Acharya" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23D4AF37\\'/></svg>'">
          </div>
        ` : ""}
        <div class="chat-bubble-container">
          <div class="chat-bubble ${isAstrologer ? 'astrologer-bubble' : 'user-bubble'}">
            ${contentHtml}
            ${interactiveWidget}
            <div class="chat-meta-bar">
              <span class="chat-time">${m.time}</span>
              ${isAstrologer ? `
                <button type="button" class="mini-voice-btn" data-msg-idx="${idx}" title="${isHi ? 'सुनें' : 'Listen'}">🔊</button>
              ` : `
                <span class="chat-read-tick">✓✓</span>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  formatMarkdownText(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  }

  bindEvents() {
    // Language pills inside header
    this.container.querySelectorAll(".lang-pill").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.dataset.lang;
        this.setLanguage(lang);
      });
    });

    // Language selector in initial message
    this.container.querySelectorAll("[data-choose-lang]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.dataset.chooseLang;
        this.setLanguage(lang);
      });
    });

    // Close / End Chat
    const btnEnd = this.container.querySelector("#btnEndChat");
    if (btnEnd) {
      btnEnd.addEventListener("click", () => {
        if (this.onStateChange) this.onStateChange("DASHBOARD");
      });
    }

    // Name Quick Chips
    this.container.querySelectorAll(".name-quick-chip[data-name]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const name = e.currentTarget.dataset.name;
        this.handleUserInput(name);
      });
    });

    // Confirm DOB
    const btnConfirmDob = this.container.querySelector("#btnConfirmDob");
    if (btnConfirmDob) {
      btnConfirmDob.addEventListener("click", () => {
        const input = this.container.querySelector("#dobInputInteractive");
        if (input && input.value) {
          this.handleUserInput(input.value);
        }
      });
    }

    // DOB Quick Chips
    this.container.querySelectorAll(".name-quick-chip[data-dob]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.handleUserInput(e.currentTarget.dataset.dob);
      });
    });

    // Confirm TOB
    const btnConfirmTob = this.container.querySelector("#btnConfirmTob");
    if (btnConfirmTob) {
      btnConfirmTob.addEventListener("click", () => {
        const input = this.container.querySelector("#tobInputInteractive");
        if (input && input.value) {
          this.handleUserInput(input.value);
        }
      });
    }

    // TOB Quick Chips
    this.container.querySelectorAll(".name-quick-chip[data-tob]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.handleUserInput(e.currentTarget.dataset.tob);
      });
    });

    // POB Quick Chips
    this.container.querySelectorAll(".name-quick-chip[data-pob]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.handleUserInput(e.currentTarget.dataset.pob);
      });
    });

    // Concern Card Buttons
    this.container.querySelectorAll(".concern-card-btn[data-concern]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const concern = e.currentTarget.dataset.concern;
        this.handleConcernSelect(concern);
      });
    });

    // Quick Inquiries Chips
    this.container.querySelectorAll(".prompt-chip").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const prompt = e.currentTarget.dataset.prompt;
        this.handleUserInput(prompt);
      });
    });

    // Voice reading buttons
    this.container.querySelectorAll(".mini-voice-btn, .btn-listen-voice").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.msgIdx, 10);
        if (this.messages[idx]) {
          this.speakMessage(this.messages[idx].text);
        }
      });
    });

    // Download Kundli PDF / Print
    const btnDownload = this.container.querySelector(".btn-download-kundli");
    if (btnDownload) {
      btnDownload.addEventListener("click", () => {
        window.print();
      });
    }

    // Chat form submit
    const chatForm = this.container.querySelector("#chatInputForm");
    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = this.container.querySelector("#chatUserText");
        if (input && input.value.trim()) {
          const val = input.value.trim();
          input.value = "";
          this.handleUserInput(val);
        }
      });
    }

    // Voice input button
    const btnVoice = this.container.querySelector("#btnVoiceInput");
    if (btnVoice) {
      btnVoice.addEventListener("click", () => {
        this.startVoiceRecognition();
      });
    }
  }

  startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(this.lang === "hi" ? "आपके ब्राउज़र में वॉयस रिकॉग्निशन समर्थित नहीं है। कृपया लिखकर पूछें।" : "Voice recognition is not supported in this browser. Please type your query.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = this.lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;

    const input = this.container.querySelector("#chatUserText");
    const micBtn = this.container.querySelector("#btnVoiceInput");
    if (micBtn) micBtn.classList.add("recording-pulse");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (input) input.value = transcript;
      if (micBtn) micBtn.classList.remove("recording-pulse");
      this.handleUserInput(transcript);
    };

    recognition.onerror = () => {
      if (micBtn) micBtn.classList.remove("recording-pulse");
    };

    recognition.onend = () => {
      if (micBtn) micBtn.classList.remove("recording-pulse");
    };

    recognition.start();
  }
}
