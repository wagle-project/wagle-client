import { Festival } from "@/app/types/festival";

// 축제 데이터는 API에서 받아올 예정이므로, 현재는 더미 데이터를 사용합니다.
export const DUMMY_FESTIVALS: Festival[] = [
  {
    id: 1,
    name: "2025 영대축제",
    placeName: "영남대학교 천연잔디구장 등 캠퍼스 일원",
    startDate: "2025년 9월 30일",
    endDate: "10월 2일",
    posterUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    status: "ONGOING",
  },
  {
    id: 2,
    name: "서울 빛축제 2026",
    placeName: "서울 청계천",
    startDate: "2026.11.01",
    endDate: "11.30",
    posterUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    status: "UPCOMING",
  },
  {
    id: 3,
    name: "부산 바다 음악 페스티벌",
    placeName: "부산 해운대 해수욕장",
    startDate: "2026.08.10",
    endDate: "08.12",
    posterUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    status: "ENDED",
  },
  {
    id: 4,
    name: "전주 한옥마을 국제영화제",
    placeName: "전주 한옥마을",
    startDate: "2026.09.20",
    endDate: "09.25",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    status: "UPCOMING",
  },
  {
    id: 5,
    name: "제주 벚꽃 축제",
    placeName: "제주 전농로",
    startDate: "2026.03.25",
    endDate: "04.05",
    posterUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80",
    status: "ENDED",
  },
];
export interface FestivalListResponse {
  content: Festival[];
  totalElements: number;
}
