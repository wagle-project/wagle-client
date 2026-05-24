"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import type { BoothInfo } from "../../types/booth";

interface BoothPopupProps {
  booth: BoothInfo & { menuImages?: string[] }; // menuImages 타입 추가
  onClose: () => void;
}

export default function BoothPopup({ booth, onClose }: BoothPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const map = useMap();

  // JSON 데이터에서 제공하는 실제 메뉴 이미지 배열을 바로 사용 (없으면 빈 배열)
  const menuImages = booth.menuImages || [];

  // ── 사진 슬라이더용 상태 관리 ──
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // 이전/다음 사진 보기 함수
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? menuImages.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= menuImages.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
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
        zIndex: 3000,
      }}
    >
      {/* 반투명 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.45)",
          pointerEvents: "auto",
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
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 20,
            background: "transparent",
            border: "none",
            color: "#E270CA",
            fontSize: "22px",
            cursor: "pointer",
            padding: "8px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* WAGLEWAGLE 로고 */}
        <div style={{ marginBottom: "12px" }}>
          <span className="bg-gradient-to-r from-[#ff3d71] to-[#3facee] bg-clip-text text-transparent font-bold tracking-[0.2em] text-xs uppercase">
            WagleWagle
          </span>
        </div>

        {/* 학과 이름 */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "0.5px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {booth.department}
        </div>

        {/* ── 사진 슬라이더 영역 ── */}
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              minHeight: menuImages.length > 0 ? "200px" : "auto",
            }}
          >
            {menuImages.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "13px",
                  width: "100%",
                }}
              >
                메뉴 이미지가 없습니다
              </div>
            ) : (
              <>
                {/* ── 왼쪽 넘기기 버튼 ── */}
                {menuImages.length > 1 && (
                  <button
                    onClick={goToPrevious}
                    style={{
                      position: "absolute",
                      left: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 10,
                      fontSize: "14px",
                    }}
                  >
                    ◀
                  </button>
                )}

                {/* ── 실제 이미지 ── */}
                {/* 현재 index에 해당하는 이미지만 보여주면 되므로 1장만 렌더링 */}
                <img
                  src={menuImages[currentIndex]}
                  alt={`${booth.department} 메뉴판 ${currentIndex + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "55vh",
                    objectFit: "contain",
                    display: "block",
                  }}
                />

                {/* ── 오른쪽 넘기기 버튼 ── */}
                {menuImages.length > 1 && (
                  <button
                    onClick={goToNext}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 10,
                      fontSize: "14px",
                    }}
                  >
                    ▶
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── 하단 점(Dots) 표시 ── */}
          {menuImages.length > 1 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
              {menuImages.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    background:
                      currentIndex === idx
                        ? "#E270CA"
                        : "rgba(255,255,255,0.2)",
                    transition: "background 0.2s",
                  }}
                />
              ))}
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
    map.getContainer(),
  );
}
