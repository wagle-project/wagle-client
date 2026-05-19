"use client";

import { useEffect, useState } from "react";
import BoothMarker from "./BoothMarker";
import type { BoothInfo } from "../../types/booth";

export interface CollegeGroup {
  collegeName: string;
  booths: BoothInfo[];
}

interface BoothLayerProps {
  festivalId: number;
  activeCollege: string | null;
  selectedBoothNumber: number | null;
  onBoothSelect: (boothNumber: number | null) => void;
}

export default function BoothLayer({
  festivalId,
  activeCollege,
  selectedBoothNumber,
  onBoothSelect,
}: BoothLayerProps) {
  const [booths, setBooths] = useState<BoothInfo[]>([]);

  useEffect(() => {
    fetch("/booth.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.isSuccess) setBooths(data.result.content as BoothInfo[]);
      })
      .catch((err) => console.error("부스 목록 fetch 실패:", err));
  }, [festivalId]);

  return (
    <>
      {booths.map((booth) => (
        <BoothMarker
          key={booth.boothNumber}
          booth={booth}
          isSelected={selectedBoothNumber === booth.boothNumber}
          isCollegeActive={activeCollege === booth.college}
          onSelect={onBoothSelect}
        />
      ))}
    </>
  );
}
