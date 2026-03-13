import { useState, useEffect, useMemo } from "react";
import { Festival } from "@/app/types/festival";
import { DUMMY_FESTIVALS } from "@/app/constants/festivals";

// 추후 API 연결 시 이 함수만 교체하면 됩니다
async function fetchFestivals(): Promise<Festival[]> {
  // TODO: return await fetch("/api/festivals").then((r) => r.json());
  return new Promise((resolve) =>
    setTimeout(() => resolve(DUMMY_FESTIVALS), 600),
  );
}

export function useFestivals() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchFestivals()
      .then(setFestivals)
      .catch(() => setError("축제 정보를 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => festivals.filter((f) => f.name.includes(searchQuery)),
    [festivals, searchQuery],
  );

  const handleSearch = () => setSearchQuery(inputValue);

  return {
    filtered,
    loading,
    error,
    inputValue,
    setInputValue,
    handleSearch,
  };
}
