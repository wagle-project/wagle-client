"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";

import CongestionLayer from "./CongestionLayer";
import MyLocationMarker from "./MyLocationMarker"; // C 담당
import { useLocation } from "../../hooks/useLocation"; // C 담당
import type { FestivalMapInfo } from "../../types/festival";

// Leaflet 마커 아이콘 깨짐 방지 (Next.js 필수 설정)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// bounds에 지도 고정 (지도 전환 시마다 호출)
function FixedMap({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

// ✅ 부모로부터 받을 Props 타입 정의
interface FestivalMapProps {
  festivalId: number;
  showTraffic: boolean;
}

// ✅ 컴포넌트 인자에 showTraffic 추가 및 타입 적용
export default function FestivalMap({ festivalId, showTraffic }: FestivalMapProps) {
  const [maps, setMaps] = useState<FestivalMapInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 기존에 있던 로컬 상태(useState)는 삭제됨 (부모에서 제어하므로)

  // C 담당: 위치 훅 연결
  const { position, permissionState, isSharing, startSharing, stopSharing } =
    useLocation();

  //A : 축제 지도 정보 불러오기
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      console.warn("로그인이 필요합니다. (토큰 없음)");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    fetch(`${baseUrl}/festivals/${festivalId}/maps`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) {
          setMaps(data.result.content);
        } else {
          console.error("지도 목록 API 실패:", data.message);
        }
      })
      .catch((err) => console.error("지도 목록 fetch 실패:", err));
  }, [festivalId]);

  // C 담당: 지도 로드 완료 후 위치 공유 자동 시작
  useEffect(() => {
    if (maps.length > 0 && !isSharing) {
      startSharing(festivalId);
    }
    return () => {
      stopSharing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps.length]);

  const currentMap = maps[currentIndex];

  const bounds = useMemo<[[number, number], [number, number]]>(() => {
    if (!currentMap)
      return [
        [0, 0],
        [0, 0],
      ];
    return [
      [currentMap.bounds.southWest.lat, currentMap.bounds.southWest.lng],
      [currentMap.bounds.northEast.lat, currentMap.bounds.northEast.lng],
    ];
  }, [currentMap]);

  if (maps.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0b1e]">
        <p className="text-white/40 text-sm tracking-widest animate-pulse">
          지도 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* ── 지도 복수 개일 때: 좌우 화살표 ──────────────── */}
      {maps.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[1000] w-9 h-9 rounded-full bg-[#0f111a]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
            aria-label="이전 지도"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(maps.length - 1, i + 1))
            }
            disabled={currentIndex === maps.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[1000] w-9 h-9 rounded-full bg-[#0f111a]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
            aria-label="다음 지도"
          >
            ›
          </button>
          {/* 페이지 인디케이터 */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[1000] flex gap-[6px]">
            {maps.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-[6px] h-[6px] rounded-full cursor-pointer transition-all duration-200 ${
                  i === currentIndex ? "bg-[#2bbdee] w-4" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* ── C: 위치 권한 거부 배너 ───────────────────────── */}
      {permissionState === "denied" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-[#F43F5E]/90 backdrop-blur-md rounded-[10px] px-4 py-2">
          <p className="text-white text-xs font-medium text-center">
            위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.
          </p>
        </div>
      )}

      {/* ── Leaflet MapContainer ──────────────────────────── */}
      <MapContainer
        center={[
          (bounds[0][0] + bounds[1][0]) / 2,
          (bounds[0][1] + bounds[1][1]) / 2,
        ]}
        zoom={16}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <FixedMap bounds={bounds} />

        {/* 축제 지도 이미지 오버레이 */}
        <ImageOverlay
          url={currentMap.mapImageUrl}
          bounds={bounds}
          opacity={1}
        />

        {/* B: 혼잡도 레이어 */}
        {showTraffic && <CongestionLayer mapId={currentMap.mapId} />}

        {/* C: 내 위치 마커 */}
        <MyLocationMarker position={position} followOnce />
      </MapContainer>
    </div>
  );
}