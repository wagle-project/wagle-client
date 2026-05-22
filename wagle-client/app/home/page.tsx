"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Header } from "@/app/components/festival/Header";
import { FriendWagleIntro } from "@/app/components/festival/FriendWagleIntro";
import { SearchBar } from "@/app/components/festival/SearchBar";
import { FestivalList } from "@/app/components/festival/FestivalList";
import { useFestivals } from "@/app/hooks/useFestivals";

import AdPopup from "../components/AdPopup";

export default function FestivalMapPage() {
  const router = useRouter();
  const { filtered, loading, error, inputValue, setInputValue, handleSearch } =
    useFestivals();

  // 팝업 상태 관리
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // 린트 에러(동기적 setState 호출 방지) 해결을 위해 setTimeout을 사용해 비동기로 처리합니다.
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const hideAdUntil = window.localStorage.getItem("hideWagleAdUntil");
          const now = new Date().getTime();

          // 저장된 데이터가 없거나, 현재 시간이 '안 보기' 설정 시간을 넘었다면 팝업 띄움
          if (!hideAdUntil || now > parseInt(hideAdUntil, 10)) {
            setShowAd(true);
          }
        }
      } catch (err) {
        console.error("로컬스토리지 접근 에러:", err);
        setShowAd(true);
      }
    }, 0); // 0ms 지연 (렌더링 직후 비동기로 바로 실행됨)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-[430px] mx-auto bg-[#0a0b1e] font-sans">
      <Header />

      <main className="flex-1 px-5 pb-8">
        <FriendWagleIntro />

        {/* 검색 */}
        <div className="mb-8">
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            onSearch={handleSearch}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-base">Festivals</h2>
          <span className="text-white/40 text-xs">
            총 {filtered.length}개의 축제
          </span>
        </div>

        <FestivalList
          festivals={filtered}
          loading={loading}
          error={error}
          onCardClick={(id) => router.push(`/festival/${id}`)}
        />
      </main>

      {/* 배경 글로우 */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-[#ff3d71]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-[#2bbdee]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* 광고 팝업 렌더링 */}
      {showAd && (
        <AdPopup
          onClose={() => setShowAd(false)}
          images={[
            "/images/ad.jpeg", // 첫 번째 사진
            "/images/ad1.jpeg",// 두 번째 사진
            "/images/ad2.png",
            "/images/ad3.png",
            "/images/ad4.png",
            "/images/ad5.png",
            "/images/ad6.jpg"
          ]}
        />
      )}
    </div>
  );
}
