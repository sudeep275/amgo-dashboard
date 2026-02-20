const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldFail = () => Math.random() < 0.2;

export const updateCampaignStatus = async (
  _id: number,
  _newStatus: "Active" | "Paused",
): Promise<void> => {
  await delay(1000);

  if (shouldFail()) {
    throw new Error("Failed to update campaign.");
  }

  return;
};
