"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MyLocationMarkerProps {
  position: { lat: number; lng: number } | null;
  /** true면 첫 위치 감지 시 지도 중심 이동 */
  followOnce?: boolean;
}

/**
 * C 담당: 내 위치 마커
 * - CSS로 직접 그린 파란 점 + 파동 애니메이션 (이미지 의존 없음)
 * - followOnce: 최초 1회만 지도 중심 이동
 */
export default function MyLocationMarker({ position, followOnce = true }: MyLocationMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const hasFollowed = useRef(false);

  useEffect(() => {
    if (!position) return;

    // ── 커스텀 아이콘: 파란 점 + 파동 (순수 CSS) ──────────
    const icon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
          <!-- 파동 1 -->
          <span style="
            position:absolute;
            width:40px;height:40px;
            border-radius:50%;
            background:rgba(43,189,238,0.25);
            animation:wagle-pulse 2s ease-out infinite;
          "></span>
          <!-- 파동 2 (딜레이) -->
          <span style="
            position:absolute;
            width:40px;height:40px;
            border-radius:50%;
            background:rgba(43,189,238,0.15);
            animation:wagle-pulse 2s ease-out 0.6s infinite;
          "></span>
          <!-- 흰색 테두리 -->
          <span style="
            position:absolute;
            width:18px;height:18px;
            border-radius:50%;
            background:white;
            box-shadow:0 0 0 3px rgba(43,189,238,0.4);
          "></span>
          <!-- 파란 점 -->
          <span style="
            position:absolute;
            width:12px;height:12px;
            border-radius:50%;
            background:#2bbdee;
          "></span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // CSS keyframe 한 번만 주입
    if (!document.getElementById("wagle-location-style")) {
      const style = document.createElement("style");
      style.id = "wagle-location-style";
      style.textContent = `
        @keyframes wagle-pulse {
          0%   { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2);   opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const latlng: L.LatLngExpression = [position.lat, position.lng];

    if (!markerRef.current) {
      markerRef.current = L.marker(latlng, { icon, zIndexOffset: 1000 }).addTo(map);
    } else {
      markerRef.current.setLatLng(latlng);
      markerRef.current.setIcon(icon);
    }

    // followOnce: 최초 1회만 지도 중심 이동
    if (followOnce && !hasFollowed.current) {
      map.setView(latlng, map.getZoom(), { animate: true });
      hasFollowed.current = true;
    }
  }, [position, map, followOnce]);

  // 언마운트 시 마커 제거
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  return null;
}