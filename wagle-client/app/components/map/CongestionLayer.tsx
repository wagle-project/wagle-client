"use client";

import { useEffect, useState } from "react";
import { Polygon } from "react-leaflet";
import { cellToBoundary } from "h3-js"; // h3 인덱스를 폴리곤 좌표로 변환하는 함수

// API에서 받아올 데이터 타입 정의 (백엔드 명세에 맞게 수정하세요)
interface CongestionData {
  h3Index: string;       // 예: "89283082803ffff"
  level: "LOW" | "NORMAL" | "HIGH"; // 혼잡도 단계 (예시)
}

interface CongestionLayerProps {
  mapId: number;
}

export default function CongestionLayer({ mapId }: CongestionLayerProps) {
  const [hexagons, setHexagons] = useState<CongestionData[]>([]);

  // B 담당 API: mapId를 기반으로 해당 지도의 H3 혼잡도 데이터를 불러옵니다.
  useEffect(() => {
    // 실제 API 엔드포인트로 변경하세요.
    fetch(`/festivals/maps/${mapId}/congestion`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) {
          setHexagons(data.result);
        }
      })
      .catch((err) => console.error("혼잡도 데이터 fetch 실패:", err));
      
    // (테스트용 목업 데이터 - API 연결 전 테스트할 때 아래 주석을 풀고 사용하세요)
    // setHexagons([
    //   { h3Index: "89283082803ffff", level: "HIGH" },
    //   { h3Index: "89283082807ffff", level: "NORMAL" },
    // ]);
  }, [mapId]);

  // 혼잡도 레벨에 따라 색상을 반환하는 헬퍼 함수
  const getHexagonColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "#FF4B4B"; // 빨간색
      case "NORMAL":
        return "#FFD12E"; // 노란색
      case "LOW":
        return "#00E676"; // 초록색
      default:
        return "#B0BEC5"; // 기본 회색
    }
  };

  if (hexagons.length === 0) return null;

  return (
    <>
      {hexagons.map((hex) => {
        // 1. cellToBoundary 함수로 H3 인덱스를 [lat, lng][] 형태의 배열로 변환합니다.
        // 주의: h3-js v3 버전에서는 h3ToGeoBoundary 였으나, v4부터 cellToBoundary로 변경되었습니다.
        const boundaryCoordinates = cellToBoundary(hex.h3Index);

        // 2. 변환된 좌표를 Leaflet의 Polygon 컴포넌트에 넘겨줍니다.
        return (
          <Polygon
            key={hex.h3Index}
            positions={boundaryCoordinates} // 변환된 폴리곤 좌표 배열
            pathOptions={{
              fillColor: getHexagonColor(hex.level),
              fillOpacity: 0.5, // 투명도 (0 ~ 1)
              color: getHexagonColor(hex.level), // 테두리 색상
              weight: 1, // 테두리 두께
            }}
          />
        );
      })}
    </>
  );
}