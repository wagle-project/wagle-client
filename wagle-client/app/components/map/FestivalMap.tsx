"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, ImageOverlay, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import CongestionLayer from "./CongestionLayer";
import MyLocationMarker from "./MyLocationMarker";
import { useLocation } from "../../hooks/useLocation";
import type { FestivalMapInfo } from "../../types/festival";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  // ✅ 활성화된 mapId Set으로 관리
  const [visibleMapIds, setVisibleMapIds] = useState<Set<number>>(new Set());
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const showBaseMap = true;

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
          // ✅ 처음엔 전체 레이어 활성화
          setVisibleMapIds(new Set(content.map((m) => m.mapId)));
        }
      })
      .catch((err) => console.error("지도 목록 fetch 실패:", err));
  }, [festivalId]);

  useEffect(() => {
    if (maps.length > 0 && !isSharing) startSharing(festivalId);
    return () => stopSharing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps.length]);

  // ✅ 레이어 토글
  const toggleLayer = (mapId: number) => {
    setVisibleMapIds((prev) => {
      const next = new Set(prev);
      if (next.has(mapId)) {
        next.delete(mapId);
      } else {
        next.add(mapId);
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

      {/* ✅ 레이어 토글 버튼 */}
      <div className="absolute top-4 right-4 z-[1000]">
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
          🗂 레이어 ({visibleMapIds.size}/{maps.length})
        </button>

        {/* ✅ 레이어 목록 패널 */}
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
              minWidth: "160px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* 전체 토글 */}
            <button
              onClick={() =>
                setVisibleMapIds(
                  visibleMapIds.size === maps.length
                    ? new Set()
                    : new Set(maps.map((m) => m.mapId)),
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
              {visibleMapIds.size === maps.length
                ? "전체 숨기기"
                : "전체 보이기"}
            </button>

            {/* 개별 레이어 버튼 - 활성화 여부에 따라 색상 변경 */}
            {maps.map((m, i) => (
              <button
                key={m.mapId}
                onClick={() => toggleLayer(m.mapId)}
                style={{
                  background: visibleMapIds.has(m.mapId)
                    ? "rgba(43, 189, 238, 0.2)"
                    : "rgba(255,255,255,0.05)",
                  border: visibleMapIds.has(m.mapId)
                    ? "1.5px solid #2bbdee"
                    : "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "10px 12px", // 터치 영역 충분히 확보
                  color: visibleMapIds.has(m.mapId)
                    ? "#2bbdee"
                    : "rgba(255,255,255,0.4)",
                  fontSize: "12px",
                  fontWeight: visibleMapIds.has(m.mapId) ? "600" : "400",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  width: "100%",
                }}
              >
                {visibleMapIds.has(m.mapId) ? "● " : "○ "}
                지도 {i + 1} (#{m.mapId})
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={16}
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

        {/* ✅ visibleMapIds에 있는 것만 렌더링 */}
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
      </MapContainer>
    </div>
  );
}
