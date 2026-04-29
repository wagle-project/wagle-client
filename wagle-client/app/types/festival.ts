// ─── 기존 타입 (useFestivals.ts에서 사용 중) ─────────────────
export type FestivalStatus = "ONGOING" | "UPCOMING" | "ENDED" | "END";

export interface Festival {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: FestivalStatus;
}

// ─── 공통 좌표 타입 ───────────────────────────────────────────
export interface LatLng {
  lat: number;
  lng: number;
}

// ─── 축제 관련 ────────────────────────────────────────────────

export interface FestivalSummary {
  id: number;
  name: string;
  posterUrl: string;
  status: FestivalStatus;
  placeName: string;
}

export interface FestivalDetail {
  id: number;
  name: string;
  description: string;
  posterUrl: string;
  startDate: string;
  endDate: string;
  placeName: string;
  address: string;
}

// ─── 지도 관련 ────────────────────────────────────────────────
export interface MapBounds {
  southWest: LatLng;
  northEast: LatLng;
}

export interface FestivalMapInfo {
  sequence: number;
  mapId: number;
  mapImageUrl: string;
  bounds: MapBounds;
}

// ─── 혼잡도 관련 ──────────────────────────────────────────────
/** 0: 쾌적, 1: 보통, 2: 혼잡, 3: 매우혼잡 */
export type CongestionLevel = 0 | 1 | 2 | 3;

export interface ZoneInfo {
  h3Index: string;
  count: number;
  level: CongestionLevel;
}

export interface CongestionResponse {
  timestamp: number;
  totalCount: number;
  zones: ZoneInfo[];
}

// ─── 방문자(Visitor) 관련 ─────────────────────────────────────
export interface VisitorResponse {
  uuid: string;
  createdAt: string;
  accessToken: string;
}

export interface VisitorMeResponse {
  uuid: string;
  isTermsAgreed: boolean;
}

export interface LocationUpdateResponse {
  isInside: boolean;
  currentMapId: number | null;
  locationUpdateInterval: number; // ms
}

// ─── 타임테이블 관련 ──────────────────────────────────────────
export interface TimeTableInfo {
  imageUrl: string;
  sequence: number;
}

// ─── API 공통 응답 래퍼 ───────────────────────────────────────
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface ListResponseDTO<T> {
  content: T[];
  totalElements: number;
}