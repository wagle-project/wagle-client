"use client";

import { useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import BoothPopup from "./BoothPopup";
import type { BoothInfo } from "../../types/booth";

interface BoothMarkerProps {
  booth: BoothInfo;
  isSelected: boolean;
  isCollegeActive: boolean;
  onSelect: (boothNumber: number | null) => void;
}

// 줌 레벨 → 마커 크기
function getMarkerSize(zoom: number): number {
  if (zoom <= 14) return 0.1;
  if (zoom <= 16) return 1; //

  if (zoom === 17) return 5;
  if (zoom === 18) return 10;
  if (zoom >= 19) return 15;

  return 20;
}

export default function BoothMarker({
  booth,
  isSelected,
  isCollegeActive,
  onSelect,
}: BoothMarkerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(map.getZoom());

  useMapEvents({
    zoom: () => setZoom(map.getZoom()),
  });

  // console.log(zoom);

  const size = getMarkerSize(zoom);
  const fontSize = size <= 12 ? 4 : size <= 13 ? 5 : size <= 14 ? 9 : 10;
  const isHighlighted = isSelected || isCollegeActive;

  const icon = L.divIcon({
    className: "",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${isSelected ? "#FF3D71" : isCollegeActive ? "rgba(255,61,113,0.25)" : "transparent"};
        border: 1.5px solid ${isHighlighted ? "#FF3D71" : "#111"};
        color: ${isHighlighted ? "#FF3D71" : "#111"};
        font-size: ${fontSize}px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: ${
          isSelected
            ? "0 0 0 3px rgba(255,61,113,0.35), 0 4px 16px rgba(255,61,113,0.5)"
            : isCollegeActive
              ? "0 0 0 2px rgba(255,61,113,0.2)"
              : "0 2px 8px rgba(0,0,0,0.25)"
        };
        user-select: none;
        line-height: 1;
      ">
        ${booth.boothNumber}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  const handleClick = () => {
    if (isSelected) {
      onSelect(null);
    } else {
      onSelect(booth.boothNumber);
      map.flyTo(
        [booth.latitude, booth.longitude],
        Math.max(map.getZoom(), 18),
        { animate: true, duration: 0.5 },
      );
    }
  };

  return (
    <>
      <Marker
        position={[booth.latitude, booth.longitude]}
        icon={icon}
        eventHandlers={{ click: handleClick }}
        zIndexOffset={isSelected ? 1000 : 0}
      />
      {isSelected && (
        <BoothPopup booth={booth} onClose={() => onSelect(null)} />
      )}
    </>
  );
}
