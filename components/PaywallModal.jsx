"use client";
import { useState } from "react";

export default function PaywallModal({
  isOpen,
  onClose,
  user,
  onOpenGoogleLogin,
  onPaymentSuccess,
  calculatedSummary = null,
  lang = "hinglish"
}) {
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1100);
  };

  const isHinglish = lang === "hinglish";
  const isHi = lang === "hi";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: "490px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.3rem" }}>🔒</span>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#18181B" }}>
                {isHinglish
                  ? "Kundli & Live Chat Unlock Karein"
                  : isHi
                  ? "संपूर्ण कुंडली एवं चैट अनलॉक करें"
                  : "Unlock Complete Kundli & Live Chat"}
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--gold-500)", fontWeight: 700 }}>
                {isHinglish
                  ? "Calculation Complete • Final Stage"
                  : isHi
                  ? "गणना पूर्ण • अंतिम चरण"
                  : "Calculation Complete • Final Stage"}
              </span>
            </div>
          </div>
          <button className="btn-modal-x" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-content">
          {/* Blurred Teaser Preview */}
          <div
            style={{
              position: "relative",
              background: "#FAF7F2",
              border: "1px dashed var(--gold-500)",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "16px",
              overflow: "hidden"
            }}
          >
            <div style={{ filter: "blur(4px)", opacity: 0.6, pointerEvents: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#71717A" }}>
                <span>Lagna: Leo (Simha)</span>
                <span>Rashi: Moon in Rohini</span>
                <span>Dasha: Jupiter-Saturn</span>
              </div>
              <div style={{ height: "70px", background: "rgba(245, 158, 11, 0.12)", borderRadius: "8px", margin: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-500)", fontWeight: 700 }}>
                [Secret Career & Marriage Predictions]
              </div>
            </div>

            {/* Glowing Padlock Overlay */}
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
                background: "rgba(250, 247, 242, 0.78)",
                gap: "4px"
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "var(--gold-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  color: "#18181B",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.45)"
                }}
              >
                🔒
              </div>
              <span style={{ fontSize: "0.8rem", color: "#18181B", fontWeight: 700 }}>
                {isHinglish ? "Report Ready Hai • Locked" : isHi ? "रिपोर्ट तैयार है • लॉक" : "Report Ready • Locked"}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)",
              border: "1px solid var(--border-gold)",
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "18px"
            }}
          >
            <div>
              <span style={{ fontSize: "0.74rem", color: "#71717A", textTransform: "uppercase", fontWeight: 600 }}>
                {isHinglish ? "1-Day All-Access Trial" : isHi ? "1 दिन का संपूर्ण ट्रायल" : "1-Day All-Access Trial"}
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <strong style={{ fontSize: "2rem", color: "var(--gold-500)", fontFamily: "var(--font-serif)" }}>₹1</strong>
                <span style={{ fontSize: "0.85rem", color: "#71717A", textDecoration: "line-through" }}>₹199</span>
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "0.7rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                  99% OFF
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#047857", fontWeight: 700 }}>
              ✓ Full Kundli Chart<br />
              ✓ 1-Day Unlimited Chat
            </div>
          </div>

          {/* If NOT Logged In: Prompt Google Login First */}
          {!user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ fontSize: "0.82rem", color: "#52525B", textAlign: "center" }}>
                {isHinglish
                  ? "Apna report dekhne ke liye pehle Google se login karein:"
                  : isHi
                  ? "अपनी रिपोर्ट देखने हेतु पहले Google से लॉगिन करें:"
                  : "Please sign in with Google to continue:"}
              </p>
              <button
                className="btn-google-prominent"
                onClick={onOpenGoogleLogin}
              >
                <svg className="google-icon-svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login with Google</span>
              </button>
            </div>
          ) : (
            /* If Logged In: Show Instant ₹1 UPI / Card Payment */
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--gold-500)", fontWeight: 700 }}>
                {isHinglish ? "Select Payment Method:" : isHi ? "भुगतान का माध्यम चुनें:" : "Select Payment Method:"}
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedUpi("gpay")}
                  style={{
                    background: selectedUpi === "gpay" ? "rgba(245, 158, 11, 0.18)" : "#FAF7F2",
                    border: selectedUpi === "gpay" ? "1.5px solid var(--gold-500)" : "1px solid var(--border-gold)",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "#18181B",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>🔵</span>
                  <span>Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUpi("phonepe")}
                  style={{
                    background: selectedUpi === "phonepe" ? "rgba(245, 158, 11, 0.18)" : "#FAF7F2",
                    border: selectedUpi === "phonepe" ? "1.5px solid var(--gold-500)" : "1px solid var(--border-gold)",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "#18181B",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>🟣</span>
                  <span>PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUpi("paytm")}
                  style={{
                    background: selectedUpi === "paytm" ? "rgba(245, 158, 11, 0.18)" : "#FAF7F2",
                    border: selectedUpi === "paytm" ? "1.5px solid var(--gold-500)" : "1px solid var(--border-gold)",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "#18181B",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>🔷</span>
                  <span>Paytm / UPI</span>
                </button>
              </div>

              <button
                className="btn-grand-chat-now"
                onClick={handlePayClick}
                disabled={isProcessing}
                style={{ padding: "14px", fontSize: "1rem" }}
              >
                {isProcessing
                  ? (isHinglish ? "Authorizing ₹1 Payment..." : "Processing...")
                  : (isHinglish ? "⚡ Pay ₹1 & Activate 1-Day Full Access" : isHi ? "⚡ मात्र ₹1 दें और 1 दिन का संपूर्ण ट्रायल शुरू करें" : "⚡ Pay ₹1 & Activate 1-Day Full Access")}
              </button>

              <div style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8" }}>
                🔒 256-Bit Bank Grade SSL Encryption • 100% Money Back Guarantee
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
