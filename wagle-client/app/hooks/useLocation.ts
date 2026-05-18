"use client";

import { useRef, useState, useCallback } from "react";
// ✅ 수정됨: 더 이상 locationInfo 등 서버 통신 타입이 필요 없어 제거되었습니다.

const ACCESS_TOKEN_KEY = "accessToken";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export interface UseLocationReturn {
  /** 브라우저에서 얻은 현재 좌표 (지도에 바로 표시용) */
  position: { lat: number; lng: number } | null;
  /** 위치 권한 상태 */
  permissionState: "idle" | "granted" | "denied" | "unavailable";
  /** 위치 공유 활성화 여부 */
  isSharing: boolean;
  /** 위치 공유 시작 */
  startSharing: () => void;
  /** 위치 공유 중단 */
  stopSharing: () => void;
}

/**
 * C 담당: 내 위치 훅
 * ✅ 수정됨: 기존의 Flow B (서버 전송) 폴링 로직을 GlobalLocationTracker로 분리했습니다.
 * 이제 이 훅은 "지도에 내 위치(파란 점)를 실시간으로 그리기" 위한 용도로만 쓰입니다!
 */
export function useLocation(): UseLocationReturn {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionState, setPermissionState] = useState<UseLocationReturn["permissionState"]>("idle");
  const [isSharing, setIsSharing] = useState(false);

  const watchIdRef = useRef<number | null>(null);

  // ── 위치 공유 시작 ─────────────────────────────────────────
  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionState("unavailable");
      return;
    }

    setIsSharing(true);

    // Flow A: watchPosition으로 위치 변화 실시간 감지 → 지도에 표시
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        setPermissionState("granted");
      },
      (err) => {
        console.error("Geolocation 에러:", err);
        setPermissionState(err.code === 1 ? "denied" : "unavailable");
        setIsSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
  }, []);

  // ── 위치 공유 중단 ─────────────────────────────────────────
  const stopSharing = useCallback(() => {
    setIsSharing(false);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // ✅ 수정됨: 서버 API 전송을 분리했으므로 Beacon API(handleUnload)도 제거되었습니다.

  return { position, permissionState, isSharing, startSharing, stopSharing };
}

// ── UUID / 토큰 관련 유틸 ──────────────────────────────────────

/**
 * 앱 재진입 시 토큰 유효성 검사
 * - 유효 → 토큰 그대로 사용, isTermsAgreed 반환
 * - 무효 → localStorage 토큰 삭제, null 반환
 */
export async function checkMyStatus(): Promise<{ uuid: string; isTermsAgreed: boolean } | null> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/visitors/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.isSuccess) return data.result;

    // 유효하지 않은 토큰 → 삭제
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * 약관 동의 → UUID(토큰) 발급 → localStorage 저장
 */
export async function agreeAndRegister(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/visitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isTermsAgreed: true }),
    });
    const data = await res.json();
    if (data.isSuccess) {
      // 응답 헤더의 Authorization Bearer 토큰 저장
      const authHeader = res.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "") ?? data.result.uuid;
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      return token;
    }
    return null;
  } catch {
    return null;
  }
}