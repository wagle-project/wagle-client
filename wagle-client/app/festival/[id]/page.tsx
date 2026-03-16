'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import { useFestivals } from '@/app/hooks/useFestivals';

interface TimetableItem {
  mapImageUrl: string;
  sequence: number;
}

interface TimetableResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    content: TimetableItem[];
    totalElements: number;
  };
}

export default function FestivalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const festivalId = params.id as string;

  const { filtered } = useFestivals();

  const festivalName = useMemo(() => {
    const found = filtered.find((f) => f.id === Number(festivalId));
    return found ? found.name : '축제 정보';
  }, [filtered, festivalId]);

  const [timetables, setTimetables] = useState<TimetableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'timetable' | 'map'>('timetable');

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await fetch(`/festivals/${festivalId}/timetables`);
        if (!response.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');
        const data: TimetableResponse = await response.json();

        if (data.isSuccess) {
          const sortedTimetables = data.result.content.sort(
            (a, b) => a.sequence - b.sequence
          );
          setTimetables(sortedTimetables);
        }
      } catch (error) {
        console.error('타임테이블을 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (festivalId) fetchTimetables();
  }, [festivalId]);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[430px] mx-auto bg-[#111827] text-white">
      
      {/* 상단 헤더 (네온 핑크 & 중앙 정렬 유지) */}
      <header className="relative flex items-center justify-between px-6 mt-8 mb-4 h-14 shrink-0">
        <button 
          onClick={() => router.back()} 
          className="text-[#FF5AEB] bg-transparent outline-none p-2 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] font-bold whitespace-nowrap z-0">
          {festivalName}
        </h1>
        
        <Link 
          href="/home" 
          className="text-[#FF5AEB] bg-transparent outline-none p-2 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center w-full pb-20">
        {isLoading ? (
          <div className="text-gray-400">타임테이블을 불러오는 중...</div>
        ) : timetables.length > 0 ? (
          <div className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-5 scrollbar-hide">
            {timetables.map((item) => (
              <div key={item.sequence} className="snap-center shrink-0 w-full flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.mapImageUrl} 
                  alt={`타임테이블 ${item.sequence}`} 
                  className="w-full max-w-sm rounded-lg object-contain bg-white"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">등록된 타임테이블이 없습니다.</div>
        )}
      </main>

      <div className="sticky bottom-10 w-full px-6 flex gap-3 z-50 mb-8">
        <button 
          onClick={() => setActiveTab('timetable')}
          className={`flex-1 h-[48px] rounded-[16px] text-[14px] flex items-center justify-center gap-1.5 transition-all duration-300 shadow-lg ${
            activeTab === 'timetable' 
              ? 'bg-[#2bbdee] text-[#0a0b1e] font-bold shadow-[0_0_15px_rgba(43,189,238,0.35)]' 
              : 'border border-[#1FB4A7] text-[#1FB4A7] bg-[#111827] font-medium'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[14px] h-[14px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          타임테이블 확인
        </button>
        
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex-1 h-[48px] rounded-[16px] text-[14px] flex items-center justify-center gap-1.5 transition-all duration-300 shadow-lg ${
            activeTab === 'map' 
              ? 'bg-[#2bbdee] text-[#0a0b1e] font-bold shadow-[0_0_15px_rgba(43,189,238,0.35)]' 
              : 'border border-[#1FB4A7] text-[#1FB4A7] bg-[#111827] font-medium'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[14px] h-[14px]">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          행사장 지도 보기
        </button>
      </div>
      
    </div>
  );
}