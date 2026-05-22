"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Header } from "@/app/components/festival/Header";
import { FriendWagleIntro } from "@/app/components/festival/FriendWagleIntro";
import { SearchBar } from "@/app/components/festival/SearchBar";
import { FestivalList } from "@/app/components/festival/FestivalList";
import { useFestivals } from "@/app/hooks/useFestivals";

import AdPopup from "../components/AdPopup";
import NoticePopup from "../components/NoticePopup"; // 공지 팝업 import

export default function FestivalMapPage() {
  const router = useRouter();
  const { filtered, loading, error, inputValue, setInputValue, handleSearch } =
    useFestivals();

  // 팝업 상태 관리
  const [showNotice, setShowNotice] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [pendingAd, setPendingAd] = useState(false); // 공지가 닫힌 후 띄울 광고 대기 상태

  useEffect(() => {
    // 린트 에러(동기적 setState 호출 방지) 해결을 위해 setTimeout을 사용해 비동기로 처리합니다.
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const now = new Date().getTime();

          // 1. 공지 팝업(Notice) 로컬스토리지 확인
          const hideNoticeUntil = window.localStorage.getItem("hideNoticePopupExpiry");
          const shouldShowNotice = !hideNoticeUntil || now > new Date(hideNoticeUntil).getTime();

          // 2. 광고 팝업(Ad) 로컬스토리지 확인
          const hideAdUntil = window.localStorage.getItem("hideWagleAdUntil");
          const shouldShowAd = !hideAdUntil || now > parseInt(hideAdUntil, 10);

          // 3. 순서대로 띄우기 로직
          if (shouldShowNotice) {
            setShowNotice(true); // 공지를 먼저 띄움
            if (shouldShowAd) {
              setPendingAd(true); // 광고도 띄워야 한다면 대기열에 넣어둠
            }
          } else if (shouldShowAd) {
            setShowAd(true); // 공지를 안 띄워도 되면 광고를 바로 띄움
          }
        }
      } catch (err) {
        console.error("로컬스토리지 접근 에러:", err);
        // 에러 시 기본적으로 다 띄우도록 설정
        setShowNotice(true);
        setPendingAd(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 공지 팝업 단순히 닫을 때
  const handleCloseNotice = () => {
    setShowNotice(false);
    if (pendingAd) {
      setShowAd(true); // 대기 중인 광고가 있으면 이제 띄움
      setPendingAd(false);
    }
  };

  // 공지 팝업 '오늘 하루 보지 않기' 눌렀을 때
  const handleHideNoticeToday = () => {
    const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    window.localStorage.setItem("hideNoticePopupExpiry", expiryDate.toISOString());
    handleCloseNotice(); // 닫기 로직 동일하게 실행 (광고 띄우기)
  };

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

      {/* 1. 공지 팝업 렌더링 */}
      {showNotice && (
        <NoticePopup 
          onClose={handleCloseNotice} 
          onHideToday={handleHideNoticeToday} 
        />
      )}

      {/* 2. 광고 팝업 렌더링 */}
      {showAd && (
        <AdPopup
          onClose={() => setShowAd(false)}
          images={[
            "/images/ad.jpeg",
            "/images/ad1.jpeg",
            "/images/ad2.png",
            "/images/ad7.jpg",
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
