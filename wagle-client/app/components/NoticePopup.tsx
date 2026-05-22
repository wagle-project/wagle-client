"use client";

import { useEffect, useRef, useState } from "react";

interface NoticePopupProps {
  onClose: () => void;
  onHideToday: () => void;
}

export default function NoticePopup({ onClose, onHideToday }: NoticePopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hideForToday, setHideForToday] = useState(false);

  // 닫기 버튼이나 배경을 눌렀을 때 실행되는 함수
  const handleClose = () => {
    if (hideForToday) {
      // 체크박스가 체크되어 있으면 부모에서 넘겨준 onHideToday 실행 (로컬스토리지 저장 + 닫기)
      onHideToday();
    } else {
      // 아니면 그냥 닫기
      onClose();
    }
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
  }, [hideForToday, onClose, onHideToday]);

  return (
    <div 
      style={{ 
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", padding: "16px", zIndex: 9999 
      }}
    >
      {/* 어두운 배경 */}
      <div 
        style={{ 
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0, 0, 0, 0.45)", pointerEvents: "auto"
        }}
        onClick={handleClose} 
      />

      {/* 팝업 모달 컨테이너 */}
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
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "transparent", border: "none", color: "#E270CA",
            fontSize: "22px", cursor: "pointer", padding: "8px", lineHeight: 1, zIndex: 10
          }}
        >✕</button>

        {/* 상단 로고 */}
        <div style={{ marginBottom: "16px" }}>
          <span className="bg-gradient-to-r from-[#ff3d71] to-[#3facee] bg-clip-text text-transparent font-bold tracking-[0.2em] text-xs uppercase">
            WagleWagle
          </span>
        </div>

        {/* ── 공지 내용 영역 (사진 대신 텍스트) ── */}
        <div style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div 
            style={{ 
              width: "100%", borderRadius: "12px", overflow: "hidden",
              background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", 
              alignItems: "center", padding: "32px 24px", textAlign: "center"
            }}
          >
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
              📢 와글와글 오픈 공지
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: "1.6", wordBreak: "keep-all" }}>
              와글와글에 오신 것을 환영합니다! 🎉<br /><br />
              현재 실시간 축제 혼잡도 모니터링 기능이<br />
              정상적으로 서비스되고 있습니다.
            </p>
          </div>
        </div>

        {/* 하단 오늘 하루 보지 않기 체크박스 */}
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

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes popUp {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}