"use client";

import { useRouter } from "next/navigation";

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-[#0a0b1e] font-sans text-white">
      
      {/* ── 1. 상단 헤더 ── */}
      <header className="flex items-center justify-between px-5 h-20 shrink-0 bg-[#0a0b1e]">
        <button
          onClick={() => router.back()}
          className="text-[#E270CA] bg-transparent outline-none border-none p-2 -ml-2 transition-transform active:scale-95"
          aria-label="뒤로가기"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center gap-1.5 mt-1">
          <span className="text-white text-xl font-bold tracking-tight">About</span>
          <span className="text-white text-2xl tracking-wide" style={{ fontFamily: "var(--font-agbalumo)", fontWeight: "normal" }}>WagleWagle</span>
        </div>

        <div className="w-12 h-12"></div>
      </header>

      {/* ── 2. 메인 스크롤 콘텐츠 ── */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
        
        {/* 배너 카드 */}
        <section className="relative mt-4 mb-[80px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0a0b1e] p-7 shadow-xl shadow-black/50">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1.5 mb-6 text-[10px] font-bold tracking-wider text-[#2bbdee] bg-[#2bbdee]/10 rounded-full">
              FESTIVAL COMPANION
            </span>
            <h2 className="text-2xl font-bold leading-[1.5] mb-5 break-keep">
              축제, 이제 안전하고 <br />
              <span className="text-[#2bbdee]">편리하게</span> 즐기세요.
            </h2>
            <p className="text-xs text-white/50 leading-[2] max-w-[90%] break-keep">
              와글와글은 복잡한 인파 속에서도 당신의 즐거움과 안전을 최우선으로 생각합니다.
            </p>
          </div>
          <img 
            src="/icons/banner-megaphone.png" 
            alt="" 
            className="absolute top-2 right-2 w-32 h-32 opacity-20 pointer-events-none"
          />
        </section>

        {/* 왜 와글와글인가요? */}
        <section className="mb-[100px]">
          <h3 className="text-xl font-bold mb-8">왜 와글와글인가요?</h3>
          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center gap-6 p-[24px] rounded-[28px] bg-[#1a1f2e]">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <img src="/icons/icon-warning.png" alt="경고" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="text-[16px] font-bold mb-2">인파 밀집 사고 예방</h4>
                <p className="text-[13px] text-[#CBD5E1] leading-[1.6] break-keep">대학 축제, 빵 축제 등 대형 이벤트의 과밀집 위험을 실시간으로 감지합니다.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-[24px] rounded-[28px] bg-[#1a1f2e]">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <img src="/icons/icon-map.png" alt="지도" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="text-[16px] font-bold mb-2">불편한 종이 팜플렛</h4>
                <p className="text-[13px] text-[#CBD5E1] leading-[1.6] break-keep">더 이상 젖고 찢어지는 종이 지도는 필요 없습니다. 스마트폰 하나면 충분합니다.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-[24px] rounded-[28px] bg-[#1a1f2e]">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <img src="/icons/icon-medical.png" alt="응급" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="text-[16px] font-bold mb-2">응급 상황 및 시설 찾기</h4>
                <p className="text-[13px] text-[#CBD5E1] leading-[1.6] break-keep">가장 가까운 화장실, 의무실, 비상 출구를 단 몇 초만에 확인하세요.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 기능 가이드 */}
        <section className="mb-[100px] text-center">
          <h3 className="text-2xl font-bold mb-5">핵심 기능 가이드</h3>
          <p className="text-[12px] text-white/50 mb-14 break-keep max-w-[85%] mx-auto leading-[2]">즐거운 축제 관람을 위한! 와글와글이 준비한 3가지 핵심 기능을 지금 바로 만나보세요!</p>
          
          <div className="flex flex-col items-center gap-[60px]">
            <div className="flex flex-col items-center">
              <div className="mb-5">
                <img src="/icons/icon-crowd.png" alt="인파 맵" className="w-[100px] h-[100px] object-contain" />
              </div>
              <h4 className="text-[#2bbdee] text-lg font-bold mb-3">실시간 인파 맵</h4>
              <p className="text-[13px] text-white/60 break-keep leading-[1.8]">현재 축제 현장의 구역별 혼잡도를<br/>실시간 컬러 코드로 확인하세요.</p>
            </div>

            <div className="flex justify-center gap-10 w-full px-2">
              <div className="flex flex-col items-center">
                <div className="mb-5">
                  <img src="/icons/icon-location.png" alt="내 위치 가이드" className="w-[100px] h-[100px] object-contain" />
                </div>
                <h4 className="text-[#ff3d71] text-[15px] font-bold">내 위치 가이드</h4>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-5">
                  <img src="/icons/icon-pamphlet.png" alt="디지털 팜플렛" className="w-[100px] h-[100px] object-contain" />
                </div>
                <h4 className="text-[#00ff88] text-[15px] font-bold">디지털 팜플렛</h4>
              </div>
            </div>
          </div>
        </section>

        {/* ── Meet Our Wagle (간격 강제 적용) ── */}
        <section className="mb-[100px] flex flex-col items-center text-center">
          
          {/* 라벨: 하늘색 테두리 및 투명 배경 */}
          <div className="px-6 py-3 rounded-full border-2 border-[#2bbdee] w-[200px] bg-[#2bbdee]/10">
            <span className="font-bold text-[18px] tracking-wide text-white">Meet Our Wagle</span>
          </div>
          
          {/* 💡 1. 라벨과 글자 사이 간격: mt-[36px] 적용하여 위쪽으로 36px 띄움 */}
          <p className="mt-[36px] text-[13px] text-white/80 leading-[2] break-keep max-w-[85%]">
            와글와글이 당신의 안전한 축제 관람을 도와주며<br/>효율적으로 이동할 수 있도록 도와드려요!
          </p>
          
          {/* 💡 2. 글자와 카드 사이 간격: mt-[48px] 적용하여 위쪽으로 48px 띄움 */}
          <div className="mt-[48px] flex justify-center gap-[40px] w-full">
            <div className="flex flex-col items-center gap-6">
              <img src="/icons/face-crowded.png" alt="혼잡" className="w-[70px] h-[70px] object-contain" />
              <span className="text-[13px] text-[#ff3d71] font-bold">혼잡</span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <img src="/icons/face-normal.png" alt="보통" className="w-[70px] h-[70px] object-contain" />
              <span className="text-[13px] text-[#ffd700] font-bold">보통</span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <img src="/icons/face-safe.png" alt="안전" className="w-[70px] h-[70px] object-contain" />
              <span className="text-[13px] text-[#00ff88] font-bold">안전</span>
            </div>
          </div>
        </section>

        {/* 하단 CTA 버튼 */}
        <button 
          onClick={() => router.push('/home')}
          className="w-full h-[60px] bg-[#2bbdee] text-[#0a0b1e] text-[17px] font-medium rounded-[20px] shadow-[0_8px_24px_rgba(43,189,238,0.35)] active:scale-95 transition-transform"
        >
          지금 축제 둘러보기
        </button>

      </main>

      {/* 배경 장식 광원 */}
      <div className="fixed bottom-[-5%] right-[-10%] w-80 h-80 bg-[#2bbdee]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[10%] left-[-20%] w-64 h-64 bg-[#ff3d71]/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}