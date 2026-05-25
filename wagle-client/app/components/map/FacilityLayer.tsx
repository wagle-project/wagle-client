"use client";

import { useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { FacilityInfo, FacilityType } from "../../types/facility";
import { FACILITY_ICON, FACILITY_LABEL } from "../../types/facility";

import facilityData from "../../../public/facility.json";

const FACILITY_DATA: FacilityInfo[] = facilityData.result
  .content as FacilityInfo[];

interface FacilityLayerProps {
  visibleTypes: Set<FacilityType>;
}

function getMarkerSize(zoom: number): number {
  if (zoom <= 14) return 2;
  if (zoom <= 16) return 3;
  if (zoom === 17) return 8;
  if (zoom === 18) return 15;
  if (zoom >= 19) return 25;
  return 15;
}

function makeFacilityIcon(type: FacilityType, size: number) {
  // // 너무 작을 때는 빈 아이콘
  // if (size <= 1) {
  //   return L.divIcon({
  //     className: "",
  //     html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.4);"></div>`,
  //     iconSize: [size, size],
  //     iconAnchor: [size / 2, size / 2],
  //   });
  // }

  const imgSize = Math.round(size * 0.6); // 이미지는 마커의 60%

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(15,17,26,0.85);
        border: 2px solid rgba(255,255,255,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      ">
        <img
          src="${FACILITY_ICON[type]}"
          alt="${FACILITY_LABEL[type]}"
          style="width:${imgSize}px;height:${imgSize}px;object-fit:contain;"
        />
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2],
  });
}

// 줌 상태를 한 곳에서 관리하는 내부 컴포넌트
function FacilityMarkers({ visibleTypes }: FacilityLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(map.getZoom());

  useMapEvents({
    zoom: () => setZoom(map.getZoom()),
  });

  const size = getMarkerSize(zoom);
  const visible = FACILITY_DATA.filter((f) => visibleTypes.has(f.facilityType));
  // console.log(size);
  return (
    <>
      {visible.map((facility) => (
        <Marker
          key={facility.facilityId}
          position={[facility.latitude, facility.longitude]}
          icon={makeFacilityIcon(facility.facilityType, size)}
          zIndexOffset={500}
        />
      ))}
    </>
  );
}

export default function FacilityLayer({ visibleTypes }: FacilityLayerProps) {
  return <FacilityMarkers visibleTypes={visibleTypes} />;
}
