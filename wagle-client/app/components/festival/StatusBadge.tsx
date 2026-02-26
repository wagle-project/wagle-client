import { FestivalStatus } from "@/app/types/festival";

const STATUS_CONFIG: Record<
  FestivalStatus,
  { label: string; className: string; dot: string }
> = {
  ONGOING: {
    label: "ONGOING",
    className: "text-[#00ff88] border border-[#00ff88]/40 bg-[#00ff88]/10",
    dot: "bg-[#00ff88]",
  },
  UPCOMING: {
    label: "UPCOMING",
    className: "text-[#ffd700] border border-[#ffd700]/40 bg-[#ffd700]/10",
    dot: "bg-[#ffd700]",
  },
  END: {
    label: "END",
    className: "text-[#ff3d71] border border-[#ff3d71]/40 bg-[#ff3d71]/10",
    dot: "bg-[#ff3d71]",
  },
};

export function StatusBadge({ status }: { status: FestivalStatus }) {
  const { label, className, dot } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
