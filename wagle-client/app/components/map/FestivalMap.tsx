"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, ImageOverlay, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import CongestionLayer from "./CongestionLayer";
import MyLocationMarker from "./MyLocationMarker";
import BoothLayer from "./BoothLayer";
import FacilityLayer from "./FacilityLayer";
import { useLocation } from "../../hooks/useLocation";
import type { FestivalMapInfo } from "../../types/festival";
import type { FacilityType } from "../../types/facility.ts";
import { FACILITY_LABEL, FACILITY_ICON } from "../../types/facility";
import type { BoothInfo } from "../../types/booth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

function getBoothRange(booths: BoothInfo[]): string {
  const nums = booths.map((b) => b.boothNumber).sort((a, b) => a - b);
  if (nums.length === 0) return "";
  if (nums.length === 1) return `${nums[0]}`;
  return `${nums[0]}~${nums[nums.length - 1]}`;
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
  const showBaseMap = true;

  // ── 부대시설 상태 ──
  const [showFacilityPanel, setShowFacilityPanel] = useState(false);
  const [visibleFacilityTypes, setVisibleFacilityTypes] = useState<
    Set<FacilityType>
  >(new Set(ALL_FACILITY_TYPES));

  // ── 주막 상태 ──
  const [showBoothPanel, setShowBoothPanel] = useState(false);
  const [boothsData, setBoothsData] = useState<BoothInfo[]>([]);
  const [boothVisible, setBoothVisible] = useState(true);
  const [activeCollege, setActiveCollege] = useState<string | null>(null);
  const [selectedBoothNumber, setSelectedBoothNumber] = useState<number | null>(
    null,
  );

  const { position, permissionState, isSharing, startSharing, stopSharing } =
    useLocation();

  // 지도 fetch
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

  // 부스 데이터 fetch (패널 UI용)
  useEffect(() => {
    fetch("/booth.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) setBoothsData(data.result.content as BoothInfo[]);
      })
      .catch((err) => console.error("부스 fetch 실패:", err));
  }, []);

  useEffect(() => {
    if (maps.length > 0 && !isSharing) startSharing();
    return () => stopSharing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps.length]);

  const toggleFacilityType = (type: FacilityType) => {
    setVisibleFacilityTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // 단과대학별 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<string, { collegeName: string; booths: BoothInfo[] }>();
    for (const booth of boothsData) {
      if (!map.has(booth.college)) {
        map.set(booth.college, { collegeName: booth.collegeName, booths: [] });
      }
      map.get(booth.college)!.booths.push(booth);
    }
    return map;
  }, [boothsData]);

  const totalBounds = useMemo<
    [[number, number], [number, number]] | null
  >(() => {
    if (maps.length === 0) return null;
    let minLat = Infinity,
      minLng = Infinity,
      maxLat = -Infinity,
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
      {permissionState === "denied" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-[#F43F5E]/90 backdrop-blur-md rounded-[10px] px-4 py-2">
          <p className="text-white text-xs font-medium text-center">
            위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.
          </p>
        </div>
      )}

      {/* ── 왼쪽 상단 버튼 영역 ── */}
      <div className="absolute top-4 left-4 z-[1000] flex gap-2 items-start">
        {/* ── 주막 버튼 + 패널 ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => {
              setShowBoothPanel((v) => !v);
              setShowFacilityPanel(false);
            }}
            style={{
              background: showBoothPanel
                ? "rgba(255,61,113,0.15)"
                : "rgba(15,17,26,0.85)",
              backdropFilter: "blur(8px)",
              border: `1.5px solid ${showBoothPanel ? "#FF3D71" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "10px",
              padding: "8px 14px",
              color: showBoothPanel ? "#FF3D71" : "white",
              fontSize: "13px",
              fontWeight: showBoothPanel ? 700 : 400,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 0.15s",
            }}
          >
            주막
          </button>

          {showBoothPanel && (
            <div
              style={{
                marginTop: "8px",
                background: "rgba(15,17,26,0.92)",
                backdropFilter: "blur(12px)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                minWidth: "190px",
                maxHeight: "70vh",
                overflowY: "auto",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {/* 전체 on/off */}
              <button
                onClick={() => {
                  setBoothVisible((v) => !v);
                  if (boothVisible) {
                    setActiveCollege(null);
                    setSelectedBoothNumber(null);
                  }
                }}
                style={{
                  background: boothVisible
                    ? "rgba(255,61,113,0.15)"
                    : "rgba(255,255,255,0.08)",
                  border: `1.5px solid ${boothVisible ? "#FF3D71" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: "8px",
                  padding: "7px 10px",
                  color: boothVisible ? "#FF3D71" : "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  fontWeight: boothVisible ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  marginBottom: "4px",
                }}
              >
                {boothVisible ? "● 전체 숨기기" : "○ 전체 보이기"}
              </button>

              {/* 단과대학별 버튼 */}
              {Array.from(grouped.entries()).map(
                ([college, { collegeName, booths: cb }]) => {
                  const isActive = activeCollege === college;
                  return (
                    <div key={college}>
                      {/* 단과대학 버튼 */}
                      <button
                        onClick={() => {
                          setActiveCollege((prev) =>
                            prev === college ? null : college,
                          );
                          setSelectedBoothNumber(null);
                        }}
                        style={{
                          width: "100%",
                          background: isActive
                            ? "rgba(255,61,113,0.15)"
                            : "rgba(255,255,255,0.05)",
                          border: `1.5px solid ${isActive ? "#FF3D71" : "rgba(255,255,255,0.1)"}`,
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: isActive ? "#FF3D71" : "rgba(255,255,255,0.8)",
                          fontSize: "12px",
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {collegeName}({getBoothRange(cb)})
                      </button>

                      {/* 해당 대학 부스 목록 */}
                      {isActive && (
                        <div
                          style={{
                            marginTop: "4px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                            paddingLeft: "8px",
                          }}
                        >
                          {cb
                            .sort((a, b) => a.boothNumber - b.boothNumber)
                            .map((booth) => (
                              <button
                                key={booth.boothNumber}
                                onClick={() =>
                                  setSelectedBoothNumber((prev) =>
                                    prev === booth.boothNumber
                                      ? null
                                      : booth.boothNumber,
                                  )
                                }
                                style={{
                                  background:
                                    selectedBoothNumber === booth.boothNumber
                                      ? "rgba(255,61,113,0.18)"
                                      : "transparent",
                                  border: `1.5px solid ${selectedBoothNumber === booth.boothNumber ? "#FF3D71" : "transparent"}`,
                                  borderRadius: "6px",
                                  padding: "5px 10px",
                                  color:
                                    selectedBoothNumber === booth.boothNumber
                                      ? "#FF3D71"
                                      : "rgba(255,255,255,0.6)",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  transition: "all 0.15s",
                                }}
                              >
                                {booth.boothNumber}번 {booth.department}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* ── 부대시설 버튼 + 패널 ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => {
              setShowFacilityPanel((v) => !v);
              setShowBoothPanel(false);
            }}
            style={{
              background: showFacilityPanel
                ? "rgba(43,189,238,0.15)"
                : "rgba(15,17,26,0.85)",
              backdropFilter: "blur(8px)",
              border: `1.5px solid ${showFacilityPanel ? "#2bbdee" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "10px",
              padding: "8px 14px",
              color: showFacilityPanel ? "#2bbdee" : "white",
              fontSize: "13px",
              fontWeight: showFacilityPanel ? 700 : 400,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 0.15s",
            }}
          >
            부대시설
          </button>

          {showFacilityPanel && (
            <div
              style={{
                marginTop: "8px",
                background: "rgba(15,17,26,0.92)",
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
              <button
                onClick={() =>
                  setVisibleFacilityTypes(
                    visibleFacilityTypes.size === ALL_FACILITY_TYPES.length
                      ? new Set()
                      : new Set(ALL_FACILITY_TYPES),
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

              {ALL_FACILITY_TYPES.map((type) => {
                const isVisible = visibleFacilityTypes.has(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFacilityType(type)}
                    style={{
                      background: isVisible
                        ? "rgba(43,189,238,0.15)"
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={FACILITY_ICON[type]}
                      alt={FACILITY_LABEL[type]}
                      style={{
                        width: "18px",
                        height: "18px",
                        objectFit: "contain",
                      }}
                    />
                    {FACILITY_LABEL[type]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
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

        {boothVisible && (
          <BoothLayer
            festivalId={festivalId}
            activeCollege={activeCollege}
            selectedBoothNumber={selectedBoothNumber}
            onBoothSelect={setSelectedBoothNumber}
          />
        )}

        <FacilityLayer visibleTypes={visibleFacilityTypes} />
      </MapContainer>
    </div>
  );
}
