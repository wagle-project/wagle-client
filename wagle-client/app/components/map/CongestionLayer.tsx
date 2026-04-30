"use client";

import { useEffect, useState, useMemo } from "react";
import { Polygon } from "react-leaflet";
import { cellsToMultiPolygon } from "h3-js"; // cellToBoundary 대신 병합 함수 사용!


// 백엔드 명세에 맞춘 타입 정의
interface CongestionData {
  h3Index: string;
  level: number; // 1(쾌적), 2(주의), 3(혼잡)
  count?: number; 
}

interface CongestionLayerProps {
  mapId: number;
}

export default function CongestionLayer({ mapId }: CongestionLayerProps) {
  const [rawZones, setRawZones] = useState<CongestionData[]>([]);

  // 1. 실시간 데이터 폴링 (Polling)
  useEffect(() => {
    const fetchCongestion = async () => {
      try {
        const response = await fetch(`/api/v1/maps/${mapId}/congestion`, { // 실제 백엔드 API URL로 수정 필요
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();

        if (data.isSuccess) {
          // data.result.zones 배열을 상태에 저장!
          setRawZones(data.result.zones);
        }
      } catch (err) {
        console.error("혼잡도 데이터 fetch 실패:", err);
      }
    };

    fetchCongestion(); // 마운트 시 즉시 1회 실행
    const intervalId = setInterval(fetchCongestion, 3000); //  3초마다 갱신

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
  }, [mapId]);

  // 2. 육각형 병합 (Memoization으로 연산 최적화)
  const mergedPolygons = useMemo(() => {
    if (rawZones.length === 0) return [];

    // 같은 레벨(1, 2, 3)끼리 h3Index 묶기
    const groupedByLevel: Record<number, string[]> = {};
    rawZones.forEach((zone) => {
      if (!groupedByLevel[zone.level]) groupedByLevel[zone.level] = [];
      groupedByLevel[zone.level].push(zone.h3Index);
    });

    const result = [];

    // 레벨별로 묶은 인덱스들을 멀티 폴리곤으로 변환
    for (const levelStr in groupedByLevel) {
      const level = parseInt(levelStr);
      const indices = groupedByLevel[level];

      // 백엔드가 말한 마법의 코드: 인접한 육각형들의 내부 선을 지우고 외곽선만 반환
      const polygons = cellsToMultiPolygon(indices, false);
      
      result.push({
        level,
        paths: polygons, // Leaflet Polygon이 그릴 수 있는 2차원/3차원 좌표 배열
      });
    }

    return result;
  }, [rawZones]);

  // 3. 레벨에 따른 스타일 지정
  const getLevelStyle = (level: number) => {
    switch (level) {
      case 3:
        return { color: "#FF4B4B", fillColor: "#FF4B4B", fillOpacity: 0.6 }; // 혼잡 (빨강)
      case 2:
        return { color: "#FFD12E", fillColor: "#FFD12E", fillOpacity: 0.5 }; // 주의 (노랑)
      case 1:
        return { color: "#00E676", fillColor: "#00E676", fillOpacity: 0.4 }; // 쾌적 (초록)
      default:
        return { color: "#B0BEC5", fillColor: "#B0BEC5", fillOpacity: 0.4 }; // 기본
    }
  };

  if (mergedPolygons.length === 0) return null;

  // 4. 지도에 렌더링
  return (
    <>
      {mergedPolygons.map((polyGroup) => {
        const style = getLevelStyle(polyGroup.level);
        
        return (
          <Polygon
            key={`level-${polyGroup.level}`}
            positions={polyGroup.paths as unknown as [number, number][][][]}
            pathOptions={{
              fillColor: style.fillColor,
              fillOpacity: style.fillOpacity,
              color: style.color, // 외곽선 색상
              weight: 2, // 묶인 덩어리의 외곽선 두께
            }}
          />
        );
      })}
    </>
  );
}