// src/types/facility.ts

/** 부대시설 타입 */
export type FacilityType =
  | "WATER"         // 수도
  | "ELECTRICITY"   // 전기
  | "FOOD_WASTE"    // 음식물쓰레기
  | "GENERAL_WASTE" // 일반쓰레기
  | "TOILET";       // 화장실

export interface FacilityInfo {
  facilityId: number;
  facilityType: FacilityType;
  latitude: number;
  longitude: number;
}

/** 부대시설 타입별 한국어 라벨 */
export const FACILITY_LABEL: Record<FacilityType, string> = {
  WATER: "수도",
  ELECTRICITY: "전기",
  FOOD_WASTE: "음식물쓰레기",
  GENERAL_WASTE: "일반쓰레기",
  TOILET: "화장실",
};

/** 부대시설 타입별 아이콘 경로 (public/icons/ 기준) */
export const FACILITY_ICON: Record<FacilityType, string> = {
  TOILET: "/icons/toilet.png",
  GENERAL_WASTE: "/icons/garbage.png",
  FOOD_WASTE: "/icons/trash-bin.png",
  ELECTRICITY: "/icons/flash.png",
  WATER: "/icons/water-drop.png",
};