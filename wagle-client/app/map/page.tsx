import dynamic from "next/dynamic";

const FestivalMap = dynamic(() => import("@/components/map/FestivalMap"), {
  ssr: false, //csr 전용설정
});

export default function FestivalPage() {
  return <FestivalMap></FestivalMap>;
}
