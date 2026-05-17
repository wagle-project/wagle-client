/**
 * app/test/page.tsx
 *
 * 브라우저에서 /test 로 접속하면 주막 마커 + 팝업 미리보기를 확인할 수 있습니다.
 * 확인 후 이 파일은 삭제해도 됩니다.
 */

import dynamic from "next/dynamic";

// Leaflet은 SSR 불가 → dynamic import로 클라이언트에서만 로드
const BoothMapTest = dynamic(() => import("../components/map/BoothMapTest "), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0b1e",
        color: "rgba(255,255,255,0.4)",
        fontSize: "14px",
        letterSpacing: "2px",
      }}
    >
      지도 불러오는 중...
    </div>
  ),
});

export default function TestPage() {
  return <BoothMapTest />;
}
