export interface SimulationResult {
  day: string;
  impressions: number;
  clicks: number;
  spend: number;
  remainingBudget: number;
}

export const runCampaignSimulation = async (
  budget: number,
): Promise<SimulationResult[]> => {
  const results: SimulationResult[] = [];
  let remainingBudget = budget;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  for (let i = 0; i < days.length; i++) {
    const impressions = Math.floor(Math.random() * 2000) + 1000;
    const clicks = Math.floor(impressions * (Math.random() * 0.1));
    const spend = Math.floor(Math.random() * 1000);

    remainingBudget -= spend;

    results.push({
      day: days[i],
      impressions,
      clicks,
      spend,
      remainingBudget: remainingBudget > 0 ? remainingBudget : 0,
    });

    if (remainingBudget <= 0) break;
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return results;
};
