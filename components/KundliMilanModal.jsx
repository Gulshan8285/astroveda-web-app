"use client";
import { useState } from "react";
import { RASHIS, calculateKundliMilan } from "../src/astrology-engine.js";

export default function KundliMilanModal({ isOpen, onClose, onRequirePaywall, isUnlocked = false, lang = "hinglish" }) {
  const [boyRashi, setBoyRashi] = useState(1);
  const [girlRashi, setGirlRashi] = useState(5);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCalculate = () => {
    const res = calculateKundliMilan(boyRashi, girlRashi);
    setResult(res);
  };

  const isHinglish = lang === "hinglish";
  const isHi = lang === "hi";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog-box" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3>💍 {isHinglish ? "36 Gun Milan (Matchmaking)" : isHi ? "36 गुण मिलान" : "36 Gun Milan (Matchmaking)"}</h3>
          <button className="btn-modal-x" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-content">
          <p style={{ fontSize: "0.86rem", color: "#52525B", marginBottom: "16px" }}>
            {isHinglish
              ? "Ladka aur Ladki ki Rashi select karein aur marriage compatibility check karein:"
              : isHi
              ? "वर और कन्या की राशि चुनकर विवाह अनुकूलता जांचें:"
              : "Select Boy and Girl Moon signs to compute marriage compatibility:"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--gold-500)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                👦 {isHinglish ? "Boy's Rashi" : isHi ? "वर की राशि" : "Boy's Moon Sign"}
              </label>
              <select
                value={boyRashi}
                onChange={(e) => setBoyRashi(parseInt(e.target.value, 10))}
                style={{ width: "100%", background: "#FAF7F2", border: "1px solid var(--border-gold)", color: "#18181B", padding: "10px", borderRadius: "8px" }}
              >
                {RASHIS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.symbol} {isHi ? r.hi : r.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--gold-500)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                👧 {isHinglish ? "Girl's Rashi" : isHi ? "कन्या की राशि" : "Girl's Moon Sign"}
              </label>
              <select
                value={girlRashi}
                onChange={(e) => setGirlRashi(parseInt(e.target.value, 10))}
                style={{ width: "100%", background: "#FAF7F2", border: "1px solid var(--border-gold)", color: "#18181B", padding: "10px", borderRadius: "8px" }}
              >
                {RASHIS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.symbol} {isHi ? r.hi : r.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="btn-grand-chat-now"
            style={{ padding: "12px", fontSize: "0.95rem" }}
            onClick={handleCalculate}
          >
            {isHinglish ? "Check Gun Milan Result ⚡" : isHi ? "गुण मिलान परिणाम देखें ⚡" : "Calculate Compatibility ⚡"}
          </button>

          {result && (
            <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", borderRadius: "12px", padding: "16px", marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "#71717A", fontSize: "0.9rem" }}>Total Gunas Matched:</span>
                <strong style={{ fontSize: "1.8rem", color: "var(--gold-500)", fontFamily: "var(--font-serif)" }}>
                  {result.score} / 36
                </strong>
              </div>

              {!isUnlocked ? (
                /* Locked Teaser for detailed Dosha & Marriage remedies */
                <div style={{ marginTop: "12px", textAlign: "center" }}>
                  <div style={{ filter: "blur(3px)", opacity: 0.5, fontSize: "0.8rem", color: "#71717A" }}>
                    [Nadi Dosha Status: Locked | Bhakoot Harmony: Locked | Upay: Locked]
                  </div>
                  <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px dashed var(--gold-500)", borderRadius: "10px", padding: "12px", margin: "10px 0" }}>
                    <span style={{ fontSize: "0.82rem", color: "#18181B", fontWeight: 700 }}>
                      🔒 Nadi Dosha, Manglik Check & Marriage Remedies are Locked
                    </span>
                  </div>
                  <button
                    className="btn-grand-chat-now"
                    style={{ padding: "10px", fontSize: "0.88rem" }}
                    onClick={() => onRequirePaywall(result)}
                  >
                    ⚡ Pay ₹1 & Activate 1-Day Full Access
                  </button>
                </div>
              ) : (
                /* Unlocked Full Kootas Breakdown */
                <div>
                  <div style={{ margin: "12px 0", color: "#047857", fontWeight: 700, fontSize: "0.95rem" }}>
                    {isHi ? result.verdictHi : isHinglish ? "Achha Milan Hai • Daampatya Jeevan Shubh Rahega" : result.verdictEn}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", fontSize: "0.74rem" }}>
                    {result.kootas.map((k, i) => (
                      <div key={i} style={{ background: "#FFFFFF", border: "1px solid var(--border-gold)", padding: "6px", borderRadius: "6px", textAlign: "center" }}>
                        <span style={{ color: "#71717A", display: "block" }}>{k.name.split(" ")[0]}</span>
                        <strong style={{ color: "#18181B" }}>{k.score}/{k.max}</strong>
                      </div>
                    ))}
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
