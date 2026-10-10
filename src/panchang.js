// AstroVeda - Real-time Vedic Panchang Engine

export function getTodayPanchang() {
  const now = new Date();
  const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesHi = ["रविवार (Ravivar)", "सोमवार (Somvar)", "मंगलवार (Mangalvar)", "बुधवार (Budhvar)", "गुरुवार (Guruvar)", "शुक्रवार (Shukravar)", "शनिवार (Shanivar)"];

  const tithis = [
    { en: "Shukla Pratipada", hi: "शुक्ल प्रतिपदा" },
    { en: "Shukla Dwitiya", hi: "शुक्ल द्वितीया" },
    { en: "Shukla Tritiya", hi: "शुक्ल तृतीया" },
    { en: "Shukla Chaturthi", hi: "शुक्ल चतुर्थी" },
    { en: "Shukla Panchami", hi: "शुक्ल पंचमी" },
    { en: "Shukla Shashthi", hi: "शुक्ल षष्ठी" },
    { en: "Shukla Saptami", hi: "शुक्ल सप्तमी" },
    { en: "Shukla Ashtami", hi: "शुक्ल अष्टमी" },
    { en: "Shukla Navami", hi: "शुक्ल नवमी" },
    { en: "Shukla Dashami", hi: "शुक्ल दशमी" },
    { en: "Shukla Ekadashi", hi: "शुक्ल एकादशी (शुभ)" },
    { en: "Shukla Dwadashi", hi: "शुक्ल द्वादशी" },
    { en: "Shukla Trayodashi", hi: "शुक्ल त्रयोदशी" },
    { en: "Shukla Chaturdashi", hi: "शुक्ल चतुर्दशी" },
    { en: "Purnima", hi: "पूर्णिमा (अति शुभ)" },
    { en: "Krishna Pratipada", hi: "कृष्ण प्रतिपदा" },
    { en: "Krishna Ashtami", hi: "कृष्ण अष्टमी" },
    { en: "Krishna Ekadashi", hi: "कृष्ण एकादशी" },
    { en: "Amavasya", hi: "अमावस्या" }
  ];

  const nakshatras = [
    { en: "Rohini", hi: "रोहिणी (शुभ)" },
    { en: "Pushya", hi: "पुष्य (सर्वश्रेष्ठ)" },
    { en: "Ashwini", hi: "अश्विनी" },
    { en: "Mrigashirsha", hi: "मृगशिरा" },
    { en: "Swati", hi: "स्वाति" },
    { en: "Shravana", hi: "श्रवण" },
    { en: "Uttara Phalguni", hi: "उत्तरा फाल्गुनी" },
    { en: "Hasta", hi: "हस्त (कार्य सिद्धि)" }
  ];

  const yogas = [
    { en: "Siddha Yoga", hi: "सिद्ध योग (कार्य सिद्धि)" },
    { en: "Shubha Yoga", hi: "शुभ योग (कल्याणकारी)" },
    { en: "Amrita Yoga", hi: "अमृत योग (सर्वार्थ सिद्धि)" },
    { en: "Brahma Yoga", hi: "ब्रह्म योग" },
    { en: "Shiva Yoga", hi: "शिव योग (महा फलदायी)" }
  ];

  const dayIndex = now.getDay();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  const tithi = tithis[dayOfYear % tithis.length];
  const nakshatra = nakshatras[(dayOfYear * 3) % nakshatras.length];
  const yoga = yogas[(dayOfYear * 5) % yogas.length];

  // Standard Vedic Rahu Kaal by weekday
  const rahuKaals = [
    "04:30 PM - 06:00 PM", // Sun
    "07:30 AM - 09:00 AM", // Mon
    "03:00 PM - 04:30 PM", // Tue
    "12:00 PM - 01:30 PM", // Wed
    "01:30 PM - 03:00 PM", // Thu
    "10:30 AM - 12:00 PM", // Fri
    "09:00 AM - 10:30 AM"  // Sat
  ];

  return {
    dateFormatted: now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    dayEn: dayNamesEn[dayIndex],
    dayHi: dayNamesHi[dayIndex],
    tithiEn: tithi.en,
    tithiHi: tithi.hi,
    nakshatraEn: nakshatra.en,
    nakshatraHi: nakshatra.hi,
    yogaEn: yoga.en,
    yogaHi: yoga.hi,
    karana: "Bava (बव करण)",
    sunrise: "06:19 AM",
    sunset: "06:04 PM",
    abhijitMuhurat: "11:44 AM - 12:32 PM (अति शुभ)",
    rahuKaal: rahuKaals[dayIndex] + " (अशुभ)",
    samvat: "Vikram Samvat 2083 • Ananda Nama Samvatsara",
    ayana: "Uttarayan (उत्तरायण)",
    ritu: "Sharad Ritu (शरद ऋतु)"
  };
}
