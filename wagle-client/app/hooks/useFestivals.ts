import { useState, useEffect } from "react";
import { Festival } from "@/app/types/festival";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// API 호출 함수들

// 1.추천 축제 불러오기
async function fetchRecommended(): Promise<Festival[]> {
  const res = await fetch(`${BASE_URL}/festivals/recommendations`);
  const data = await res.json();
  //에러
  if (!data.isSuccess) throw new Error(data.message);
  //응답구조 : { result: { content: Festival[] } }
  return data.result.content;
}
// 2.키워드로 축제 검색
async function fetchByKeyword(keyword: string): Promise<Festival[]> {
  const res = await fetch(
    `${BASE_URL}/festivals?keyword=${encodeURIComponent(keyword)}`,
  );
  const data = await res.json();
  //에러
  if (!data.isSuccess) throw new Error(data.message);
  //응답구조
  return data.result.content;
}

//축제 데이터를 관리하는 커스텀 훅 : 검색,축제 데이터
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
    // 공백만 입력한 경우 검색 안 함
    if (!inputValue.trim()) return;
    setLoading(true);
    setError(null);
    // 검색 API 호출
    try {
      const result = await fetchByKeyword(inputValue);
      setFestivals(result);
    } catch {
      setError("검색 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  //필요한 값 반환 시켜줌
  return {
    filtered: festivals,
    loading,
    error,
    inputValue,
    setInputValue,
    handleSearch,
  };
}
