export type FestivalStatus = "ONGOING" | "UPCOMING" | "END";

export interface Festival {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: FestivalStatus;
}
