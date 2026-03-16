"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface FestivalDetail {
  id: number;
  name: string;
  description: string;
  posterUrl: string;
  startDate: string;
  endDate: string;
  placeName: string;
  address: string;
}

interface TimetableItem {
  imageUrl: string;
  sequence: number;
}

// 지도 정보를 담을 인터페이스 추가
interface FestivalMapInfo {
  mapImageUrl: string;
  sequence: number;
}

export default function FestivalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const festivalId = params.id as string;

  const [activeTab, setActiveTab] = useState<'info' | 'timetable' | 'map'>('info');
  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [timetables, setTimetables] = useState<TimetableItem[]>([]);
  const [maps, setMaps] = useState<FestivalMapInfo[]>([]); 
  const [isDetailLoading, setIsDetailLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsDetailLoading(true);
      const baseUrl = "https://wagle-wagle.my-project.cloud/api/v1";

      try {
        // 1. 축제 상세 정보 조회
        const detailRes = await fetch(`${baseUrl}/festivals/${festivalId}`);
        if (!detailRes.ok) throw new Error("Server Down");
        const detailData = await detailRes.json();
        if (detailData.isSuccess) setFestival(detailData.result);

        // 2. 타임테이블 조회
        const timetableRes = await fetch(`${baseUrl}/festivals/${festivalId}/timetables`);
        if (timetableRes.ok) {
          const timetableData = await timetableRes.json();
          if (timetableData.isSuccess) setTimetables(timetableData.result.content);
        }

        // 3. 지도 정보 조회
        const mapRes = await fetch(`${baseUrl}/festivals/${festivalId}/maps`);
        if (mapRes.ok) {
          const mapData = await mapRes.json();
          if (mapData.isSuccess) setMaps(mapData.result.content);
        }

      } catch (error) {
        console.warn("백엔드 연결 실패! 더미 데이터를 표시합니다.");
        // 💡 서버 연결 실패 시 나타날 더미 데이터 (디자인 확인용)
        setFestival({
          id: 1,
          name: "2026 김천 김밥 축제",
          description: "2026년 가을, 김천에서 펼쳐지는 특별한 미식 여행! '김천 김밥 축제'는 지역 특산물을 활용한 창의적인 김밥부터 전국의 숨은 김밥 맛집들이 한자리에 모이는 국내 유일의 김밥 테마 축제입니다.",
          posterUrl: "https://images.unsplash.com/photo-1628191140046-13a854dc694a?q=80&w=800&auto=format&fit=crop", 
          startDate: "2025-10-15T08:00:00",
          endDate: "2025-10-18T22:00:00",
          placeName: "김천 사명대사공원",
          address: "경상북도 김천시 대항면"
        });
        setTimetables([]); 
      } finally {
        setIsDetailLoading(false);
      }
    };

    if (festivalId) fetchAllData();
  }, [festivalId]);

  const getFormattedDate = (start: string, end: string) => {
    if (!start || !end) return { dateStr: "", days: 0 };
    const s = new Date(start);
    const e = new Date(end);
    const startFormat = `${s.getFullYear()}.${String(s.getMonth() + 1).padStart(2, "0")}.${String(s.getDate()).padStart(2, "0")}`;
    const endFormat = `${String(e.getMonth() + 1).padStart(2, "0")}.${String(e.getDate()).padStart(2, "0")}`;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return { dateStr: `${startFormat} - ${endFormat}`, days: diffDays };
  };

  const handleBack = () => {
    if (activeTab !== 'info') setActiveTab('info');
    else router.back();
  };

  const handleTabToggle = (tab: 'timetable' | 'map') => {
    if (activeTab === tab) setActiveTab('info');
    else setActiveTab(tab);
  };

  if (isDetailLoading) {
    return (
      <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-[#0f111a] items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2bbdee] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { dateStr, days } = getFormattedDate(festival?.startDate || "", festival?.endDate || "");

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-[#0f111a] font-sans text-white overflow-hidden">
      
      <header className="flex-shrink-0 flex items-center justify-between px-5 h-16 bg-[#0f111a] z-20">
        <button onClick={handleBack} className="text-[#E270CA] bg-transparent outline-none border-none p-2 -ml-2 transition-transform active:scale-95">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-white text-[16px] font-bold truncate">
          {festival?.name || "축제 정보"}
        </h1>
        <Link href="/home" className="text-[#E270CA] bg-transparent outline-none border-none p-2 -mr-2 transition-transform active:scale-95">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide w-full relative">
        {activeTab === 'info' && festival && (
          <div className="animate-fadeIn w-full flex flex-col pb-[80px]">
            <div className="w-full aspect-[4/5] relative bg-[#1a1f35]">
              <img src={festival.posterUrl} alt={`${festival.name} 포스터`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0f111a] to-transparent"></div>
            </div>

            <div className="flex flex-col" style={{ paddingLeft: '28px', paddingRight: '28px', marginTop: '60px', gap: '30px' }}>
              <div className="flex items-center bg-[#1a1f2e]" style={{ padding: '24px 30px', borderRadius: '28px', gap: '24px' }}>
                <img src="/icons/icon-calendar.png" alt="달력" style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }} />
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <h3 className="text-[19px] font-bold text-white leading-none">{dateStr}</h3>
                  <p className="text-[15px] text-[#CBD5E1] leading-none">축제 기간 ({days}일간)</p>
                </div>
              </div>

              <div className="flex items-center bg-[#1a1f2e]" style={{ padding: '24px 30px', borderRadius: '28px', gap: '24px' }}>
                <img src="/icons/icon-pin.png" alt="위치" style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }} />
                <div className="flex flex-col overflow-hidden" style={{ gap: '8px' }}>
                  <h3 className="text-[19px] font-bold text-white leading-none truncate">{festival.placeName}</h3>
                  <p className="text-[15px] text-[#CBD5E1] leading-none truncate">{festival.address}</p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col" style={{ paddingLeft: '28px', paddingRight: '28px', marginTop: '80px' }}>
              <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
                <div className="bg-[#2EFAD9] rounded-full" style={{ width: '4px', height: '22px' }}></div>
                <h2 className="text-[20px] font-bold text-white leading-none">축제 소개</h2>
              </div>
              <p className="text-[15px] text-[#CBD5E1] leading-[1.8] break-keep">
                {festival.description}
              </p>
            </div>
          </div>
        )}

        {/* ── 타임테이블 화면 ── */}
        {activeTab === 'timetable' && (
          <div className="flex flex-col items-center animate-fadeIn w-full px-5 py-10 pb-[100px]">
            {timetables.length > 0 ? (
              timetables.map((t, i) => <img key={i} src={t.imageUrl} className="w-full rounded-2xl mb-4" />)
            ) : (
              <p className="font-medium text-[15px] mt-20">등록된 타임테이블이 없습니다.</p>
            )}
          </div>
        )}

        {/* ── 행사장 지도 화면 ── */}
        {activeTab === 'map' && (
          <div className="flex flex-col items-center animate-fadeIn w-full px-5 py-10 pb-[100px]">
            {maps.length > 0 ? (
              maps.map((m, i) => <img key={i} src={m.mapImageUrl} className="w-full rounded-2xl mb-4" />)
            ) : (
              <p className="font-medium text-[15px] mt-20">등록된 행사장 지도가 없습니다.</p>
            )}
          </div>
        )}
      </main>

      <div className="flex-shrink-0 w-full px-5 pb-8 pt-4 bg-[#0f111a] z-20 border-t border-white/5">
        <div className="flex gap-3">
          <button
            onClick={() => handleTabToggle('timetable')}
            className={`flex-1 h-[52px] rounded-full text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'timetable' ? 'bg-[#2bbdee] text-[#0f111a] font-bold' : 'border border-[#2EFAD9] text-[#2EFAD9] bg-[#0f111a] font-medium'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[16px] h-[16px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            타임테이블 확인
          </button>
          
          <button
            onClick={() => handleTabToggle('map')}
            className={`flex-1 h-[52px] rounded-full text-[14px] flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'map' ? 'bg-[#2bbdee] text-[#0f111a] font-bold' : 'border border-[#2EFAD9] text-[#2EFAD9] bg-[#0f111a] font-medium'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[16px] h-[16px]">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            행사장 지도 보기
          </button>
        </div>
      </div>
    </div>
  );
}