"use client";

import { useEffect, useState } from "react";
import BoothMarker from "./BoothMarker";
import type { BoothInfo } from "../../types/booth";

interface BoothLayerProps {
  festivalId: number;
}

export default function BoothLayer({ festivalId }: BoothLayerProps) {
  const [booths, setBooths] = useState<BoothInfo[]>([]);
  const [selectedBoothNumber, setSelectedBoothNumber] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // ⚠️ 아직 백엔드 API 미완성 → 임시 주소 사용 (완성되면 실제 엔드포인트로 교체)
    fetch(`${baseUrl}/festivals/${festivalId}/booths`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) {
          const content: BoothInfo[] = data.result.content;
          setBooths(content);
        }
      })
      .catch((err) => console.error("부스 목록 fetch 실패:", err));
  }, [festivalId]);

  const handleSelect = (boothNumber: number | null) => {
    setSelectedBoothNumber(boothNumber);
  };

  return (
    <>
      {booths.map((booth) => (
        <BoothMarker
          key={booth.boothNumber}
          booth={booth}
          isSelected={selectedBoothNumber === booth.boothNumber}
          onSelect={handleSelect}
        />
      ))}
    </>
  );
}
