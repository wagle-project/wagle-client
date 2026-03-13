"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-[#0a0b1e] font-sans text-white">
      {/* ── 상단 헤더 ── */}
      <div className="flex items-center p-6 justify-between z-10">
        <div className="size-10" />
        <div className="flex-1 text-center">
          <span className="bg-gradient-to-r from-[#ff3d71] to-[#3facee] bg-clip-text text-transparent font-bold tracking-[0.2em] text-xs uppercase">
            WagleWagle
          </span>
        </div>
        <button
          onClick={() => router.back()}
          className="text-white/40 flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* ── 캐릭터 영역 ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative px-4"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 61, 113, 0.15) 0%, rgba(10, 11, 30, 0) 70%)",
        }}
      >
        {/* 배경 글로우 핑크 */}
        <div
          className="absolute w-72 h-72 bg-[#ff3d71] rounded-full -translate-x-10"
          style={{ filter: "blur(80px)", opacity: 0.5 }}
        />
        {/* 배경 글로우 퍼플 */}
        <div
          className="absolute w-64 h-64 bg-[#a855f7] rounded-full translate-x-12 -translate-y-8"
          style={{ filter: "blur(80px)", opacity: 0.5 }}
        />

        {/* 캐릭터 이미지 */}
        <div className="relative w-2280 h-2280 z-10">
          <img
            src="/images/pink.png"
            alt="WagleWagle 캐릭터"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* ── 하단 텍스트 및 버튼 ── */}
      <div className="px-8 pb-8 pt-2 text-center z-10">
        <h1 className="text-white text-4xl font-bold leading-tight tracking-tight mb-4 break-keep">
          실시간 축제 현황을
          <br />
          한눈에!
        </h1>
        <p className="text-white/70 text-lg font-medium leading-relaxed mb-8 max-w-xs mx-auto">
          축제의 모든 즐거움이 와글와글!
        </p>

        {/* 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-1.5 w-8 rounded-full bg-[#ff3d71] shadow-[0_0_15px_rgba(255,61,113,0.6)]" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={() => router.push("/home")}
          className="w-full bg-gradient-to-r from-[#ff3d71] to-[#a855f7] text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.97] transition-all"
          style={{
            boxShadow:
              "0 10px 30px -5px rgba(255,61,113,0.4), 0 0 15px rgba(255,61,113,0.4), inset 0 0 10px rgba(255,61,113,0.2)",
          }}
        >
          축제 즐기러 가기
        </button>
      </div>

      {/* 배경 장식 광원 */}
      <div className="absolute bottom-[-5%] right-[-10%] w-80 h-80 bg-[#2bbdee]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[10%] left-[-20%] w-64 h-64 bg-[#ff3d71]/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}
