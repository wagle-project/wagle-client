"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          router.push("/onboarding");
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between bg-black p-8 overflow-hidden ">
      {/* 상단 여백 */}
      <div className="h-14 w-full"></div>

      {/* 중앙 로고 섹션 */}
      <div className="flex flex-col items-center justify-center grow w-full max-w-sm">
        <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
          {/* 네온 글로우 효과 */}
          <div className="absolute inset-0 bg-[#2bbdee]/10 blur-[70px] rounded-full"></div>

          <div
            className="relative z-10 w-full h-full flex items-center justify-center"
            style={{
              filter:
                "drop-shadow(0 0 10px rgba(43, 189, 238, 0.5)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.3))",
            }}
          >
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="neonGradient"
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2bbdee"></stop>
                  <stop offset="100%" stopColor="#a855f7"></stop>
                </linearGradient>
              </defs>
              <path
                d="M30 110C30 85 50 75 70 75C85 75 95 85 100 100C105 115 115 125 130 125C150 125 170 115 170 90C170 65 150 55 130 55M10 120C10 150 40 175 75 175C110 175 130 155 150 155C170 155 190 170 190 190"
                stroke="url(#neonGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="70"
                cy="55"
                r="10"
                stroke="url(#neonGradient)"
                strokeWidth="3"
              ></circle>
              <circle
                cx="130"
                cy="35"
                r="10"
                stroke="url(#neonGradient)"
                strokeWidth="3"
              ></circle>
              <circle
                cx="130"
                cy="175"
                r="10"
                stroke="url(#neonGradient)"
                strokeWidth="3"
              ></circle>
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h1 style={{ fontFamily: "var(--font-agbalumo)" }}>WagleWagle</h1>
          <p className="text-[#2bbdee]/80 text-[15px] font-normal tracking-tight opacity-90">
            축제의 모든 즐거움이 와글와글!
          </p>
        </div>
      </div>

      {/* 하단 로딩 바 섹션 */}
      <div className="w-full max-w-[280px] flex flex-col items-center gap-10">
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-white/30 text-[9px] tracking-[0.2em] font-medium uppercase">
              Detecting Nearby Festivals
            </p>
            <p className="text-white/30 text-[9px] tracking-[0.2em] font-medium uppercase">
              {progress}%
            </p>
          </div>
          <div className="h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2bbdee] to-[#a855f7] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="h-2"></div>
      </div>

      {/* 배경 장식 광원 */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-[#2bbdee]/5 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a855f7]/5 blur-[110px] rounded-full pointer-events-none"></div>
    </div>
  );
}
