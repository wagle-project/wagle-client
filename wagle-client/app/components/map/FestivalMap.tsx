"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet"; // Leaflet 라이브러리 (마커 아이콘 설정 위해 필요)
//import "leaflet/dist/leaflet.css";

// 파일위치 바꿔서 임포트 경로 수정 필요 => 원하는 대로 수정해서 연결된 것도 수정해줘!
import CongestionLayer from "./CongestionLayer"; // B 담당
//import MyLocationMarker from "./MyLocationMarker"; // C 담당
//import MapLegend from "./MapLegend"; // C 담당

// Leaflet 마커 아이콘 깨짐 방지 (Next.js 필수 설정)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 타입 정의 : types폴더에 추후에 분리해서 관리
// 지도의 위도와 경도, 그리고 API에서 받아올 지도 정보 구조
interface LatLng {
  lat: number;
  lng: number;
}

interface MapContent {
  sequence: number;
  mapId: number;
  mapImageUrl: string;
  bounds: {
    southWest: LatLng;
    northEast: LatLng;
  };
}

// bounds에 지도 고정 (지도 전환 시마다 호출)
function FixedMap({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

// 메인 컴포넌트
export default function FestivalMap({ festivalId }: { festivalId: number }) {
  const [maps, setMaps] = useState<MapContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTraffic, setShowTraffic] = useState(true);

  // A 담당 API: 지도 목록 불러오기
  useEffect(() => {
    fetch(`/festivals/${festivalId}/maps`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) {
          setMaps(data.result.content);
        }
      })
      .catch((err) => console.error("지도 목록 fetch 실패:", err));
  }, [festivalId]);

  // 현재 선택된 지도
  const currentMap = maps[currentIndex];

  // bounds 메모이제이션 (currentMap 바뀔 때만 재계산)
  const bounds = useMemo<[[number, number], [number, number]]>(() => {
    if (!currentMap)
      return [
        [0, 0],
        [0, 0],
      ];
    return [
      [currentMap.bounds.southWest.lat, currentMap.bounds.southWest.lng],
      [currentMap.bounds.northEast.lat, currentMap.bounds.northEast.lng],
    ];
  }, [currentMap]);

  // 로딩 중
  if (maps.length === 0) return <div>지도 불러오는 중...</div>;

// FestivalMap.tsx (수정된 return 부분 예시)
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        {/* !! 여기에 MapContainer 여는 태그가 필요합니다 !! */}
        <MapContainer center={[37.5, 127.0]} zoom={13} style={{ width: "100%", height: "100%" }}>
          <FixedMap bounds={bounds} />

          {/* B: 혼잡도 레이어 (SHOW TRAFFIC ON일 때만) */}
          {showTraffic && <CongestionLayer mapId={currentMap.mapId} />}

          {/* C: 내 위치 마커 할 때 주석 없애고 사용*/}
          {/* <MyLocationMarker /> */}
        </MapContainer>

        {/* C: 범례 */}
        {/* <MapLegend /> */}
      </div>
    </>
  );
}
