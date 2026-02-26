import { Festival } from "@/app/types/festival";
import { FestivalCard } from "./FestivalCard";

interface FestivalListProps {
  festivals: Festival[];
  loading: boolean;
  error: string | null;
  onCardClick: (id: number) => void;
}

function SkeletonCard() {
  return (
    <div className="w-full h-[280px] rounded-2xl bg-white/5 animate-pulse" />
  );
}

export function FestivalList({
  festivals,
  loading,
  error,
  onCardClick,
}: FestivalListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (festivals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <span className="text-4xl mb-4">🔍</span>
        <p className="text-sm">검색 결과가 없어요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {festivals.map((festival) => (
        <FestivalCard
          key={festival.id}
          festival={festival}
          onClick={() => onCardClick(festival.id)}
        />
      ))}
    </div>
  );
}
