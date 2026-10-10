"use client";
import { useState } from "react";
import { calculateVedicChart, renderNorthIndianKundliSVG } from "../src/astrology-engine.js";
import BirthDetailsSelector from "./BirthDetailsSelector";

export default function KundliModal({ isOpen, onClose, onRequirePaywall, isUnlocked = false, lang = "hinglish" }) {
  const [chart, setChart] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!isOpen) return null;

  const handleConfirmBirthDetails = ({ dob, tob, pob }) => {
    const res = calculateVedicChart(dob, tob, pob);
    setChart(res);
    setIsCalculated(true);

    if (!isUnlocked) {
      if (onRequirePaywall) onRequirePaywall(res);
    }
  };

  const isHinglish = lang === "hinglish";
  const isHi = lang === "hi";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog-box" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>📜 {isHinglish ? "Janam Kundli Generator" : isHi ? "जन्म कुंडली जनरेटर" : "Janam Kundli Generator"}</h3>
          <button className="btn-modal-x" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-content">
          {!isCalculated ? (
            <div>
              <p style={{ fontSize: "0.86rem", color: "#52525B", marginBottom: "14px" }}>
                {isHinglish
                  ? "Apni birth details select karein taaki accurate Lagna Kundli generate ho sake:"
                  : isHi
                  ? "सटीक जन्म कुंडली हेतु अपनी जन्म जानकारी चुनें:"
                  : "Enter your birth details for accurate Vedic Kundli calculation:"}
              </p>
              <BirthDetailsSelector onConfirm={handleConfirmBirthDetails} lang={lang} />
            </div>
          ) : (
            <div>
              {/* If Not Unlocked: Show Blurred Lock at Final Stage */}
              {!isUnlocked ? (
                <div style={{ textAlign: "center", position: "relative", padding: "10px" }}>
                  <div style={{ filter: "blur(5px)", opacity: 0.5, pointerEvents: "none" }}>
                    {chart && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderNorthIndianKundliSVG(chart, 280, 280)
                        }}
                      />
                    )}
                  </div>

                  {/* Lock Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(250, 247, 242, 0.85)",
                      borderRadius: "14px",
                      padding: "20px"
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "var(--gold-gradient)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        color: "#18181B",
                        boxShadow: "0 0 20px rgba(245, 158, 11, 0.45)",
                        marginBottom: "10px"
                      }}
                    >
                      🔒
                    </div>
                    <h4 style={{ color: "#18181B", fontSize: "1.15rem", marginBottom: "6px" }}>
                      {isHinglish ? "Lagna Kundli Chart Locked" : "कुंडली चार्ट लॉक है"}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "#52525B", maxWidth: "340px", marginBottom: "16px" }}>
                      {isHinglish
                        ? "Aapka 12-house Vedic chart aur 1-Day live astrologer consultation unlock karne ke liye sirf ₹1 pay karein:"
                        : "संपूर्ण 12 भाव चक्र व 1 दिन का लाइव परामर्श अनलॉक करने हेतु मात्र ₹1 का भुगतान करें:"}
                    </p>
                    <button
                      className="btn-grand-chat-now"
                      style={{ padding: "12px 24px", fontSize: "0.95rem" }}
                      onClick={() => onRequirePaywall(chart)}
                    >
                      ⚡ Pay ₹1 & Activate 1-Day Full Access
                    </button>
                  </div>
                </div>
              ) : (
                /* When Unlocked */
                <div>
                  <div style={{ textAlign: "center", color: "var(--gold-500)", fontWeight: 700, marginBottom: "10px" }}>
                    ✦ Unlocked North Indian Lagna Kundli ✦
                  </div>
                  {chart && (
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      dangerouslySetInnerHTML={{
                        __html: renderNorthIndianKundliSVG(chart, 300, 300)
                      }}
                    />
                  )}
                  <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "0.78rem" }}>
                    <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                      <span style={{ color: "#71717A" }}>Lagna</span>
                      <strong style={{ color: "#18181B", display: "block" }}>{chart?.lagnaRashi.en}</strong>
                    </div>
                    <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                      <span style={{ color: "#71717A" }}>Rashi</span>
                      <strong style={{ color: "#18181B", display: "block" }}>{chart?.moonRashi.en}</strong>
                    </div>
                    <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                      <span style={{ color: "#71717A" }}>Gemstone</span>
                      <strong style={{ color: "var(--gold-500)", display: "block" }}>{chart?.luckyGemstone.nameEn}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
