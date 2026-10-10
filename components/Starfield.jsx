"use client";
import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Use a lightweight pre-allocated array of stars (65 stars only)
    const starCount = Math.min(65, Math.floor(width / 20));
    const stars = new Array(starCount);

    for (let i = 0; i < starCount; i++) {
      stars[i] = {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.4,
        speed: 0.15 + Math.random() * 0.25,
        alpha: 0.2 + Math.random() * 0.7,
        alphaDir: Math.random() > 0.5 ? 0.008 : -0.008
      };
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];

        // Smooth twinkle update
        s.alpha += s.alphaDir;
        if (s.alpha > 0.95) {
          s.alpha = 0.95;
          s.alphaDir = -s.alphaDir;
        } else if (s.alpha < 0.2) {
          s.alpha = 0.2;
          s.alphaDir = -s.alphaDir;
        }

        // Slow upward drift
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(217, 119, 6, ${s.alpha * 0.45})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" style={{ willChange: "transform" }} />;
}
