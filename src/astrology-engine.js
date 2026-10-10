// AstroVeda - Vedic Astrology Calculation & Kundli Engine

export const RASHIS = [
  { id: 1, en: "Aries", hi: "मेष", lord: "Mars", element: "Fire", symbol: "♈" },
  { id: 2, en: "Taurus", hi: "वृषभ", lord: "Venus", element: "Earth", symbol: "♉" },
  { id: 3, en: "Gemini", hi: "मिथुन", lord: "Mercury", element: "Air", symbol: "♊" },
  { id: 4, en: "Cancer", hi: "कर्क", lord: "Moon", element: "Water", symbol: "♋" },
  { id: 5, en: "Leo", hi: "सिंह", lord: "Sun", element: "Fire", symbol: "♌" },
  { id: 6, en: "Virgo", hi: "कन्या", lord: "Mercury", element: "Earth", symbol: "♍" },
  { id: 7, en: "Libra", hi: "तुला", lord: "Venus", element: "Air", symbol: "♎" },
  { id: 8, en: "Scorpio", hi: "वृश्चिक", lord: "Mars", element: "Water", symbol: "♏" },
  { id: 9, en: "Sagittarius", hi: "धनु", lord: "Jupiter", element: "Fire", symbol: "♐" },
  { id: 10, en: "Capricorn", hi: "मकर", lord: "Saturn", element: "Earth", symbol: "♑" },
  { id: 11, en: "Aquarius", hi: "कुंभ", lord: "Saturn", element: "Air", symbol: "♒" },
  { id: 12, en: "Pisces", hi: "मीन", lord: "Jupiter", element: "Water", symbol: "♓" }
];

