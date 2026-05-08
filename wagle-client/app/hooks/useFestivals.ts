import { useState, useEffect } from "react";
import { Festival } from "@/app/types/festival";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function fetchRecommended(): Promise<Festival[]> {
  const res = await fetch(`${BASE_URL}/api/v1/festivals/recommendations`);
  const data = await res.json();
  if (!data.isSuccess) throw new Error(data.message);
  return data.result.content;
}

async function fetchByKeyword(keyword: string): Promise<Festival[]> {
  const res = await fetch(
    `${BASE_URL}/api/v1/festivals?keyword=${encodeURIComponent(keyword)}`,
  );
  const data = await res.json();
  if (!data.isSuccess) throw new Error(data.message);
  return data.result.content;
}

export function useFestivals() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchRecommended()
      .then(setFestivals)
      .catch(() => setError("축제 정보를 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchByKeyword(inputValue);
      setFestivals(result);
    } catch {
      setError("검색 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return {
    filtered: festivals,
    loading,
    error,
    inputValue,
    setInputValue,
    handleSearch,
  };
}
