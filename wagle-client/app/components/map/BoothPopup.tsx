"use client";

import { useEffect, useRef, useState } from "react";
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

  // 부스 번호 파악
  const boothData = booth as BoothInfo & { boothNumber?: number };
  const targetBoothNum = boothData.boothNumber;

  // ── 사진 슬라이더용 상태 관리 ──
  const [currentIndex, setCurrentIndex] = useState(0);
  // 무조건 1~10번까지 시도한 뒤, 에러(없는 파일)가 나면 배열에서 제외합니다.
  const [validNums, setValidNums] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // 에러 발생으로 배열 길이가 줄어들 때 currentIndex가 범위를 벗어나지 않도록 방어
  const safeIndex = currentIndex >= validNums.length ? Math.max(0, validNums.length - 1) : currentIndex;

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
    setCurrentIndex((prev) => (prev === 0 ? validNums.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= validNums.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    <div 
      style={{ 
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", padding: "16px", zIndex: 3000 
      }}
    >
      {/* 반투명 오버레이 */}
      <div 
        style={{ 
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0, 0, 0, 0.45)", pointerEvents: "auto"
        }}
        onClick={onClose} 
      />

      {/* 팝업 카드 */}
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
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px", zIndex: 20,
            background: "transparent", border: "none", color: "#E270CA",
            fontSize: "22px", cursor: "pointer", padding: "8px", lineHeight: 1,
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
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "0.5px", marginBottom: "20px", textAlign: "center" }}>
          {booth.department}
        </div>

        {/* ── 사진 슬라이더 영역 ── */}
        <div style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <div 
            style={{ 
              width: "100%", borderRadius: "12px", overflow: "hidden",
              background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "center", position: "relative",
              minHeight: validNums.length > 0 ? "200px" : "auto" // 이미지가 로딩되는 동안 영역 유지
            }}
          >
            {targetBoothNum === undefined || validNums.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px", width: "100%" }}>
                메뉴 이미지가 없습니다
              </div>
            ) : (
              <>
                {/* ── 왼쪽 넘기기 버튼 ── */}
                {validNums.length > 1 && (
                  <button
                    onClick={goToPrevious}
                    style={{
                      position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%",
                      width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", zIndex: 10, fontSize: "14px"
                    }}
                  >
                    ◀
                  </button>
                )}

                {/* ── 실제 이미지들 ── */}
                {/* 10장을 모두 렌더링하되, 없는 파일은 알아서 걸러내고 현재 인덱스만 화면에 보임 */}
                {validNums.map((num, idx) => (
                  <img
                    key={num}
                    src={`/images/bar/${targetBoothNum}-${num}.webp`}
                    alt={`${booth.department} 메뉴판 ${num}`}
                    style={{
                      width: "100%",
                      maxHeight: "55vh",
                      objectFit: "contain",
                      display: idx === safeIndex ? "block" : "none", // 현재 선택된 사진만 보이기
                    }}
                    onError={() => {
                      // 파일이 없으면 배열에서 해당 번호를 삭제 -> 점(Dot) 개수도 자동으로 줄어듦
                      setValidNums((prev) => prev.filter((n) => n !== num));
                    }}
                  />
                ))}

                {/* ── 오른쪽 넘기기 버튼 ── */}
                {validNums.length > 1 && (
                  <button
                    onClick={goToNext}
                    style={{
                      position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%",
                      width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", zIndex: 10, fontSize: "14px"
                    }}
                  >
                    ▶
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── 하단 점(Dots) 표시 ── */}
          {validNums.length > 1 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
              {validNums.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  style={{ 
                    width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer",
                    background: safeIndex === idx ? "#E270CA" : "rgba(255,255,255,0.2)",
                    transition: "background 0.2s"
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
    map.getContainer()
  );
}
