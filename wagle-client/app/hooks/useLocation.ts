"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { LocationUpdateResponse } from "../types/festival";

const ACCESS_TOKEN_KEY = "accessToken";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DEFAULT_INTERVAL = 5000; // 5초 기본값

export interface UseLocationReturn {
  /** 브라우저에서 얻은 현재 좌표 (지도에 바로 표시용) */
  position: { lat: number; lng: number } | null;
  /** 위치 권한 상태 */
  permissionState: "idle" | "granted" | "denied" | "unavailable";
  /** 서버 응답 - 현재 구역 정보 */
  locationInfo: LocationUpdateResponse | null;
  /** 위치 공유 활성화 여부 */
  isSharing: boolean;
  /** 위치 공유 시작 */
  startSharing: (festivalId: number) => void;
  /** 위치 공유 중단 */
  stopSharing: () => void;
}

/**
 * C 담당: 내 위치 + UUID 연결 훅
 *
 * - Flow A: 브라우저 GPS → 지도 위에 바로 표시 (position 상태)
 * - Flow B: 브라우저 GPS → 서버 전송 → 혼잡도 기여 (폴링)
 * - locationUpdateInterval 서버 응답값으로 폴링 간격 동적 조절
 */
export function useLocation(): UseLocationReturn {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionState, setPermissionState] = useState<UseLocationReturn["permissionState"]>("idle");
  const [locationInfo, setLocationInfo] = useState<LocationUpdateResponse | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const festivalIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const currentIntervalMs = useRef<number>(DEFAULT_INTERVAL);
  const latestPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  // ── 서버에 위치 전송 (Flow B) ──────────────────────────────
  const sendLocation = useCallback(async (lat: number, lng: number) => {
    const festivalId = festivalIdRef.current;
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!festivalId || !token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/festivals/${festivalId}/visitors/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lat, lng }),
      });

      const data = await res.json();
      if (data.isSuccess) {
        setLocationInfo(data.result);
        // 서버 권장 간격으로 동적 조절
        const newInterval: number = data.result.locationUpdateInterval ?? DEFAULT_INTERVAL;
        currentIntervalMs.current = newInterval;
      }
    } catch (err) {
      console.error("위치 전송 실패:", err);
    }
  }, []);

  // ── 폴링 루프 ─────────────────────────────────────────────
  const scheduleNext = useCallback(() => {
    intervalRef.current = setTimeout(async () => {
      if (!latestPositionRef.current) {
        scheduleNext();
        return;
      }
      const { lat, lng } = latestPositionRef.current;
      await sendLocation(lat, lng);
      scheduleNext(); // 응답 받은 뒤 다음 스케줄 (동적 간격 반영)
    }, currentIntervalMs.current);
  }, [sendLocation]);

  // ── 위치 공유 시작 ─────────────────────────────────────────
  const startSharing = useCallback(
    (festivalId: number) => {
      if (!navigator.geolocation) {
        setPermissionState("unavailable");
        return;
      }

      festivalIdRef.current = festivalId;
      setIsSharing(true);

      // Flow A: watchPosition으로 위치 변화 실시간 감지 → 지도에 표시
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(coords);
          latestPositionRef.current = coords;
          setPermissionState("granted");
        },
        (err) => {
          console.error("Geolocation 에러:", err);
          setPermissionState(err.code === 1 ? "denied" : "unavailable");
          setIsSharing(false);
        },
        { enableHighAccuracy: true, maximumAge: 3000 }
      );

      // Flow B: 폴링 시작 (초기 1회 즉시 전송)
      scheduleNext();
    },
    [scheduleNext]
  );

  // ── 위치 공유 중단 ─────────────────────────────────────────
  const stopSharing = useCallback(() => {
    setIsSharing(false);
    festivalIdRef.current = null;

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── 페이지 이탈 시 공유 중단 (Beacon API) ─────────────────
  useEffect(() => {
    const handleUnload = () => {
      const festivalId = festivalIdRef.current;
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!festivalId || !token) return;

      // sendBeacon은 페이지 종료 시에도 전송 보장
      navigator.sendBeacon(
        `${BASE_URL}/api/v1/festivals/${festivalId}/visitors/location`,
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      stopSharing();
    };
  }, [stopSharing]);

  return { position, permissionState, locationInfo, isSharing, startSharing, stopSharing };
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
    const res = await fetch(`${BASE_URL}/api/v1/visitors/me`, {
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
    const res = await fetch(`${BASE_URL}/api/v1/visitors`, {
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