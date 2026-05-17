// src/types/booth.ts

export interface BoothInfo {
  boothNumber: number;     // 주막 번호 (① ② ③ …)
  boothName: string;       // 주막 이름 (예: "달빛 주막")
  department: string;      // 학과 이름 (예: "컴퓨터공학과")
  latitude: number;        // 지도 위 위도
  longitude: number;       // 지도 위 경도
  menuImageUrl: string;    // 메뉴판 이미지 URL
}
