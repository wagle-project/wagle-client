"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// ── 사이드 드로어 ──────────────────────────────────────────────
function SideDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const menuItems = [{ label: "info", path: "/info", icon: "⚙️" }];

  return (
    <>
      {/* 딤 배경 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* 드로어 패널 */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-[75%] max-w-[300px] bg-[#0e0f24] border-l border-white/10 flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* 드로어 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2
            className="text-white text-lg"
            style={{ fontFamily: "var(--font-agbalumo)", fontWeight: "normal" }}
          >
            WagleWagle
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="메뉴 닫기"
          >
            {" "}
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 메뉴 아이템 */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-left w-full"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 드로어 하단 <div className="px-6 py-5 border-t border-white/10">
          <p className="text-white/20 text-xs">WagleWagle v1.0.0</p>
        </div> */}
      </div>
    </>
  );
}
/*
<SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
사이드바 열어주는 역할

*/

// ── Header ──────────────────────────────────────────────────────
export function Header() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  console.log("drawerOpen:", drawerOpen);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-[#0a0b1e]/90 backdrop-blur-md border-b border-white/5">
        {/* 홈 버튼 */}
        <button
          onClick={() => router.push("/home")}
          aria-label="홈으로 이동"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff3d71]/10 hover:bg-[#ff3d71]/20 transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
              stroke="#ff3d71"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 21V12h6v9"
              stroke="#ff3d71"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 로고 */}
        <h3
          className="text-white"
          style={{ fontFamily: "var(--font-agbalumo)", fontWeight: "normal" }}
        >
          WagleWagle
        </h3>

        {/* 햄버거 버튼 */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span className="w-4 h-[1.5px] bg-white/70 rounded-full" />
          <span className="w-4 h-[1.5px] bg-white/70 rounded-full" />
          <span className="w-2.5 h-[1.5px] bg-white/70 rounded-full self-start ml-[10px]" />
        </button>
      </header>
    </>
  );
}
