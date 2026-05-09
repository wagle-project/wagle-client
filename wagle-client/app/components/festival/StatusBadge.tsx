//축제 상태별 스타일을 나타내는 배지 컴포넌트
import { FestivalStatus } from "@/app/types/festival";

// 상태 정의
const STATUS_CONFIG: Record<
  FestivalStatus,
  { label: string; className: string }
> = {
  ONGOING: {
    label: "ONGOING",
    className: "text-[#00ff88] border border-[#00ff88]/40 bg-[#00ff88]/10",
  },
  UPCOMING: {
    label: "UPCOMING",
    className: "text-[#ffd700] border border-[#ffd700]/40 bg-[#ffd700]/10",
  },

  ENDED: {
    label: "ENDED",
    className: "text-[#ff3d71] border border-[#ff3d71]/40 bg-[#ff3d71]/10",
  },
};

//props값 status로 전달 받아서,
export function StatusBadge({ status }: { status: FestivalStatus }) {
  const { label, className } = STATUS_CONFIG[status]; //분해할당으로, 설정한 스타일 가져옴
  return (
    // 공통된 스타일 적용 및 상태별 스타일 적용
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full`} />
      {/* 상태 표시 3가지 중 하나 */}
      {label}
    </span>
  );
}
