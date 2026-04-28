"use client";

import dynamic from "next/dynamic";

const FestivalMap = dynamic(() => import("@/app/components/map/FestivalMap"), {
  ssr: false,
});

export default function FestivalPage() {
  return <FestivalMap festivalId={1} />;
}
