"use client";

import { useEffect, useRef } from "react";
import type { BoothInfo } from "../../types/booth";

interface BoothPopupProps {
  booth: BoothInfo;
  onClose: () => void;
}

export default function BoothPopup({ booth, onClose }: BoothPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 팝업 바깥 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // 이벤트를 약간 지연시켜 마커 클릭 이벤트와 충돌 방지
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  return (
    /* z-[2000] : Leaflet 기본 z-index보다 높게 */
    <div className="fixed inset-0 z-[2000] flex items-end justify-center pointer-events-none">
      {/* 반투명 오버레이 (터치 영역만) */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

      {/* 팝업 카드 */}
      <div
        ref={ref}
        className="pointer-events-auto relative w-full max-w-sm mb-8 mx-4"
        style={{
          background: "rgba(10, 11, 30, 0.97)",
          border: "1.5px solid rgba(255,255,255,0.13)",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
          overflow: "hidden",
          animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── 헤더 ── */}
        <div
          style={{
            background: "rgba(255,61,113,0.15)",
            borderBottom: "1px solid rgba(255,61,113,0.25)",
            padding: "14px 18px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* WagleWagle 로고 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              WAGLEWAGLE
            </span>
            <span
              style={{
                fontSize: "15px",
                color: "#fff",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {booth.department}
            </span>
          </div>

          {/* 부스 번호 뱃지 */}
          <div
            style={{
              background: "#FF3D71",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 0 12px rgba(255,61,113,0.5)",
            }}
          >
            {booth.boothNumber}
          </div>
        </div>

        {/* ── 주막 이름 ── */}
        <div
          style={{
            padding: "12px 18px 8px",
            fontSize: "18px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "0.3px",
          }}
        >
          {booth.boothName}
        </div>

        {/* ── 메뉴 이미지 ── */}
        <div style={{ padding: "0 18px 18px" }}>
          {booth.menuImageUrl ? (
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                position: "relative",
              }}
            >
              <img
                src={booth.menuImageUrl}
                alt={`${booth.boothName} 메뉴판`}
                style={{
                  width: "100%",
                  maxHeight: "320px",
                  objectFit: "cover",
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
            </div>
          ) : (
            <div
              style={{
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.15)",
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

        {/* ── 닫기 버튼 ── */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "60px", // 뱃지 왼쪽
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: "16px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
