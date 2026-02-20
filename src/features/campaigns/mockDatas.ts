export interface Campaign {
  id: number;
  name: string;
  budget: number;
  status: "Active" | "Paused";
}

export const mockCampaigns: Campaign[] = [
  { id: 1, name: "Summer Sale", budget: 5000, status: "Active" },
  { id: 2, name: "Winter Ads", budget: 3000, status: "Paused" },
  { id: 3, name: "Black Friday", budget: 8000, status: "Active" },
  { id: 4, name: "Diwali Promo", budget: 6000, status: "Paused" },
  { id: 5, name: "New Year Blast", budget: 7000, status: "Active" },
];
