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

  const menuItems = [{ label: "Company Info", path: "/info", icon: "ℹ️" }];

  return (
    <>
      {/* 딤 배경 */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={onClose}
        />
      )}

      {/* 드로어 패널 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 50,
          height: "100%",
          width: "75%",
          maxWidth: "300px",
          backgroundColor: "#0e0f24",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease-in-out",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {/* 드로어 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "between", // justify-content: space-between
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "18px",
              fontFamily: "var(--font-agbalumo)",
              fontWeight: "normal",
              margin: 0,
            }}
          >
            WagleWagle
          </h2>

          {/* 닫기 버튼 (X 아이콘 핑크색 변경) */}
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#FF80DF" // 핑크색 적용
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 메뉴 아이템 */}
        <nav
          style={{
            flex: 1,
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "left",
                width: "100%",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* 드로어 하단 */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p
            style={{
              color: "rgba(255, 255, 255, 0.2)",
              fontSize: "12px",
              margin: 0,
            }}
          >
            WagleWagle v1.0.0
          </p>
        </div>
      </div>
    </>
  );
}

// ── Header ──────────────────────────────────────────────────────
export function Header() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  console.log("drawerOpen:", drawerOpen);
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4  border-b ">
        {/* 홈 버튼 */}
        <button
          onClick={() => router.push("/home")}
          aria-label="홈으로 이동"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff3d71]/10 hover:bg-[#ff3d71]/20 transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
              stroke="#ff80DF"
              strokeWidth="2"
            />
            <path d="M9 21V12h6v9" strokeWidth="2" stroke="#ff80DF" />
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
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
            padding: "0",
          }}
          className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          {/* 첫 번째 선 */}
          <span
            style={{
              width: "16px",
              height: "2px",
              backgroundColor: "#FF80DF",
              borderRadius: "10px",
            }}
          />
          {/* 두 번째 선 */}
          <span
            style={{
              width: "16px",
              height: "2px",
              backgroundColor: "#FF80DF",
              borderRadius: "10px",
            }}
          />
          {/* 세 번째 선 (이미지처럼 조금 짧게 구성) */}
          <span
            style={{
              width: "16px",
              height: "2px",
              backgroundColor: "#FF80DF",
              borderRadius: "10px",
            }}
          />
        </button>
      </header>

      {/* ⭐ 드로어 */}
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
