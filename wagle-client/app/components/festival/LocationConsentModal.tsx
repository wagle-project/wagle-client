'use client';

import React, { useEffect } from 'react';

interface LocationConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void; // 동의 버튼 전용 콜백
}

export default function LocationConsentModal({ isOpen, onClose, onAgree }: LocationConsentModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-full max-w-[430px] left-1/2 -translate-x-1/2 h-[100dvh] bg-[#0f111a] flex flex-col animate-in fade-in duration-200">
      
      {/* 상단 헤더 */}
      <div className="flex items-center w-full h-16 px-5 shrink-0" style={{ marginTop: '40px' }}>
        <div className="w-[38px]" />
        <img
          src="/images/wagle%20logo.png"
          alt="WAGLE WAGLE"
          className="flex-1 h-[14px] object-contain"
        />
        <button
          onClick={onClose}
          className="w-[38px] flex items-center justify-end text-[#FF5AEB] hover:opacity-80 transition-opacity bg-transparent outline-none border-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* 중앙 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 w-full">
        <img
          src="/images/blue.png"
          alt="물방울 캐릭터"
          className="w-[180px] h-[180px] object-contain drop-shadow-[0_0_40px_rgba(43,189,238,0.25)]"
          style={{ marginBottom: '50px' }}
        />
        <h1 className="text-[22px] font-bold text-white" style={{ marginBottom: '16px' }}>
          위치 정보 수집 동의
        </h1>
        <p className="text-[#CBD5E1] text-[15px] text-center leading-[1.6]">
          위치 정보에 동의해야지<br />
          혼잡도 페이지에 접근할 수 있습니다
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="w-full px-5 pb-8 shrink-0 flex flex-col gap-3">
        {/* 동의 버튼 → onAgree 호출 */}
        <button
          onClick={onAgree}
          className="w-full h-[54px] rounded-[14px] bg-[#2bbdee] text-[#0f111a] text-[16px] font-bold transition-transform active:scale-[0.98]"
        >
          동의하고 시작하기
        </button>
        {/* 나중에 하기 → onClose 호출 */}
        <button
          onClick={onClose}
          className="w-full h-[48px] text-[#64748b] text-[14px] font-medium hover:text-white transition-colors bg-transparent outline-none border-none"
        >
          나중에 하기
        </button>
      </div>

    </div>
  );
}
