"use client";

import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import BoothPopup from "./BoothPopup";
import type { BoothInfo } from "../../types/booth";

interface BoothMarkerProps {
  booth: BoothInfo;
  isSelected: boolean;
  onSelect: (boothNumber: number | null) => void;
}

// 동그라미 숫자 이모지 배열 (① ~ ⑳)
const circledNumbers = [
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

function getCircledNumber(n: number): string {
  if (n >= 1 && n <= 20) return circledNumbers[n - 1];
  return `${n}`;
}

export default function BoothMarker({
  booth,
  isSelected,
  onSelect,
}: BoothMarkerProps) {
  const map = useMap();

  const icon = L.divIcon({
    className: "",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${isSelected ? "#FF3D71" : "transparent"};
        border: 2.5px solid ${isSelected ? "#FF3D71" : "#111"};
        color: ${isSelected ? "#fff" : "#111"};
        font-size: 20px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: ${
          isSelected
            ? "0 0 0 3px rgba(255,61,113,0.35), 0 4px 16px rgba(255,61,113,0.5)"
            : "0 2px 8px rgba(0,0,0,0.25)"
        };
        transition: all 0.18s;
        user-select: none;
        line-height: 1;
      ">
        ${getCircledNumber(booth.boothNumber)}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  const handleClick = () => {
    if (isSelected) {
      onSelect(null);
    } else {
      onSelect(booth.boothNumber);
      map.flyTo(
        [booth.latitude, booth.longitude],
        Math.max(map.getZoom(), 18),
        {
          animate: true,
          duration: 0.5,
        },
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
