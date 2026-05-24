"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import type { FacilityInfo, FacilityType } from "../../types/facility";
import { FACILITY_ICON, FACILITY_LABEL } from "../../types/facility";

// public/facility.json에서 부대시설 데이터 로드
// ⚠️ 백엔드 API 연결 시 이 import를 fetch로 교체
import facilityData from "../../../public/facility.json";

// facility.json의 result.content를 FacilityInfo[] 타입으로 사용
const FACILITY_DATA: FacilityInfo[] = facilityData.result.content as FacilityInfo[];

interface FacilityLayerProps {
  /** 표시할 부대시설 타입 목록 (빈 Set이면 전체 숨김) */
  visibleTypes: Set<FacilityType>;
}

/** 부대시설 아이콘 생성 */
function makeFacilityIcon(type: FacilityType) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 36px;
        height: 36px;
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
          style="width:22px;height:22px;object-fit:contain;"
        />
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    tooltipAnchor: [0, -20],
  });
}

export default function FacilityLayer({ visibleTypes }: FacilityLayerProps) {
  // 표시할 타입만 필터링
  const visible = FACILITY_DATA.filter((f) => visibleTypes.has(f.facilityType));

  return (
    <>
      {visible.map((facility) => (
        <Marker
          key={facility.facilityId}
          position={[facility.latitude, facility.longitude]}
          icon={makeFacilityIcon(facility.facilityType)}
          zIndexOffset={500}
        ></Marker>
      ))}
    </>
  );
}
