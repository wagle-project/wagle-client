"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, ImageOverlay, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import CongestionLayer from "./CongestionLayer";
import MyLocationMarker from "./MyLocationMarker";
import BoothLayer from "./BoothLayer";
import FacilityLayer from "./FacilityLayer"; // C 담당: 부대시설 레이어
import { useLocation } from "../../hooks/useLocation";
import type { FestivalMapInfo } from "../../types/festival";
import type { FacilityType } from "../../types/facility";
import { FACILITY_LABEL, FACILITY_ICON } from "../../types/facility";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/** C 담당: 모든 부대시설 타입 목록 */
const ALL_FACILITY_TYPES: FacilityType[] = [
  "TOILET",
  "ELECTRICITY",
  "WATER",
  "GENERAL_WASTE",
  "FOOD_WASTE",
];

function normalizeBounds(
  m: FestivalMapInfo,
): [[number, number], [number, number]] {
  const minLat = Math.min(m.bounds.southWest.lat, m.bounds.northEast.lat);
  const maxLat = Math.max(m.bounds.southWest.lat, m.bounds.northEast.lat);
  const minLng = Math.min(m.bounds.southWest.lng, m.bounds.northEast.lng);
  const maxLng = Math.max(m.bounds.southWest.lng, m.bounds.northEast.lng);
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

function FixedMap({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

interface FestivalMapProps {
  festivalId: number;
  showTraffic?: boolean;
}

export default function FestivalMap({
  festivalId,
  showTraffic = false,
}: FestivalMapProps) {
  const [maps, setMaps] = useState<FestivalMapInfo[]>([]);
  const [visibleMapIds, setVisibleMapIds] = useState<Set<number>>(new Set());
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const showBaseMap = true;

  // C 담당: 부대시설 타입별 표시 여부 (기본값: 전체 표시)
  const [visibleFacilityTypes, setVisibleFacilityTypes] = useState<Set<FacilityType>>(
    new Set(ALL_FACILITY_TYPES)
  );

  const { position, permissionState, isSharing, startSharing, stopSharing } =
    useLocation();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    fetch(`${baseUrl}/festivals/${festivalId}/maps`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) {
          const content: FestivalMapInfo[] = data.result.content;
          setMaps(content);
          setVisibleMapIds(new Set(content.map((m) => m.mapId)));
        }
      })
      .catch((err) => console.error("지도 목록 fetch 실패:", err));
  }, [festivalId]);

  useEffect(() => {
    if (maps.length > 0 && !isSharing) startSharing();
    return () => stopSharing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps.length]);

  // C 담당: 부대시설 타입 개별 토글
  const toggleFacilityType = (type: FacilityType) => {
    setVisibleFacilityTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const totalBounds = useMemo<
    [[number, number], [number, number]] | null
  >(() => {
    if (maps.length === 0) return null;
    let minLat = Infinity,
      minLng = Infinity;
    let maxLat = -Infinity,
      maxLng = -Infinity;
    for (const m of maps) {
      const [[swLat, swLng], [neLat, neLng]] = normalizeBounds(m);
      minLat = Math.min(minLat, swLat);
      minLng = Math.min(minLng, swLng);
      maxLat = Math.max(maxLat, neLat);
      maxLng = Math.max(maxLng, neLng);
    }
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [maps]);

  if (maps.length === 0 || !totalBounds) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0b1e]">
        <p className="text-white/40 text-sm tracking-widest animate-pulse">
          지도 불러오는 중...
        </p>
      </div>
    );
  }

  const center: [number, number] = [
    (totalBounds[0][0] + totalBounds[1][0]) / 2,
    (totalBounds[0][1] + totalBounds[1][1]) / 2,
  ];

  return (
    <div className="relative w-full h-screen">
      {/* 위치 권한 거부 배너 */}
      {permissionState === "denied" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-[#F43F5E]/90 backdrop-blur-md rounded-[10px] px-4 py-2">
          <p className="text-white text-xs font-medium text-center">
            위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.
          </p>
        </div>
      )}

      {/* ── 레이어 패널 (C 담당: 지도 선택 제거 → 부대시설 타입별 토글로 교체) ── */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => setShowLayerPanel((v) => !v)}
          style={{
            background: "rgba(15, 17, 26, 0.85)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            borderRadius: "10px",
            padding: "8px 14px",
            color: "white",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          부대시설
        </button>

        {showLayerPanel && (
          <div
            style={{
              marginTop: "8px",
              background: "rgba(15, 17, 26, 0.92)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              minWidth: "180px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* 전체 토글 버튼 */}
            <button
              onClick={() =>
                setVisibleFacilityTypes(
                  visibleFacilityTypes.size === ALL_FACILITY_TYPES.length
                    ? new Set()
                    : new Set(ALL_FACILITY_TYPES)
                )
              }
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px",
                padding: "5px 10px",
                color: "white",
                fontSize: "11px",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              {visibleFacilityTypes.size === ALL_FACILITY_TYPES.length
                ? "전체 숨기기"
                : "전체 보이기"}
            </button>

            {/* 부대시설 타입별 토글 버튼 */}
            {ALL_FACILITY_TYPES.map((type) => {
              const isVisible = visibleFacilityTypes.has(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleFacilityType(type)}
                  style={{
                    background: isVisible
                      ? "rgba(43, 189, 238, 0.15)"
                      : "rgba(255,255,255,0.05)",
                    border: isVisible
                      ? "1.5px solid #2bbdee"
                      : "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: isVisible ? "#2bbdee" : "rgba(255,255,255,0.4)",
                    fontSize: "12px",
                    fontWeight: isVisible ? "600" : "400",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src={FACILITY_ICON[type]}
                    alt={FACILITY_LABEL[type]}
                    style={{ width: "18px", height: "18px", objectFit: "contain" }}
                  />
                  {FACILITY_LABEL[type]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={16}
        maxZoom={22}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        {showBaseMap && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        )}

        <FixedMap bounds={totalBounds} />

        {maps
          .filter((m) => visibleMapIds.has(m.mapId))
          .map((m) => (
            <ImageOverlay
              key={m.mapId}
              url={m.mapImageUrl}
              bounds={normalizeBounds(m)}
              opacity={showBaseMap ? 0.75 : 1}
            />
          ))}

        {showTraffic &&
          maps
            .filter((m) => visibleMapIds.has(m.mapId))
            .map((m) => (
              <CongestionLayer key={`congestion-${m.mapId}`} mapId={m.mapId} />
            ))}

        <MyLocationMarker position={position} followOnce />

        {/* 주막 마커 레이어 */}
        <BoothLayer festivalId={festivalId} />

        {/* C 담당: 부대시설 마커 레이어 */}
        <FacilityLayer visibleTypes={visibleFacilityTypes} />
      </MapContainer>
    </div>
  );
}
