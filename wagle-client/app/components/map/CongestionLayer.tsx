"use client";

import { useEffect, useState, useMemo } from "react";
import { Polygon } from "react-leaflet";
import { cellsToMultiPolygon } from "h3-js"; // cellToBoundary 대신 병합 함수 사용!

// 백엔드 명세에 맞춘 타입 정의
interface CongestionData {
  h3Index: string;
  level: number; // 0(쾌적), 1(보통), 2(혼잡), 3(매우혼잡)
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
        // 토큰 확인 (토큰이 없으면 불필요한 API 호출 방지, SSR 에러 방지)
        const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
        if (!token) {
          console.warn("로그인이 필요합니다. (토큰 없음)");
          return;
        }

        // Base URL 환경변수 처리 (필요시 .env 파일에 NEXT_PUBLIC_API_URL 설정)
        // 프록시 설정이 되어 있다면 baseUrl을 빈 문자열로 두셔도 됩니다.
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''; 
        
        const response = await fetch(`${baseUrl}/api/v1/maps/${mapId}/congestion`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        // 200 성공 응답 처리
        if (response.ok && data.isSuccess) {
          // data.result.zones 배열을 상태에 저장!
          setRawZones(data.result.zones);
        } 
        // 400, 401, 404 등 실패 응답 처리 (Swagger 기준)
        else {
          if (data.code === "AUTH4000") {
            console.error("인증 에러: 로그인이 필요합니다.");
            // TODO: 로그아웃 처리 또는 로그인 페이지 리다이렉트 로직 추가
          } else if (data.code === "COMMON404") {
            console.error("잘못된 경로: 해당 지도가 존재하지 않습니다.");
            // TODO: 폴링을 멈추거나 에러 UI 표시
          } else {
            console.error("API 호출 실패:", data.message);
          }
        }
      } catch (err) {
        console.error("혼잡도 데이터 fetch 중 네트워크 오류 발생:", err);
      }
    };

    fetchCongestion(); // 마운트 시 즉시 1회 실행
    const intervalId = setInterval(fetchCongestion, 3000); //  3초마다 갱신

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
  }, [mapId]);

  // 2. 육각형 병합 (Memoization으로 연산 최적화)
  const mergedPolygons = useMemo(() => {
    if (rawZones.length === 0) return [];

    // 같은 레벨(0, 1, 2, 3)끼리 h3Index 묶기
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

  // 3. 레벨에 따른 스타일 지정 (코랄 오렌지 그라데이션)
  const getLevelStyle = (level: number) => {
    switch (level) {
      case 3:
        return { color: "#FF3B22", fillColor: "#FF3B22", fillOpacity: 0.7 }; // 매우혼잡 (강렬한 코랄 오렌지)
      case 2:
        return { color: "#FF7A68", fillColor: "#FF7A68", fillOpacity: 0.6 }; // 혼잡 (진한 코랄)
      case 1:
        return { color: "#FFB4A9", fillColor: "#FFB4A9", fillOpacity: 0.5 }; // 보통 (중간 코랄)
      case 0:
        return { color: "#FFE8E5", fillColor: "#FFE8E5", fillOpacity: 0.4 }; // 쾌적 (연한 코랄)
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