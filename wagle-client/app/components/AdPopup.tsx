"use client";

import { useEffect, useRef, useState } from "react";

interface AdPopupProps {
  onClose: () => void;
  images?: string[]; // 👈 여러 장을 받기 위해 배열(Array)로 변경했습니다!
  title?: string;
}

export default function AdPopup({ onClose, images = [], title = "와글와글 공지" }: AdPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hideForToday, setHideForToday] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // 👈 현재 보고 있는 사진의 순서

  const handleClose = () => {
    if (hideForToday) {
      const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("hideWagleAdUntil", tomorrow.toString());
    }
    onClose();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [hideForToday, onClose]);

  // 이전/다음 사진 보기 함수
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      style={{ 
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", padding: "16px", zIndex: 9999 
      }}
    >
      <div 
        style={{ 
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0, 0, 0, 0.45)", pointerEvents: "auto"
        }}
        onClick={handleClose} 
      />

      <div
        ref={ref}
        style={{
          position: "relative", pointerEvents: "auto", width: "100%", maxWidth: "340px",
          display: "flex", flexDirection: "column", alignItems: "center",
          background: "#1C1C22", borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)", padding: "32px 24px 24px",
          animation: "popUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "transparent", border: "none", color: "#E270CA",
            fontSize: "22px", cursor: "pointer", padding: "8px", lineHeight: 1, zIndex: 10
          }}
        >✕</button>

        <div style={{ marginBottom: "12px" }}>
          <span className="bg-gradient-to-r from-[#ff3d71] to-[#3facee] bg-clip-text text-transparent font-bold tracking-[0.2em] text-xs uppercase">
            WagleWagle
          </span>
        </div>

        {/* ── 사진 슬라이더 영역 ── */}
        <div style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div 
            style={{ 
              width: "100%", borderRadius: "12px", overflow: "hidden",
              background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "center", position: "relative"
            }}
          >
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentIndex]}
                  alt={`공지 이미지 ${currentIndex + 1}`}
                  style={{ width: "100%", maxHeight: "55vh", objectFit: "contain", display: "block" }}
                />
                
                
              </>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                광고/공지용 이미지가 없습니다
              </div>
            )}
          </div>

          {/* 사진이 2장 이상일 때 하단 점(Dots) 표시 */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  style={{ 
                    width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer",
                    background: currentIndex === idx ? "#E270CA" : "rgba(255,255,255,0.2)",
                    transition: "background 0.2s"
                  }} 
                />
              ))}
            </div>
          )}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={hideForToday}
            onChange={(e) => setHideForToday(e.target.checked)}
            style={{ accentColor: "#E270CA", width: "16px", height: "16px", cursor: "pointer" }}
          />
          오늘 하루 보지 않기
        </label>
      </div>

      <style>{`
        @keyframes popUp {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}