"use client";
import { useState } from "react";

export default function BirthDetailsSelector({
  initialDob = "1996-05-15",
  initialTob = "08:30 AM",
  initialPob = "New Delhi",
  onConfirm,
  lang = "hinglish"
}) {
  const parts = initialDob.split("-");
  const [day, setDay] = useState(parts[2] || "15");
  const [month, setMonth] = useState(parts[1] || "05");
  const [year, setYear] = useState(parts[0] || "1996");

  const [timePeriod, setTimePeriod] = useState("AM");
  const [timeHour, setTimeHour] = useState("08");
  const [timeMin, setTimeMin] = useState("30");
  const [isApproxTime, setIsApproxTime] = useState(false);

  const [city, setCity] = useState(initialPob);

  const months = [
    { num: "01", nameEn: "Jan", nameHi: "जनवरी", nameHinglish: "Jan" },
    { num: "02", nameEn: "Feb", nameHi: "फरवरी", nameHinglish: "Feb" },
    { num: "03", nameEn: "Mar", nameHi: "मार्च", nameHinglish: "Mar" },
    { num: "04", nameEn: "Apr", nameHi: "अप्रैल", nameHinglish: "Apr" },
    { num: "05", nameEn: "May", nameHi: "मई", nameHinglish: "May" },
    { num: "06", nameEn: "Jun", nameHi: "जून", nameHinglish: "Jun" },
    { num: "07", nameEn: "Jul", nameHi: "जुलाई", nameHinglish: "Jul" },
    { num: "08", nameEn: "Aug", nameHi: "अगस्त", nameHinglish: "Aug" },
    { num: "09", nameEn: "Sep", nameHi: "सितंबर", nameHinglish: "Sep" },
    { num: "10", nameEn: "Oct", nameHi: "अक्टूबर", nameHinglish: "Oct" },
    { num: "11", nameEn: "Nov", nameHi: "नवंबर", nameHinglish: "Nov" },
    { num: "12", nameEn: "Dec", nameHi: "दिसंबर", nameHinglish: "Dec" }
  ];

  const popularCities = [
    "New Delhi",
    "Mumbai",
    "Varanasi",
    "Jaipur",
    "Lucknow",
    "Bengaluru",
    "Patna",
    "Kolkata"
  ];

  const handleApply = () => {
    const formattedDob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const formattedTob = isApproxTime
      ? "12:00 PM (Approximate)"
      : `${timeHour}:${timeMin} ${timePeriod}`;
    onConfirm({
      dob: formattedDob,
      tob: formattedTob,
      pob: city || "New Delhi"
    });
  };

  const isHinglish = lang === "hinglish";
  const isHi = lang === "hi";

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1.5px solid var(--border-gold)",
        borderRadius: "16px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "0 6px 20px rgba(180, 130, 34, 0.08)"
      }}
    >
      {/* 1. Date of Birth Section */}
      <div>
        <label
          style={{
            fontSize: "0.82rem",
            color: "var(--gold-500)",
            fontWeight: 700,
            display: "block",
            marginBottom: "8px"
          }}
        >
          📅 {isHinglish ? "Janam Ki Tarikh (Date of Birth):" : isHi ? "जन्म तिथि चुनें:" : "Date of Birth:"}
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.2fr", gap: "8px" }}>
          {/* Day */}
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{
              background: "#FAF7F2",
              border: "1px solid var(--border-gold)",
              color: "#18181B",
              padding: "10px",
              borderRadius: "10px",
              fontSize: "0.95rem"
            }}
          >
            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              background: "#FAF7F2",
              border: "1px solid var(--border-gold)",
              color: "#18181B",
              padding: "10px",
              borderRadius: "10px",
              fontSize: "0.95rem"
            }}
          >
            {months.map((m) => (
              <option key={m.num} value={m.num}>
                {isHi ? m.nameHi : m.nameHinglish}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              background: "#FAF7F2",
              border: "1px solid var(--border-gold)",
              color: "#18181B",
              padding: "10px",
              borderRadius: "10px",
              fontSize: "0.95rem"
            }}
          >
            {Array.from({ length: 65 }, (_, i) => String(2015 - i)).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Time of Birth Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{ fontSize: "0.82rem", color: "var(--gold-500)", fontWeight: 700 }}>
            ⏰ {isHinglish ? "Janam Ka Samay (Time of Birth):" : isHi ? "जन्म समय:" : "Time of Birth:"}
          </label>
          <label style={{ fontSize: "0.75rem", color: "#71717A", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isApproxTime}
              onChange={(e) => setIsApproxTime(e.target.checked)}
            />
            <span>{isHinglish ? "Pata nahi / Approx" : isHi ? "अनुमानित / पता नहीं" : "Approximate"}</span>
          </label>
        </div>

        {!isApproxTime && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            <select
              value={timeHour}
              onChange={(e) => setTimeHour(e.target.value)}
              style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", color: "#18181B", padding: "10px", borderRadius: "10px" }}
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                <option key={h} value={h}>{h} Hr</option>
              ))}
            </select>

            <select
              value={timeMin}
              onChange={(e) => setTimeMin(e.target.value)}
              style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", color: "#18181B", padding: "10px", borderRadius: "10px" }}
            >
              {["00", "15", "30", "45"].map((min) => (
                <option key={min} value={min}>{min} Min</option>
              ))}
            </select>

            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              style={{ background: "#FAF7F2", border: "1px solid var(--border-gold)", color: "#18181B", padding: "10px", borderRadius: "10px" }}
            >
              <option value="AM">AM (Morning)</option>
              <option value="PM">PM (Evening)</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. Place of Birth */}
      <div>
        <label style={{ fontSize: "0.82rem", color: "var(--gold-500)", fontWeight: 700, display: "block", marginBottom: "8px" }}>
          📍 {isHinglish ? "Janam Ka Shahar (Place of Birth):" : isHi ? "जन्म स्थान (शहर):" : "Place of Birth:"}
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. New Delhi, Mumbai, Varanasi"
          style={{
            width: "100%",
            background: "#FAF7F2",
            border: "1px solid var(--border-gold)",
            color: "#18181B",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "0.95rem"
          }}
        />

        {/* Quick city chips */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
          {popularCities.slice(0, 5).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              style={{
                background: city === c ? "rgba(245, 158, 11, 0.2)" : "#FAF7F2",
                border: "1px solid var(--border-gold)",
                color: city === c ? "#B45309" : "#52525B",
                padding: "4px 10px",
                borderRadius: "9999px",
                fontSize: "0.74rem",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        className="btn-grand-chat-now"
        onClick={handleApply}
        style={{ padding: "12px", fontSize: "0.95rem", marginTop: "4px" }}
      >
        <span>{isHinglish ? "Kundli Calculate Karein ⚡" : isHi ? "कुंडली गणना करें ⚡" : "Calculate Kundli ⚡"}</span>
      </button>
    </div>
  );
}
