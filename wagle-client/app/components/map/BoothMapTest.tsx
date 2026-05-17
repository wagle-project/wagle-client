"use client";

/**
 * BoothMapTest.tsx
 *
 * 백엔드 API 없이 mock 데이터로 주막 마커 + 팝업을 확인하는 테스트 페이지입니다.
 * 확인 후 실제 FestivalMap에 BoothLayer를 붙이면 됩니다.
 *
 * 사용법:
 *   app/test/page.tsx 에서 import 해서 렌더링하거나,
 *   기존 페이지에서 임시로 <BoothMapTest /> 를 붙여서 확인하세요.
 */

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
// ─── 타입 ──────────────────────────────────────────────────────────────────
interface BoothInfo {
  boothNumber: number;
  boothName: string;
  department: string;
  latitude: number;
  longitude: number;
  menuImageUrl: string;
}

// ─── Mock 데이터 (실제 API 완성 전까지 사용) ───────────────────────────────
const MOCK_BOOTHS: BoothInfo[] = [
  {
    boothNumber: 1,
    boothName: "달빛 주막",
    department: "컴퓨터공학과",
    latitude: 35.834501,
    longitude: 128.753254,
    menuImageUrl: "",
  },
  {
    boothNumber: 2,
    boothName: "별빛 술상",
    department: "전자공학과",
    latitude: 35.8347,
    longitude: 128.7536,
    menuImageUrl: "",
  },
  {
    boothNumber: 3,
    boothName: "노을 막걸리",
    department: "경영학과",
    latitude: 35.8342,
    longitude: 128.7539,
    menuImageUrl: "",
  },
  {
    boothNumber: 4,
    boothName: "새벽 포장마차",
    department: "디자인학과",
    latitude: 35.8349,
    longitude: 128.7529,
    menuImageUrl: "",
  },
  {
    boothNumber: 5,
    boothName: "한강 주막",
    department: "체육학과",
    latitude: 35.83405,
    longitude: 128.7526,
    menuImageUrl: "",
  },
];

// 동그라미 숫자 (① ~ ⑳)
const CIRCLED = [
  "①",
  "②",
  "③",
  "④",
  "⑤",
  "⑥",
  "⑦",
  "⑧",
  "⑨",
  "⑩",
  "⑪",
  "⑫",
  "⑬",
  "⑭",
  "⑮",
  "⑯",
  "⑰",
  "⑱",
  "⑲",
  "⑳",
];

function circled(n: number) {
  return n >= 1 && n <= 20 ? CIRCLED[n - 1] : String(n);
}

// ─── 팝업 컴포넌트 ─────────────────────────────────────────────────────────
function BoothPopup({
  booth,
  onClose,
}: {
  booth: BoothInfo;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      100,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  return (
    // position: fixed 대신 absolute + 부모 relative 컨테이너 안에서 처리
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "24px",
        pointerEvents: "none",
      }}
    >
      {/* 반투명 딤 */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          pointerEvents: "auto",
        }}
      />

      {/* 팝업 카드 */}
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "calc(100% - 48px)",
          maxWidth: "360px",
          background: "rgba(10,11,30,0.97)",
          border: "1.5px solid rgba(255,255,255,0.13)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
          pointerEvents: "auto",
          animation: "boothSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            background: "rgba(255,61,113,0.15)",
            borderBottom: "1px solid rgba(255,61,113,0.25)",
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "10px",
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 600,
              }}
            >
              WAGLEWAGLE
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "14px",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {booth.department}
            </p>
          </div>
          {/* 부스 번호 뱃지 */}
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#FF3D71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 0 12px rgba(255,61,113,0.5)",
            }}
          >
            {booth.boothNumber}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "11px",
            right: "58px",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
            fontSize: "17px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>

        {/* 주막 이름 */}
        <p
          style={{
            margin: 0,
            padding: "12px 16px 6px",
            fontSize: "18px",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {booth.boothName}
        </p>

        {/* 메뉴 이미지 */}
        <div style={{ padding: "0 16px 16px" }}>
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              minHeight: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {booth.menuImageUrl ? (
              <img
                src={booth.menuImageUrl}
                alt={`${booth.boothName} 메뉴판`}
                style={{
                  width: "100%",
                  maxHeight: "280px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "13px",
                }}
              >
                메뉴 이미지를 준비 중입니다
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes boothSlideUp {
          from { transform: translateY(32px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── 마커 레이어 (MapContainer 내부에서 사용) ──────────────────────────────
function BoothMarkers({
  booths,
  selectedNumber,
  onSelect,
}: {
  booths: BoothInfo[];
  selectedNumber: number | null;
  onSelect: (n: number | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    booths.forEach((b) => {
      const isSelected = selectedNumber === b.boothNumber;

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            width:36px; height:36px; border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            background:${isSelected ? "#FF3D71" : "rgba(255,255,255,0.92)"};
            border:2.5px solid ${isSelected ? "#FF3D71" : "#222"};
            color:${isSelected ? "#fff" : "#111"};
            font-size:19px; font-weight:700; cursor:pointer;
            box-shadow:${
              isSelected
                ? "0 0 0 4px rgba(255,61,113,0.35), 0 4px 14px rgba(255,61,113,0.5)"
                : "0 2px 8px rgba(0,0,0,0.3)"
            };
            transition:all 0.15s; user-select:none; line-height:1;
          ">${circled(b.boothNumber)}</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([b.latitude, b.longitude], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on("click", () => {
        if (selectedNumber === b.boothNumber) {
          onSelect(null);
        } else {
          onSelect(b.boothNumber);
          map.flyTo([b.latitude, b.longitude], Math.max(map.getZoom(), 18), {
            animate: true,
            duration: 0.5,
          });
        }
      });

      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [booths, selectedNumber, onSelect, map]);

  return null;
}

// ─── 메인 테스트 페이지 ────────────────────────────────────────────────────
export default function BoothMapTest() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const center: [number, number] = [35.8344, 128.7532];
  const selectedBooth =
    MOCK_BOOTHS.find((b) => b.boothNumber === selectedNumber) ?? null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <MapContainer
        center={center}
        zoom={17}
        maxZoom={22}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <BoothMarkers
          booths={MOCK_BOOTHS}
          selectedNumber={selectedNumber}
          onSelect={setSelectedNumber}
        />
      </MapContainer>

      {/* 팝업은 MapContainer 바깥 (absolute) 에 렌더링 */}
      {selectedBooth && (
        <BoothPopup
          booth={selectedBooth}
          onClose={() => setSelectedNumber(null)}
        />
      )}
    </div>
  );
}
