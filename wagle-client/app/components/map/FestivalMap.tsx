"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";

import CongestionLayer from "./CongestionLayer";
import MyLocationMarker from "./MyLocationMarker";    // C 담당
import { useLocation } from "../../hooks/useLocation"; // C 담당
import type { FestivalMapInfo } from "../../types/festival";

// Leaflet 마커 아이콘 깨짐 방지 (Next.js 필수 설정)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// bounds에 지도 고정 (지도 전환 시마다 호출)
function FixedMap({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

export default function FestivalMap({ festivalId }: { festivalId: number }) {
  const [maps, setMaps] = useState<FestivalMapInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // C 담당: 위치 훅 연결
  const { position, permissionState, isSharing, startSharing, stopSharing } = useLocation();

  // A 담당 API: 지도 목록 불러오기
  // TODO: 백엔드 연결 후 더미 데이터 제거하고 아래 주석 해제
  useEffect(() => {
    // 임시 더미 데이터
    setMaps([
      {
        sequence: 1,
        mapId: 1,
        mapImageUrl: "https://images.unsplash.com/photo-1628191140046-13a854dc694a?q=80&w=800",
        bounds: {
          southWest: { lat: 36.110, lng: 128.095 },
          northEast: { lat: 36.120, lng: 128.110 },
        },
      },
    ]);

    // const token = localStorage.getItem("accessToken");
    // fetch(`${BASE_URL}/api/v1/festivals/${festivalId}/maps`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((r) => r.json())
    //   .then((data) => {
    //     if (data.isSuccess) setMaps(data.result.content);
    //   })
    //   .catch((err) => console.error("지도 목록 fetch 실패:", err));
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
    if (!currentMap) return [[0, 0], [0, 0]];
    return [
      [currentMap.bounds.southWest.lat, currentMap.bounds.southWest.lng],
      [currentMap.bounds.northEast.lat, currentMap.bounds.northEast.lng],
    ];
  }, [currentMap]);

  if (maps.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0b1e]">
        <p className="text-white/40 text-sm tracking-widest animate-pulse">지도 불러오는 중...</p>
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
            onClick={() => setCurrentIndex((i) => Math.min(maps.length - 1, i + 1))}
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
        <ImageOverlay url={currentMap.mapImageUrl} bounds={bounds} opacity={1} />

        {/* B: 혼잡도 레이어 (B 작업 완료 후 주석 해제) */}
        {/* <CongestionLayer mapId={currentMap.mapId} /> */}

        {/* C: 내 위치 마커 */}
        <MyLocationMarker position={position} followOnce />
      </MapContainer>
    </div>
  );
}
