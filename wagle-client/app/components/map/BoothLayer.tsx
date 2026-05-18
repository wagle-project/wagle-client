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
    // ⚠️ 복잡한 API 연결 대신, public 폴더에 있는 booth.json을 바로 불러옵니다 (하드코딩 방식)
    fetch("/booth.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) {
          const content: BoothInfo[] = data.result.content;
          setBooths(content);
        }
      })
      .catch((err) => console.error("부스 목록 fetch 실패:", err));
  }, []);

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