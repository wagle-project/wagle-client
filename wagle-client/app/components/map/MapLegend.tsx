"use client";

/**
 * C 담당: 혼잡도 범례 (MapLegend)
 * - MapContainer 밖에서 absolute 포지션으로 렌더링
 * - 기존 디자인 시스템 (다크 배경 #0f111a, 시안 #2bbdee) 맞춤
 */
export default function MapLegend() {
  const levels = [
    { label: "쾌적", color: "#4ADE80", level: 0 },
    { label: "보통", color: "#FACC15", level: 1 },
    { label: "혼잡", color: "#FB923C", level: 2 },
    { label: "매우혼잡", color: "#F43F5E", level: 3 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "80px",
        right: "12px",
        zIndex: 1000,
        pointerEvents: "none",
      }}
      className="flex flex-col gap-[6px] rounded-[12px] bg-[#0f111a]/80 backdrop-blur-md px-3 py-[10px] border border-white/10"
    >
      <p className="text-white/40 text-[9px] tracking-[0.15em] font-medium uppercase mb-[2px]">
        혼잡도
      </p>
      {levels.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: color, opacity: 0.85 }}
          />
          <span className="text-white/70 text-[11px] font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}