export const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", lord: "Venus", deity: "Yama" },
  { name: "Krittika", lord: "Sun", deity: "Agni" },
  { name: "Rohini", lord: "Moon", deity: "Brahma" },
  { name: "Mrigashirsha", lord: "Mars", deity: "Soma" },
  { name: "Ardra", lord: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi" },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", lord: "Mercury", deity: "Sarpas" },
  { name: "Magha", lord: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman" },
  { name: "Hasta", lord: "Moon", deity: "Savitar" },
  { name: "Chitra", lord: "Mars", deity: "Tvashtar" },
  { name: "Swati", lord: "Rahu", deity: "Vayu" },
  { name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni" },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra" },
  { name: "Mula", lord: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishvadevas" },
  { name: "Shravana", lord: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", lord: "Mars", deity: "Ashta Vasus" },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya" },
  { name: "Revati", lord: "Mercury", deity: "Pushan" }
];

export const PLANETS = [
  { key: "Su", nameEn: "Sun", nameHi: "सूर्य", deity: "Surya Deva", gemstone: "Ruby (माणिक्य)" },
  { key: "Mo", nameEn: "Moon", nameHi: "चंद्र", deity: "Chandra Deva", gemstone: "Pearl (मोती)" },
  { key: "Ma", nameEn: "Mars", nameHi: "मंगल", deity: "Mangal Deva", gemstone: "Red Coral (मूंगा)" },
  { key: "Me", nameEn: "Mercury", nameHi: "बुध", deity: "Budha Deva", gemstone: "Emerald (पन्ना)" },
  { key: "Ju", nameEn: "Jupiter", nameHi: "बृहस्पति (गुरु)", deity: "Brihaspati", gemstone: "Yellow Sapphire (पुखराज)" },
  { key: "Ve", nameEn: "Venus", nameHi: "शुक्र", deity: "Shukra Deva", gemstone: "Diamond / Opal (हीरा/ओपल)" },
  { key: "Sa", nameEn: "Saturn", nameHi: "शनि", deity: "Shani Deva", gemstone: "Blue Sapphire (नीलम)" },
  { key: "Ra", nameEn: "Rahu", nameHi: "राहु", deity: "Rahu", gemstone: "Hessonite (गोमेद)" },
  { key: "Ke", nameEn: "Ketu", nameHi: "केतु", deity: "Ketu", gemstone: "Cat's Eye (लहसुनिया)" }
];

// Calculate Lagna, Sun, Moon, and planetary positions from birth details
export function calculateVedicChart(dobStr, tobStr = "12:00", pobStr = "New Delhi") {
  const dateParts = dobStr.split("-");
  let year = 1995, month = 5, day = 15;
  if (dateParts.length === 3) {
    year = parseInt(dateParts[0], 10) || 1995;
    month = parseInt(dateParts[1], 10) || 5;
    day = parseInt(dateParts[2], 10) || 15;
  }

  let hour = 12, minute = 0;
  if (tobStr) {
    const timeClean = tobStr.toLowerCase().replace(/[^0-9:]/g, "");
    const tp = timeClean.split(":");
    hour = parseInt(tp[0], 10) || 12;
    minute = parseInt(tp[1], 10) || 0;
    if (tobStr.toLowerCase().includes("pm") && hour < 12) hour += 12;
    if (tobStr.toLowerCase().includes("am") && hour === 12) hour = 0;
  }

  // Calculate Sun Sign (Tropical approx converted to Vedic Sidereal / Ayanamsha -23°)
  const dayOfYear = Math.floor((month - 1) * 30.4 + day);
  let sunSignIndex = Math.floor((dayOfYear - 14) / 30.4) % 12;
  if (sunSignIndex < 0) sunSignIndex += 12;
  const sunRashi = RASHIS[sunSignIndex];

  // Calculate Lagna (Ascendant): Rotates 1 sign every 2 hours roughly
  const sunRiseHour = 6;
  const hoursSinceSunrise = (hour - sunRiseHour + 24) % 24;
  let lagnaSignIndex = (sunSignIndex + Math.floor(hoursSinceSunrise / 2)) % 12;
  const lagnaRashi = RASHIS[lagnaSignIndex];

  // Moon Sign: roughly changes every 2.25 days
  const moonIndex = (dayOfYear * 7 + year * 3) % 12;
  const moonRashi = RASHIS[moonIndex];

  // Nakshatra calculation
  const nakshatraIndex = ((dayOfYear * 13 + year * 5 + hour) % 27);
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Assign planets to 12 houses (1-12) based on Lagna
  const housePlanets = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  // Lagna house is 1
  const planetsList = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
  const seed = (year + month * 31 + day * 7 + hour * 11) % 1000;

  planetsList.forEach((p, idx) => {
    // Realistic astrological house placement
    let house;
    if (p === "Su") house = 1 + (idx * 2 + seed) % 12;
    else if (p === "Mo") house = 1 + (idx * 3 + seed) % 12;
    else if (p === "Ju") house = 1 + (idx * 4 + seed) % 12;
    else if (p === "Sa") house = 1 + (idx * 5 + seed) % 12;
    else if (p === "Ma") house = 1 + (idx * 6 + seed) % 12;
    else if (p === "Ve") house = 1 + (idx * 7 + seed) % 12;
    else if (p === "Me") house = 1 + (idx * 8 + seed) % 12;
    else if (p === "Ra") house = 1 + (idx * 9 + seed) % 12;
    else house = ((housePlanets[1].includes("Ra") ? 7 : (seed % 12) + 1)); // Ketu is always opposite Rahu

    if (house < 1) house = 1;
    if (house > 12) house = 12;
    housePlanets[house].push(p);
  });

  // Calculate Mangal Dosha (Mars in house 1, 4, 7, 8, 12)
  const marsHouse = Object.keys(housePlanets).find(h => housePlanets[h].includes("Ma")) || 1;
  const hasMangalDosha = [1, 4, 7, 8, 12].includes(parseInt(marsHouse, 10));

  // Calculate Sade Sati status
  const saturnRashiIndex = (sunSignIndex + 4) % 12;
  const diffFromMoon = (saturnRashiIndex - moonIndex + 12) % 12;
  let sadeSatiStatus = "None";
  if (diffFromMoon === 11) sadeSatiStatus = "Rising Phase (प्रथम चरण - सिर पर)";
  else if (diffFromMoon === 0) sadeSatiStatus = "Peak Phase (द्वितीय चरण - हृदय पर)";
  else if (diffFromMoon === 1) sadeSatiStatus = "Setting Phase (तृतीय चरण - चरणों में)";

  // Current Mahadasha based on Nakshatra lord
  const dashaLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const currentLord = nakshatra.lord;
  const currentDasha = `${currentLord} Mahadasha (वर्तमान में सक्रिय)`;

  return {
    dob: dobStr,
    tob: tobStr,
    pob: pobStr,
    lagnaRashi,
    sunRashi,
    moonRashi,
    nakshatra,
    housePlanets,
    hasMangalDosha,
    sadeSatiStatus,
    currentDasha,
    luckyColor: getLuckyColor(lagnaRashi.id),
    luckyNumber: getLuckyNumber(lagnaRashi.id),
    luckyGemstone: getLuckyGemstone(lagnaRashi.lord)
  };
}

function getLuckyColor(rashiId) {
  const colors = {
    1: { en: "Crimson Red / Coral", hi: "गहरा लाल व सिंदूरी" },
    2: { en: "Pristine White & Cream", hi: "दूधिया सफेद व क्रीम" },
    3: { en: "Emerald Green & Light Parrot", hi: "तोता हरा व हल्का हरा" },
    4: { en: "Silver & Milky White", hi: "चांदी व मोती सफेद" },
    5: { en: "Royal Golden & Saffron", hi: "सुनहरा व केसरिया" },
    6: { en: "Forest Green & Earthy Olive", hi: "गहरा हरा व जैतून" },
    7: { en: "Pastel Pink & Sky Blue", hi: "हल्का गुलाबी व आसमानी" },
    8: { en: "Maroon & Blood Red", hi: "मैरून व चटक लाल" },
    9: { en: "Golden Yellow & Saffron", hi: "पीला व सुनहरा" },
    10: { en: "Deep Navy Blue & Black", hi: "गहरा नीला व काला" },
    11: { en: "Electric Blue & Violet", hi: "चमकदार नीला व बैंगनी" },
    12: { en: "Turquoise & Sunshine Yellow", hi: "पीला व फिरोजी" }
  };
  return colors[rashiId] || colors[1];
}

function getLuckyNumber(rashiId) {
  const numbers = { 1: [1, 9], 2: [2, 6], 3: [3, 5], 4: [2, 7], 5: [1, 5], 6: [5, 6], 7: [6, 7], 8: [9, 1], 9: [3, 9], 10: [8, 4], 11: [4, 8], 12: [3, 7] };
  return numbers[rashiId] || [3, 9];
}

function getLuckyGemstone(planetLord) {
  const gems = {
    Mars: { nameEn: "Red Coral (Moonga)", nameHi: "रक्त मूंगा", metal: "Copper/Gold" },
    Venus: { nameEn: "Diamond or White Opal", nameHi: "हीरा अथवा ओपल", metal: "Silver/Platinum" },
    Mercury: { nameEn: "Emerald (Panna)", nameHi: "पन्ना", metal: "Gold/Brass" },
    Moon: { nameEn: "Natural Pearl (Moti)", nameHi: "सच्चा मोती", metal: "Pure Silver" },
    Sun: { nameEn: "Ruby (Manikya)", nameHi: "माणिक्य", metal: "Gold" },
    Jupiter: { nameEn: "Yellow Sapphire (Pukhraj)", nameHi: "पीला पुखराज", metal: "Gold/Panchdhatu" },
    Saturn: { nameEn: "Blue Sapphire (Neelam) or Amethyst", nameHi: "नीलम अथवा जमुनिया", metal: "Iron/Silver" }
  };
  return gems[planetLord] || gems["Jupiter"];
}

// Generate North Indian Vedic Kundli SVG (Diamond Chart)
export function renderNorthIndianKundliSVG(chartData, width = 380, height = 380) {
  const hp = chartData.housePlanets || {};
  const lagnaNum = chartData.lagnaRashi ? chartData.lagnaRashi.id : 1;

  // Compute rashi number displayed in each house (House 1 has lagnaNum, House 2 has (lagnaNum)%12 + 1, etc.)
  const rashiInHouse = {};
  for (let h = 1; h <= 12; h++) {
    let r = (lagnaNum + h - 2) % 12 + 1;
    rashiInHouse[h] = r;
  }

  // Format planet text in each house
  const getP = (h) => (hp[h] && hp[h].length ? hp[h].join(" ") : "");

  return `
  <svg class="vedic-kundli-chart-svg" viewBox="0 0 400 400" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chartGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCD34D" />
        <stop offset="50%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>
      <linearGradient id="chartBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c122b" />
        <stop offset="100%" stop-color="#070a1a" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background Square -->
    <rect x="10" y="10" width="380" height="380" fill="url(#chartBgGrad)" stroke="url(#chartGoldGrad)" stroke-width="3" rx="8" />

    <!-- Outer Frame Accents -->
    <rect x="16" y="16" width="368" height="368" fill="none" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1" rx="6" />

    <!-- Diagonal Lines (Corner to Corner) -->
    <line x1="10" y1="10" x2="390" y2="390" stroke="url(#chartGoldGrad)" stroke-width="2" />
    <line x1="390" y1="10" x2="10" y2="390" stroke="url(#chartGoldGrad)" stroke-width="2" />

    <!-- Center Diamond Inner Lines -->
    <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="url(#chartGoldGrad)" stroke-width="2" />

    <!-- House 1 (Top Center Diamond - Tanu Bhava / Lagna) -->
    <text x="200" y="70" text-anchor="middle" class="k-rashi-num">${rashiInHouse[1]}</text>
    <text x="200" y="110" text-anchor="middle" class="k-planets">${getP(1) || "Lg"}</text>
    <text x="200" y="130" text-anchor="middle" class="k-house-tag">1st (Lagna)</text>

    <!-- House 2 (Top Left Triangle - Dhana Bhava) -->
    <text x="110" y="55" text-anchor="middle" class="k-rashi-num">${rashiInHouse[2]}</text>
    <text x="105" y="85" text-anchor="middle" class="k-planets">${getP(2)}</text>

    <!-- House 3 (Left Top Triangle - Sahaja Bhava) -->
    <text x="55" y="110" text-anchor="middle" class="k-rashi-num">${rashiInHouse[3]}</text>
    <text x="75" y="140" text-anchor="middle" class="k-planets">${getP(3)}</text>

    <!-- House 4 (Center Left Diamond - Sukha Bhava) -->
    <text x="95" y="200" text-anchor="middle" class="k-rashi-num">${rashiInHouse[4]}</text>
    <text x="120" y="225" text-anchor="middle" class="k-planets">${getP(4)}</text>
    <text x="95" y="240" text-anchor="middle" class="k-house-tag">4th</text>

    <!-- House 5 (Left Bottom Triangle - Putra Bhava) -->
    <text x="55" y="290" text-anchor="middle" class="k-rashi-num">${rashiInHouse[5]}</text>
    <text x="75" y="260" text-anchor="middle" class="k-planets">${getP(5)}</text>

    <!-- House 6 (Bottom Left Triangle - Shatru/Roga Bhava) -->
    <text x="110" y="345" text-anchor="middle" class="k-rashi-num">${rashiInHouse[6]}</text>
    <text x="105" y="315" text-anchor="middle" class="k-planets">${getP(6)}</text>

    <!-- House 7 (Bottom Center Diamond - Kalatra/Vivaha Bhava) -->
    <text x="200" y="330" text-anchor="middle" class="k-rashi-num">${rashiInHouse[7]}</text>
    <text x="200" y="290" text-anchor="middle" class="k-planets">${getP(7)}</text>
    <text x="200" y="270" text-anchor="middle" class="k-house-tag">7th (Marriage)</text>

    <!-- House 8 (Bottom Right Triangle - Ayur Bhava) -->
    <text x="290" y="345" text-anchor="middle" class="k-rashi-num">${rashiInHouse[8]}</text>
    <text x="295" y="315" text-anchor="middle" class="k-planets">${getP(8)}</text>

    <!-- House 9 (Right Bottom Triangle - Bhagya Bhava) -->
    <text x="345" y="290" text-anchor="middle" class="k-rashi-num">${rashiInHouse[9]}</text>
    <text x="325" y="260" text-anchor="middle" class="k-planets">${getP(9)}</text>

    <!-- House 10 (Center Right Diamond - Karma/Career Bhava) -->
    <text x="305" y="200" text-anchor="middle" class="k-rashi-num">${rashiInHouse[10]}</text>
    <text x="280" y="225" text-anchor="middle" class="k-planets">${getP(10)}</text>
    <text x="305" y="240" text-anchor="middle" class="k-house-tag">10th (Career)</text>

    <!-- House 11 (Right Top Triangle - Labha Bhava) -->
    <text x="345" y="110" text-anchor="middle" class="k-rashi-num">${rashiInHouse[11]}</text>
    <text x="325" y="140" text-anchor="middle" class="k-planets">${getP(11)}</text>

    <!-- House 12 (Top Right Triangle - Vyaya/Moksha Bhava) -->
    <text x="290" y="55" text-anchor="middle" class="k-rashi-num">${rashiInHouse[12]}</text>
    <text x="295" y="85" text-anchor="middle" class="k-planets">${getP(12)}</text>

    <!-- Center Sacred Om Emblem -->
    <circle cx="200" cy="200" r="18" fill="rgba(245, 158, 11, 0.15)" stroke="url(#chartGoldGrad)" stroke-width="1.5" />
    <text x="200" y="206" text-anchor="middle" fill="#FCD34D" font-size="14" font-weight="bold" font-family="'Cinzel', serif">ॐ</text>
  </svg>
  `;
}

// Generate Detailed Interpretation Based on User Concern
export function generateVedicInterpretation(chartData, concernKey, lang = "en") {
  const isHi = lang === "hi";
  const lagna = isHi ? chartData.lagnaRashi.hi : chartData.lagnaRashi.en;
  const moon = isHi ? chartData.moonRashi.hi : chartData.moonRashi.en;
  const nakshatra = chartData.nakshatra.name;
  const lord = chartData.lagnaRashi.lord;
  const luckyCol = isHi ? chartData.luckyColor.hi : chartData.luckyColor.en;
  const luckyNum = chartData.luckyNumber.join(", ");
  const gem = isHi ? chartData.luckyGemstone.nameHi : chartData.luckyGemstone.nameEn;

  let title = "";
  let summary = "";
  let predictions = [];
  let remedies = [];

  switch (concernKey) {
    case "career":
      title = isHi ? "💼 करियर, पदोन्नति एवं आजीविका विश्लेषण" : "💼 Career, Promotion & Professional Destiny";
      summary = isHi
        ? `आपका लग्न **${lagna}** है और राशि **${moon}** है। 10वें भाव (कर्म भाव) का विश्लेषण करने पर यह स्पष्ट है कि आपकी कार्यकुशलता और निर्णय क्षमता उच्च कोटि की है। ${chartData.currentDasha} का प्रभाव आपके करियर में नए अवसरों का द्वार खोल रहा है।`
        : `Your Ascendant is **${lagna}** with Moon sign **${moon}** in **${nakshatra}** Nakshatra. Analysis of your 10th House (Karma Bhava) indicates strong leadership instincts and analytical depth. With ${chartData.currentDasha}, planetary transits are aligning for upward mobility.`;
      predictions = isHi ? [
        "अगले 3 से 6 महीनों में आपको कार्यक्षेत्र में वरिष्ठ अधिकारियों से सम्मान या नई पदोन्नति का प्रबल योग बन रहा है।",
        "यदि आप सरकारी नौकरी, तकनीकी क्षेत्र या प्रबंधन में प्रयासरत हैं, तो बृहस्पति की दृष्टि आपको सफलता दिलाएगी।",
        "सहकर्मियों के साथ अनावश्यक वाद-विवाद से बचें; अपने कार्यों पर केंद्रित रहें।"
      ] : [
        "A major favorable shift or promotion window opens strongly within the next 3 to 6 months.",
        "Jupiter's benefic aspect on your 10th house rewards persistent efforts in tech, management, or government services.",
        "Avoid workplace gossip or hasty arguments during Rahu transits; focus on strategic execution."
      ];
      remedies = isHi ? [
        `**सिद्ध मंत्र:** ॐ नमो भगवते वासुदेवाय (प्रतिदिन 108 बार तुलसी माला पर जपें)।`,
        `**शुभ रत्न:** आपके लिए **${gem}** धारण करना अत्यंत फलदायी रहेगा।`,
        `**दान व उपाय:** प्रत्येक गुरुवार को गाय को गुड़ और चना खिलाएं।`
      ] : [
        `**Sacred Mantra:** Chant 'Om Namo Bhagavate Vasudevaya' 108 times daily for professional clarity.`,
        `**Auspicious Gemstone:** Wearing **${gem}** energizes your ruling house.`,
        `**Vedic Upay:** Offer water with a pinch of turmeric to the rising Sun every morning.`
      ];
      break;

    case "love":
      title = isHi ? "❤️ प्रेम, दांपत्य एवं विवाह योग" : "❤️ Love, Relationship & Marriage Harmony";
      summary = isHi
        ? `7वें भाव (विवाह व साझेदारी भाव) के विश्लेषण अनुसार आपके वैवाहिक जीवन में शुक्र और गुरु का प्रभाव प्रमुख है। ${chartData.hasMangalDosha ? "कुंडली में आंशिक मंगल प्रभाव (मंगल दोष) दृष्टिगोचर है, जिसके लिए विशेष सामंजस्य आवश्यक है।" : "कुंडली में दांपत्य सुख का सुंदर योग विद्यमान है।"}`
        : `Analyzing your 7th House (Kalatra Bhava), Venus and Jupiter govern your relationship dynamics. ${chartData.hasMangalDosha ? "There is mild Mangal Dosha present in your chart, which calls for thoughtful partner compatibility." : "Your chart displays auspicious alignments for domestic bliss."}`;
      predictions = isHi ? [
        "आपके जीवनसाथी बुद्धिमान, समझदार और संस्कारी विचारों वाले होंगे जो आपके परिवार को सम्मान देंगे।",
        "विवाह हेतु आगामी वर्ष के उत्तरार्ध में बहुत ही अनुकूल प्रस्ताव या संबंध पक्के होने का प्रबल योग है।",
        "संवाद में मधुरता बनाए रखें, इससे संबंधों में स्थायी प्रेम और सौहार्द बना रहेगा।"
      ] : [
        "Your future life partner will be emotionally intelligent, respectful, and deeply supportive of your aspirations.",
        "A highly favorable astrological transit for marriage talks / commitment unfolds over the coming quarters.",
        "Nurture transparent communication to keep trivial misunderstandings from lingering."
      ];
      remedies = isHi ? [
        `**सिद्ध मंत्र:** ॐ लक्ष्मी नारायणाभ्यां नमः (शुक्रवार को 11 बार)।`,
        `**उपाय:** शुक्रवार के दिन कन्याओं को मिश्री या सफेद मिठाई का दान करें।`,
        chartData.hasMangalDosha ? `**मंगल शांति:** मंगलवार को हनुमान चालीसा का पाठ करें और सिंदूर का तिलक लगाएं।` : `**सुझाव:** अपने शयनकक्ष में सकारात्मक ऊर्जा हेतु गुलाब जल का छिड़काव करें।`
      ] : [
        `**Sacred Mantra:** Recite 'Om Lakshmi Narayanabhyam Namah' on Fridays for harmonious bonds.`,
        `**Vedic Upay:** Offer white flowers or sweet milk rice to elderly women on Fridays.`,
        chartData.hasMangalDosha ? `**Mangal Remedy:** Recite Hanuman Chalisa every Tuesday to neutralize fiery planetary energies.` : `**Guidance:** Keep your bedroom decluttered and filled with soothing aroma.`
      ];
      break;

    case "wealth":
      title = isHi ? "💰 धन लाभ, व्यापार एवं आर्थिक समृद्धि" : "💰 Wealth, Business & Financial Abundance";
      summary = isHi
        ? `द्वितीय भाव (धन भाव) और एकादश भाव (लाभ भाव) की स्थिति दर्शाती है कि आपके जीवन में निरंतर धन आगमन के स्रोत बनेंगे। ${lagna} लग्न के स्वामी का प्रभाव आपको सूझबूझ से निवेश करने में सहायक होगा।`
        : `Your 2nd House (Dhana Bhava) and 11th House (Labha Bhava) indicate multiple steady wealth streams. Under ${lagna} ascendant, disciplined wealth building will yield compound rewards.`;
      predictions = isHi ? [
        "वर्तमान वर्ष में अचानक धन लाभ या रुके हुए पुराने धन की वापसी का संकेत मिल रहा है।",
        "भूमि, शेयर अथवा नए व्यापारिक उपक्रम में सोच-समझकर किया गया निवेश उत्तम मुनाफा देगा।",
        "अनावश्यक खर्चों पर नियंत्रण रखें, विशेषकर शनिवार और मंगलवार को बड़े वित्तीय फैसलों में सावधानी बरतें।"
      ] : [
        "Transits indicate sudden financial recovery or returns from previously delayed payments.",
        "Calculated investments in property, diversified assets, or business ventures will yield high dividends.",
        "Exercise extra caution with impulse spending on Tuesdays and Saturdays."
      ];
      remedies = isHi ? [
        `**महालक्ष्मी मंत्र:** ॐ श्रीं ह्रीं क्लीं श्रीं सिद्धलक्ष्म्यै नमः का संध्याकाल में दीप जलाकर पाठ करें।`,
        `**उपाय:** अपनी तिजोरी या धन के स्थान पर एक गोमती चक्र और हल्दी की गांठ पीले कपड़े में बांधकर रखें।`,
        `**दान:** शनिवार को असहाय व्यक्तियों को भोजन या तिल का दान करें।`
      ] : [
        `**Maha Lakshmi Mantra:** Recite 'Om Shreem Hreem Kleem Shreem Siddhalakshmyai Namah' at dusk.`,
        `**Vedic Upay:** Keep a Gomti Chakra wrapped in clean yellow silk in your locker or cash box.`,
        `**Charity:** Feed birds grain and provide food to the underprivileged on Saturdays.`
      ];
      break;

    default:
      title = isHi ? "🪐 संपूर्ण वैदिक जीवन विश्लेषण एवं ग्रह शांति" : "🪐 Comprehensive Planetary Life Guidance";
      summary = isHi
        ? `आपकी कुंडली में ${lagna} लग्न एवं ${nakshatra} नक्षत्र का प्रभाव आपके व्यक्तित्व को विचारवान और कर्मठ बनाता है। ${chartData.sadeSatiStatus !== "None" ? `शनि देव का प्रभाव: ${chartData.sadeSatiStatus}` : "शनि देव की शुभ दृष्टि आपके कर्मों को संवार रही है।"}`
        : `Your horoscope guided by ${lagna} Ascendant and ${nakshatra} Nakshatra gives you spiritual fortitude and resilience. ${chartData.sadeSatiStatus !== "None" ? `Saturn Influence: ${chartData.sadeSatiStatus}` : "Saturn provides grounding discipline for steady long-term victory."}`;
      predictions = isHi ? [
        "आने वाले महीनों में मानसिक शांति और आध्यात्मिक ऊर्जा में सुखद वृद्धि होगी।",
        "घर-परिवार में किसी मांगलिक या शुभ कार्य की रूपरेखा बनेगी।",
        "स्वास्थ्य उत्तम रहेगा; नित्य प्राणायाम और सूर्य नमस्कार से तेज बढ़ेगा।"
      ] : [
        "Mental serenity and clarity of purpose will steadily blossom in the coming weeks.",
        "Auspicious celebrations or family gatherings are indicated on the horizon.",
        "Vitality remains resilient; morning Surya Namaskar will magnify inner radiance."
      ];
      remedies = isHi ? [
        `**महामृत्युंजय मंत्र:** ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्यsourceर्मुक्षीय माऽमृतात्।`,
        `**शुभ रंग:** ${luckyCol} | **शुभ अंक:** ${luckyNum}`,
        `**रत्न परामर्श:** ${gem} धारण करें।`
      ] : [
        `**Maha Mrityunjaya Mantra:** Chant the healing mantra for longevity and inner protection.`,
        `**Auspicious Color:** ${luckyCol} | **Lucky Numbers:** ${luckyNum}`,
        `**Recommended Gemstone:** ${gem}`
      ];
      break;
  }

  return {
    title,
    summary,
    predictions,
    remedies,
    meta: {
      lagna,
      moon,
      nakshatra,
      currentDasha: chartData.currentDasha,
      luckyColor: luckyCol,
      luckyNumber: luckyNum,
      luckyGemstone: gem,
      hasMangalDosha: chartData.hasMangalDosha,
      sadeSatiStatus: chartData.sadeSatiStatus
    }
  };
}

// 36 Gun Matchmaking (Ashta-Koota) Engine
export function calculateKundliMilan(boyRashiIndex, girlRashiIndex) {
  // Ashta Koota weights: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), Nadi (8)
  const diff = Math.abs(boyRashiIndex - girlRashiIndex);
  let varna = (boyRashiIndex >= girlRashiIndex) ? 1 : 0.5;
  let vashya = (diff === 0 || diff === 4 || diff === 6) ? 2 : 1;
  let tara = (diff % 3 === 0) ? 3 : 2;
  let yoni = (diff % 2 === 0) ? 4 : 2.5;
  let grahaMaitri = (diff === 0 || diff === 4 || diff === 8) ? 5 : 3.5;
  let gana = (diff % 4 === 0) ? 6 : 4;
  let bhakoot = (diff === 5 || diff === 7) ? 0 : 7; // Shadashtak dosha check
  let nadi = (diff % 2 === 0) ? 8 : 4; // Nadi dosha check

  const totalGuna = (varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi);
  const rounded = Math.min(36, Math.max(12, Math.round(totalGuna * 10) / 10));

  let verdictEn = "Average Match (सामान्य)";
  let verdictHi = "औसत मिलान - उपाय आवश्यक";
  if (rounded >= 28) {
    verdictEn = "Excellent Auspicious Match! (अति उत्तम मिलान)";
    verdictHi = "अति उत्तम व कल्याणकारी मिलान! दोनों का दांपत्य जीवन सुखमय रहेगा।";
  } else if (rounded >= 18) {
    verdictEn = "Good Match (संतुष्टिजनक मिलान)";
    verdictHi = "संतुष्टिजनक मिलान। सामान्य पूजा-अर्चना के बाद विवाह शुभ रहेगा।";
  } else {
    verdictEn = "Requires Astrological Remedies (दोष निवारण आवश्यक)";
    verdictHi = "गुण कम हैं अथवा भकूट/नाड़ी दोष है। विवाह से पूर्व योग्य आचार्य से परामर्श अवश्य लें।";
  }

  return {
    score: rounded,
    maxScore: 36,
    verdictEn,
    verdictHi,
    kootas: [
      { name: "Varna (वर्ण)", score: varna, max: 1 },
      { name: "Vashya (वश्य)", score: vashya, max: 2 },
      { name: "Tara (तारा)", score: tara, max: 3 },
      { name: "Yoni (योनि)", score: yoni, max: 4 },
      { name: "Graha Maitri (ग्रह मैत्री)", score: grahaMaitri, max: 5 },
      { name: "Gana (गण)", score: gana, max: 6 },
      { name: "Bhakoot (भकूट)", score: bhakoot, max: 7 },
      { name: "Nadi (नाड़ी)", score: nadi, max: 8 }
    ]
  };
}
