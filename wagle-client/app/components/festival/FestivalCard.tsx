import { Festival } from "@/app/types/festival";
import { StatusBadge } from "./StatusBadge";

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
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${festival.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
              <span>{festival.location}</span>
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
          className="ml-4 w-9 h-9 rounded-full bg-[#2bbdee] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(43,189,238,0.35)] group-hover:bg-[#ff3d71] group-hover:shadow-[0_0_12px_rgba(255,61,113,0.35)] transition-all duration-300"
          aria-label={`${festival.name} 자세히 보기`}
        >
          <span className="text-white text-sm font-bold">→</span>
        </button>
      </div>
    </div>
  );
}
