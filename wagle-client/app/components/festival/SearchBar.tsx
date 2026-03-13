interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <div className="flex items-center flex-1 rounded-full border border-white/30 bg-white/30 backdrop-blur-md px-5 py-3.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="축제 이름을 검색해 보세요"
          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/60 focus:outline-none"
        />
      </div>

      <button
        onClick={onSearch}
        aria-label="검색"
        className="w-12 h-12 rounded-full border border-white/30 bg-white/30 backdrop-blur-md flex items-center justify-center flex-shrink-0 hover:bg-white/40 active:scale-95 transition-all"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path
            d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
