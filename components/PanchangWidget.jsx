"use client";
import { getTodayPanchang } from "../src/panchang.js";

export default function PanchangWidget({ t, lang = "hinglish" }) {
  const p = getTodayPanchang();
  const isHi = lang === "hi";
  const isEn = lang === "en";

  const dayTitle = isHi ? p.dayHi : isEn ? p.dayEn : p.dayEn + " (" + p.dayHi.split(" ")[0] + ")";
  const tithiText = isHi ? p.tithiHi : isEn ? p.tithiEn : p.tithiEn;
  const nakshatraText = isHi ? p.nakshatraHi : isEn ? p.nakshatraEn : p.nakshatraEn;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ background: "#FFFFFF", border: "1px solid var(--border-gold)", borderRadius: "var(--radius-lg)", padding: "22px 26px", boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", color: "var(--gold-500)" }}>
              📅 {t.panchangTitle} ({dayTitle})
            </h3>
            <span style={{ fontSize: "0.8rem", color: "#71717A" }}>
              {p.dateFormatted} • {p.samvat}
            </span>
          </div>
          <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#047857", padding: "5px 12px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700 }}>
            {t.abhijitBadge}: {p.abhijitMuhurat}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", borderRadius: "10px", padding: "10px 14px" }}>
            <span style={{ fontSize: "0.7rem", color: "#71717A", textTransform: "uppercase" }}>{t.tithiLbl}</span>
            <strong style={{ display: "block", fontSize: "0.98rem", color: "#18181B", marginTop: "2px" }}>{tithiText}</strong>
          </div>

          <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", borderRadius: "10px", padding: "10px 14px" }}>
            <span style={{ fontSize: "0.7rem", color: "#71717A", textTransform: "uppercase" }}>{t.nakshatraLbl}</span>
            <strong style={{ display: "block", fontSize: "0.98rem", color: "#18181B", marginTop: "2px" }}>{nakshatraText}</strong>
          </div>

          <div style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", borderRadius: "10px", padding: "10px 14px" }}>
            <span style={{ fontSize: "0.7rem", color: "#71717A", textTransform: "uppercase" }}>{t.sunLbl}</span>
            <strong style={{ display: "block", fontSize: "0.98rem", color: "#18181B", marginTop: "2px" }}>🌅 {p.sunrise} | 🌇 {p.sunset}</strong>
          </div>

          <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: "10px", padding: "10px 14px" }}>
            <span style={{ fontSize: "0.7rem", color: "#B91C1C", textTransform: "uppercase", fontWeight: 700 }}>{t.rahuLbl}</span>
            <strong style={{ display: "block", fontSize: "0.98rem", color: "#B91C1C", marginTop: "2px" }}>⚠️ {p.rahuKaal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
