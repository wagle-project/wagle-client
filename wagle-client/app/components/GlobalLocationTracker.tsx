"use client";

import { useEffect, useRef } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const FESTIVAL_ID = 1; // 기획 요구사항: 무조건 축제 1번으로 고정
const INTERVAL = 5000; // 5초 간격

// ✅ 추가: 애플리케이션 전역에서 사용자의 위치를 백그라운드로 서버에 전송하는 컴포넌트
export default function GlobalLocationTracker() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTracking = () => {
      // 이미 추적 중이거나 GPS 지원 안 되면 무시
      if (intervalRef.current || !navigator.geolocation) return;

      const track = () => {
        const token = localStorage.getItem("accessToken");
        
        // 토큰이 없으면(동의 안 했으면) 추적 즉시 중단
        if (!token) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }

        // 백그라운드 서버 위치 전송
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            try {
              // Beacon 대신 일반 Fetch로 5초마다 위치 갱신
              await fetch(`${BASE_URL}/festivals/${FESTIVAL_ID}/visitors/location`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ lat: coords.latitude, lng: coords.longitude }),
              });
            } catch (err) {
              console.warn("전역 위치 전송 실패:", err);
            }
          },
          (err) => console.warn("GPS 오류:", err)
        );
      };

      track(); // 처음 1회 즉시 실행
      intervalRef.current = setInterval(track, INTERVAL); // 이후 5초마다 반복
    };

    // 1. 재방문자 (페이지 새로고침 시 이미 동의 토큰이 있는 경우)
    if (localStorage.getItem("accessToken")) {
      startTracking();
    }

    // 2. 신규 방문자 (모달 창에서 방금 동의 버튼을 눌러 이벤트가 발생한 경우)
    const handleTokenSaved = () => startTracking();
    window.addEventListener("tokenSaved", handleTokenSaved);

    return () => {
      window.removeEventListener("tokenSaved", handleTokenSaved);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null; // 화면에는 아무 UI도 렌더링하지 않음
}