export function FriendWagleIntro() {
  return (
    <div className="mt-6 mb-5 flex items-start gap-3">
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
        <img
          src="/images/friendwagle.png"
          alt="와글 ai 캐릭터"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-[#2bbdee] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
          Friend Wagle
        </p>
        <p className="text-white text-xl font-bold leading-tight">
          안녕! 어디로 떠날까?
        </p>
        <p className="text-white/40 text-xs mt-1 leading-relaxed text-right">
          Check how crowded the
          <br />
          festivals are before you
          <br />
          head out!
        </p>
      </div>
    </div>
  );
}
