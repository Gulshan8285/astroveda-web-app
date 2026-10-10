"use client";
import { useState } from "react";
import { RASHIS } from "../src/astrology-engine.js";

export default function HoroscopeSection({ t, lang = "hinglish" }) {
  const [selectedRashi, setSelectedRashi] = useState(1);

  const isHi = lang === "hi";
  const isEn = lang === "en";

  const predictions = {
    1: {
      en: { career: "Mars energizes your professional house today. Take bold initiatives in meetings, success is indicated.", love: "Warm harmony with partner. Single Aries may meet someone interesting." },
      hi: { career: "मंगल देव आपके दशम भाव को ऊर्जा दे रहे हैं। कार्यक्षेत्र में साहस से लिए गए फैसले बहुत लाभकारी सिद्ध होंगे।", love: "दांपत्य जीवन में मधुरता रहेगी। अविवाहित जातकों के लिए नए संबंध की सुंदर शुरुआत।" },
      hinglish: { career: "Mars aapke career house me powerful hai. New job ya business proposal me bold decision lein, success milegi.", love: "Partner ke sath understanding badhegi. Shaam ko achha samay bitayein." }
    },
    2: {
      en: { career: "Venus bestows financial clarity. Good day to plan long-term investments and clear pending receivables.", love: "Express gratitude to your loved ones. Deep emotional bonding brings tranquility." },
      hi: { career: "शुक्र देव की कृपा से आर्थिक स्थिति सुदृढ़ होगी। पुराने निवेश से अप्रत्याशित लाभ होने के संकेत हैं।", love: "जीवनसाथी का पूरा सहयोग मिलेगा। आपसी बातचीत से पुरानी उलझनें समाप्त होंगी।" },
      hinglish: { career: "Venus ki kripa se wealth aur investment me stability aayegi. Ruka hua paisa milne ke chances hain.", love: "Ghar me shanti aur khushi ka mahol rahega." }
    },
    3: {
      en: { career: "Mercury sharpens your communication. Ideal day for presentations, pitching, and creative writing.", love: "Lighthearted banter keeps sparks alive. Plan a pleasant evening outing." },
      hi: { career: "बुध देव आपकी संवाद कला को निखार रहे हैं। व्यावसायिक बैठकों और साक्षात्कारों में बड़ी सफलता मिलेगी।", love: "प्रेम संबंधों में नया उत्साह रहेगा। शाम को परिवार के साथ आनंददायक समय बीतेगा।" },
      hinglish: { career: "Mercury aapki communication ko boost kar raha hai. Client meetings aur interviews me badiya result milega.", love: "Lighthearted talks se relationship me sweetness aayegi." }
    },
    4: {
      en: { career: "The Moon promotes intuitive decision-making. Trust your inner compass when handling workplace dilemmas.", love: "Domestic bliss and cozy family moments rejuvenate your heart." },
      hi: { career: "चंद्रमा का शुभ प्रभाव आपके मन को शांत रखेगा। महत्वपूर्ण निर्णयों में आपका अंतर्ज्ञान सही साबित होगा।", love: "घर-परिवार में मांगलिक वातावरण रहेगा। परिजनों से भरपूर स्नेह और आशीर्वाद प्राप्त होगा।" },
      hinglish: { career: "Moon intuition aur clarity badha raha hai. Important career decisions me dil ki sunein.", love: "Family aur partner ka poora support milega." }
    },
    5: {
      en: { career: "Sun grants royal confidence. You will naturally inspire team members and receive praise from seniors.", love: "Your charisma shines brightly today. Passion and loyalty strengthen your relationship." },
      hi: { career: "सूर्य देव की कृपा से आपका मान-सम्मान बढ़ेगा। उच्च अधिकारियों से सराहना मिलने का प्रबल योग है।", love: "आपका आकर्षण सबको प्रभावित करेगा। पार्टनर के साथ यादगार समय व्यतीत होगा।" },
      hinglish: { career: "Sun royal confidence de raha hai. Seniors se appreciation aur new responsibilities milengi.", love: "Romantic mood rahega. Partner ke sath bond strong hoga." }
    },
    6: {
      en: { career: "Mercury awards meticulous focus. Organizing paperwork and finishing pending projects proceeds effortlessly.", love: "Listen attentively to your partner. Small gestures of care mean the world today." },
      hi: { career: "कार्यों में बारीकी और एकाग्रता से लाभ मिलेगा। रुके हुए सरकारी या तकनीकी कार्य आसानी से पूरे होंगे।", love: "जीवनसाथी की भावनाओं का सम्मान करें। प्रेम में समझदारी और धैर्य से रिश्ते प्रगाढ़ होंगे।" },
      hinglish: { career: "Focus aur hard work se complex pending tasks complete honge. Financial planning achhi rahegi.", love: "Partner ki choti-choti baaton ka khayal rakhein." }
    },
    7: {
      en: { career: "Venus balances workplace diplomacy. Partnerships and collaborative ventures yield excellent fruit.", love: "Romance is in the air. A thoughtful surprise or dinner date creates magical memories." },
      hi: { career: "साझेदारी और संयुक्त व्यापार में लाभ होगा। कानूनी मामलों में आपके पक्ष में फैसला आने के योग हैं।", love: "दांपत्य जीवन में प्रेम की नई लहर आएगी। प्रियजन के साथ सुखद यात्रा की योजना बनेगी।" },
      hinglish: { career: "Partnerships aur joint business me profitable deals finalize ho sakti hain.", love: "Love life me new spark aayega. Romantic date plan karein." }
    },
    8: {
      en: { career: "Mars sparks relentless determination. You overcome competition and crack complex challenges with ease.", love: "Deep passionate conversations reveal heartfelt truths. Trust your partner completely." },
      hi: { career: "विरोधी परास्त होंगे और आपके साहस से नए रास्ते खुलेंगे। गुप्त धन या आकस्मिक लाभ संभव है।", love: "प्रेम में प्रगाढ़ता और विश्वास बढ़ेगा। मन की बात साझा करने के लिए आज का दिन श्रेष्ठ है।" },
      hinglish: { career: "Courage aur determination se challenges overcome honge. Unexpected gains possible hain.", love: "Deep conversation se trust badhega." }
    },
    9: {
      en: { career: "Jupiter expands your horizon. Favorable day for education, publishing, and mentoring others.", love: "Shared spiritual or philosophical interests strengthen your mutual bond." },
      hi: { career: "बृहस्पति देव की शुभ दृष्टि से ज्ञान और भाग्य में वृद्धि होगी। उच्च शिक्षा व सलाहकारी कार्यों में सफलता।", love: "साथी के साथ धार्मिक या दार्शनिक विषयों पर सुखद चर्चा होगी। मन प्रसन्न रहेगा।" },
      hinglish: { career: "Jupiter ki blessing se luck aur knowledge me growth hogi. Mentorship me success.", love: "Spiritual discussion se relationship spiritual level par deepen hoga." }
    },
    10: {
      en: { career: "Saturn rewards discipline and consistency. A long-pending milestone is within your grasp today.", love: "Steadfast loyalty and practical care provide immense comfort to your soulmate." },
      hi: { career: "शनि देव आपके अथक परिश्रम का फल देंगे। करियर में स्थायित्व और नई जिम्मेदारी मिलने के योग हैं।", love: "पारिवारिक जिम्मेदारियों को निभाने में जीवनसाथी का अमूल्य सहयोग मिलेगा।" },
      hinglish: { career: "Saturn consistency aur hard work ka reward de raha hai. Long-term goals achieve honge.", love: "Partner ka support aapko mental peace dega." }
    },
    11: {
      en: { career: "Saturn fosters visionary ideas. Networking with progressive minds opens unexpected doors of revenue.", love: "Unconditional friendship is the anchor of your love life today. Cherish shared freedom." },
      hi: { career: "नवीन विचारों और तकनीक के प्रयोग से बड़ा धन लाभ होगा। सामाजिक संपर्कों से लाभ मिलेगा।", love: "रिश्ते में मित्रता और सम्मान का भाव बना रहेगा। मित्रों से शुभ समाचार मिलेगा।" },
      hinglish: { career: "Innovative ideas aur networking se business revenue me jump aayega.", love: "Dosti aur mutual respect relation ko mazboot karegi." }
    },
    12: {
      en: { career: "Jupiter amplifies compassionate leadership. Creative and spiritual work flows with divine grace.", love: "Soulful empathy deepens emotional connection. Forgiveness heals old wounds effortlessly." },
      hi: { career: "रचनात्मक और आध्यात्मिक कार्यों में भारी यश मिलेगा। दूसरों की सहायता करने से पुण्य और लाभ दोनों मिलेंगे।", love: "हृदय में करुणा और प्रेम का भाव रहेगा। साथी के साथ आत्मिक जुड़ाव महसूस होगा।" },
      hinglish: { career: "Creative aur advisory roles me high recognition milegi. Calm mind se kaam karein.", love: "Soulful connection aur harmony feel hogi." }
    }
  };

  const curr = RASHIS.find((r) => r.id === selectedRashi) || RASHIS[0];
  const predLang = predictions[selectedRashi]?.[lang] || predictions[selectedRashi]?.hinglish || predictions[1].hinglish;
  const signDisplayName = isHi ? curr.hi : curr.en;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--gold-500)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          Daily Destiny Insights
        </span>
        <h3 style={{ fontSize: "1.85rem", marginTop: "4px", color: "#18181B" }}>{t.horoscopeTitle}</h3>
        <p style={{ color: "#71717A", fontSize: "0.92rem" }}>
          {t.horoscopeSub}
        </p>
      </div>

      {/* Rashis Bar */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "18px" }}>
        {RASHIS.map((r) => {
          const name = isHi ? r.hi : isEn ? r.en : `${r.en} (${r.hi})`;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRashi(r.id)}
              style={{
                background: selectedRashi === r.id ? "#FEF3C7" : "#FAF7F2",
                border: selectedRashi === r.id ? "1.5px solid var(--gold-500)" : "1px solid var(--border-gold)",
                color: selectedRashi === r.id ? "#92400E" : "#52525B",
                padding: "8px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: "0.85rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "7px",
                transition: "var(--transition)"
              }}
            >
              <span>{r.symbol}</span>
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* Prediction Box */}
      <div style={{ background: "#FFFFFF", border: "1px solid var(--border-gold)", borderRadius: "var(--radius-lg)", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", boxShadow: "var(--shadow-card)" }}>
        <div>
          <h4 style={{ color: "var(--gold-500)", fontSize: "1.05rem", marginBottom: "8px" }}>
            💼 {signDisplayName} - {t.careerSectionTitle}
          </h4>
          <p style={{ color: "#44403C", fontSize: "0.9rem", lineHeight: 1.6 }}>{predLang.career}</p>
          <div style={{ marginTop: "12px", fontSize: "0.78rem", color: "#71717A" }}>
            {t.rulingLord}: <strong style={{ color: "#18181B" }}>{curr.lord}</strong> | {t.elementLbl}: <strong style={{ color: "#18181B" }}>{curr.element}</strong>
          </div>
        </div>

        <div>
          <h4 style={{ color: "var(--gold-500)", fontSize: "1.05rem", marginBottom: "8px" }}>
            ❤️ {t.loveSectionTitle}
          </h4>
          <p style={{ color: "#44403C", fontSize: "0.9rem", lineHeight: 1.6 }}>{predLang.love}</p>
          <div style={{ marginTop: "12px", fontSize: "0.78rem", color: "#71717A" }}>
            {t.luckyNumLbl}: <strong style={{ color: "var(--gold-500)" }}>{(selectedRashi * 3) % 9 + 1}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
