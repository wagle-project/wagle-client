"use client";

import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import BoothPopup from "./BoothPopup";
import type { BoothInfo } from "../../types/booth";

interface BoothMarkerProps {
  booth: BoothInfo;
  isSelected: boolean;
  isCollegeActive: boolean; // 추가
  onSelect: (boothNumber: number | null) => void;
}

export default function BoothMarker({
  booth,
  isSelected,
  isCollegeActive,
  onSelect,
}: BoothMarkerProps) {
  const map = useMap();
  // icon 생성 부분만 변경
  const isHighlighted = isSelected || isCollegeActive;
  const icon = L.divIcon({
    className: "",
    html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${isSelected ? "#FF3D71" : isCollegeActive ? "rgba(255,61,113,0.25)" : "transparent"};
      border: 1.5px solid ${isHighlighted ? "#FF3D71" : "#111"};
      color: ${isHighlighted ? "#FF3D71" : "#111"};
      font-size: 12px;
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
    iconSize: [18, 18],
    iconAnchor: [9, 9],
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
