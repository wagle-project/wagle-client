import { Festival } from "@/app/types/festival";
import { StatusBadge } from "./StatusBadge";
import Image from "next/image"; //이미지 최적화 위해 Next.js Image 컴포넌트 사용
interface FestivalCardProps {
  festival: Festival;
  onClick: () => void;
}

export function FestivalCard({ festival, onClick }: FestivalCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="w-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.25)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* 상단 뱃지 */}
      <div className="px-4 pt-4 pb-3">
        <StatusBadge status={festival.status} />
      </div>

      {/* 사진 */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "180px" }}
      >
        {festival.posterUrl ? (
          <>
            <Image
              src={festival.posterUrl}
              alt={festival.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
          </>
        ) : (
          // 데이터가 없을 때 보여줄 회색 박스 (로딩용)
          <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
            <span className="text-white/20 text-xs">이미지 준비 중</span>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="px-4 py-4 flex items-end justify-between">
        <div className="flex-1">
          <h3 className="text-white text-lg font-bold leading-tight mb-2">
            {festival.name}
          </h3>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <span>📍</span>
              <span>{festival.placeName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <span>📅</span>
              <span>
                {festival.startDate} - {festival.endDate}
              </span>
            </div>
          </div>
        </div>
        <button
          style={{
            marginLeft: "16px",
            marginBottom: "20px",
            marginRight: "34px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#2BBDEE", // 기본 파란색
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "none",
            cursor: "pointer",
            // 파란색 그림자 효과
            boxShadow: "0 0 12px rgba(43, 189, 238, 0.35)",
            transition: "all 0.3s ease",
            padding: "0",
          }}
          // 마우스 오버 시 핑크색으로 변경 (#FF3D71 또는 프로젝트 톤인 #FF80DF 추천)
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FF80DF";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(255, 128, 223, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2BBDEE";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(43, 189, 238, 0.35)";
          }}
          aria-label="자세히 보기"
        >
          <span
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            →
          </span>
        </button>
      </div>
    </div>
  );
}
