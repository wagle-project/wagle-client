"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import type { BoothInfo } from "../../types/booth";

interface BoothPopupProps {
  booth: BoothInfo;
  onClose: () => void;
}

export default function BoothPopup({ booth, onClose }: BoothPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const map = useMap();

  // 팝업 바깥 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  return createPortal(
    /* 100% 정중앙 정렬을 보장하는 순수 CSS 레이아웃 컨테이너 */
    <div 
      style={{ 
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "16px",
        zIndex: 3000 
      }}
    >
      {/* 반투명 오버레이 (지도 크기만큼 꽉 채우도록 순수 CSS로 고정) */}
      <div 
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.45)",
          pointerEvents: "auto"
        }}
        onClick={onClose} 
      />

      {/* 팝업 카드 */}
      <div
        ref={ref}
        style={{
          position: "relative",
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "340px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#1C1C22",
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          padding: "32px 24px 24px",
          animation: "popUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── 닫기 버튼 ── */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "#FF3D71",
            fontSize: "22px",
            cursor: "pointer",
            padding: "8px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* ── WAGLEWAGLE 로고 ── */}
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "2.5px",
            fontWeight: 800,
            marginBottom: "12px",
            display: "flex",
          }}
        >
          <span style={{ color: "#FF3D71" }}>WAGLE</span>
          <span style={{ color: "#38BDF8" }}>WAGLE</span>
        </div>

        {/* ── 학과 이름 ── */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "0.5px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {booth.department}
        </div>

        {/* ── 메뉴 이미지 ── */}
        <div 
          style={{ 
            width: "100%", 
            borderRadius: "12px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {booth.menuImageUrl ? (
            <img
              src={booth.menuImageUrl}
              alt={`${booth.department} 메뉴판`}
              style={{
                width: "100%",
                maxHeight: "55vh",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="padding:40px;text-align:center;color:rgba(255,255,255,0.3);font-size:13px;">메뉴 이미지를 불러올 수 없습니다</div>`;
                }
              }}
            />
          ) : (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: "13px",
              }}
            >
              메뉴 이미지가 없습니다
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popUp {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>,
    map.getContainer()
  );
}
