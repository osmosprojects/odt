export const reportStatCards: {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
}[] = [
  { label: "Total Offers", value: "128" },
  { label: "Active Offers", value: "36" },
  { label: "Total Sales", value: "₹8.4 Cr", change: "+12.5%", changeType: "up" },
  { label: "Total Volume", value: "42 KL", change: "+6.2%", changeType: "up" },
];

export const offerPerformance: { month: string; value: number }[] = [
  { month: "Dec", value: 24 },
  { month: "Jan", value: 27 },
  { month: "Feb", value: 27 },
  { month: "Mar", value: 21 },
  { month: "Apr", value: 27 },
  { month: "May", value: 30 },
  { month: "Jun", value: 30 },
  { month: "Jul", value: 30 },
];

export const topOffersByVolume: { label: string; value: number; color: string }[] = [
  { label: "SUM-2024-05", value: 18, color: "#0A7D3E" },
  { label: "DIST-2024-03", value: 12, color: "#34A853" },
  { label: "FEST-2024-02", value: 8, color: "#86D3A5" },
  { label: "Others", value: 4, color: "#9CA3AF" },
];

export const totalVolumeKL = 42;
