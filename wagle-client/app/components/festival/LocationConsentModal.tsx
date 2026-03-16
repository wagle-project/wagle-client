'use client';

import React from 'react';

// 컴포넌트에 넘겨줄 속성(Props) 정의
interface LocationConsentModalProps {
  isOpen: boolean;    // 모달이 열려있는지 여부
  onClose: () => void; // 닫기 버튼이나 '나중에 하기'를 눌렀을 때 실행될 함수
}

export default function LocationConsentModal({ isOpen, onClose }: LocationConsentModalProps) {
  // 모달이 닫혀있으면 아무것도 그리지 않습니다.
  if (!isOpen) return null;

  return (
    // 💡 화면 전체를 덮는 어두운 반투명 배경 (z-index를 높게 설정)
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/70 backdrop-blur-sm">
      
      {/* 💡 디자인 시안의 모바일 사이즈(약 430px)에 맞춘 실제 모달 콘텐츠 영역 */}
      <div className="relative w-full max-w-[430px] h-full bg-[#111827] flex flex-col items-center p-6 animate-in fade-in zoom-in duration-200">
        
        {/* 상단 헤더 영역 (로고와 닫기 버튼) */}
        <div className="w-full flex items-center justify-between mt-8 mb-16">
          <div className="w-6" /> {/* 가운데 정렬을 위한 빈 공간 */}
          
          {/* 💡 네온 핑크 & 블루 로고: WAGLEWAGLE */}
          <h2 className="text-sm font-black tracking-widest text-center">
            <span className="text-[#FF5AEB]">WAGLE</span>
            <span className="text-[#2bbdee]">WAGLE</span>
          </h2>
          
          {/* 💡 핑크색 X 닫기 버튼 */}
          <button onClick={onClose} className="text-[#FF5AEB] p-1 hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* 💡 중앙 그라데이션 캐릭터 영역 */}
        <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-[#73e8ff] to-[#2bbdee] shadow-[0_0_50px_rgba(43,189,238,0.5)] flex items-center justify-center mb-12">
          {/* 💡 시안 특유의 겹쳐진 반투명 효과를 위한 요소 */}
          <div className="absolute inset-0 bg-white/10 rounded-[40%] transform -rotate-12 pointer-events-none" />
          
          {/* 💡 무표정한 캐릭터 표정 (._.) */}
          <div className="flex items-end gap-3 mb-4 z-10">
            <div className="w-3 h-3 bg-[#111827] rounded-full" /> {/* 왼쪽 눈 */}
            <div className="w-5 h-1.5 bg-[#111827] rounded-full mb-1" /> {/* 입 */}
            <div className="w-3 h-3 bg-[#111827] rounded-full" /> {/* 오른쪽 눈 */}
          </div>
        </div>

        {/* 💡 텍스트 영역: 시안 문구 그대로 사용 */}
        <h1 className="text-2xl font-bold text-white mb-4">
          위치 정보 수집 동의
        </h1>
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-auto">
          위치 정보에 동의해야지<br />
          혼잡도 페이지에 접근할 수 있습니다
        </p>

        {/* 💡 하단 버튼 영역 */}
        <div className="w-full flex flex-col gap-4 mb-12">
          {/* 동의하고 시작하기 (그라데이션 및 네온 효과) */}
          <button 
            onClick={onClose} // 나중에 실제 동의 로직으로 교체
            className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-[#0a0b1e] text-[16px] font-bold shadow-[0_0_25px_rgba(43,189,238,0.4)] transition-transform active:scale-[0.98] hover:opacity-95"
          >
            동의하고 시작하기
          </button>
          
          {/* 나중에 하기 (회색 텍스트 버튼) */}
          <button 
            onClick={onClose}
            className="w-full h-[48px] text-gray-500 text-[15px] font-medium hover:text-gray-300 transition-colors"
          >
            나중에 하기
          </button>
        </div>

      </div>
    </div>
  );
}