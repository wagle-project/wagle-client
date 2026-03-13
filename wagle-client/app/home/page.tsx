"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/app/components/festival/Header";
import { FriendWagleIntro } from "@/app/components/festival/FriendWagleIntro";
import { SearchBar } from "@/app/components/festival/SearchBar";
import { FestivalList } from "@/app/components/festival/FestivalList";
import { useFestivals } from "@/app/hooks/useFestivals";

export default function FestivalMapPage() {
  const router = useRouter();
  const { filtered, loading, error, inputValue, setInputValue, handleSearch } =
    useFestivals();

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-[430px] mx-auto bg-[#0a0b1e] font-sans">
      <Header />

      <main className="flex-1  px-5 pb-8">
        <FriendWagleIntro />

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
    </div>
  );
}
