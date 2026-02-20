export type PerformanceMetric = {
  date: string;
  clicks: number;
  impressions: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPerformanceData = async (): Promise<PerformanceMetric[]> => {
  await delay(1000);

  return [
    { date: "Mon", clicks: 120, impressions: 1000 },
    { date: "Tue", clicks: 200, impressions: 1500 },
    { date: "Wed", clicks: 150, impressions: 1300 },
    { date: "Thu", clicks: 300, impressions: 2000 },
    { date: "Fri", clicks: 250, impressions: 1700 },
  ];
};
