import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public", // 서비스워커 파일관련 캐시 설정이 저장될 위치
  cacheOnFrontEndNav: true, // 페이지 이동 - 캐시에 저장 O
  aggressiveFrontEndNavCaching: true, //적극적인 캐시 수행 : 관리주의
  reloadOnOnline: true, // reload-> online일때 최신정보 가져옴
  disable: process.env.NODE_ENV === "development", //개발시에는 pwa기능 off : 최신 상태 유지
});

const nextConfig: NextConfig = {
  turbopack: {}, // 이게 없으면 webpack과 겹쳐서 사용되서 오류가 남
  images: {
    unoptimized: true, //주소가 아닌 원본 파일에서 바로 사용
  },
};

export default withPWA(nextConfig);
