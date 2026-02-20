import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";

import { mockCampaigns } from "../../features/campaigns/mockDatas";
import type { Campaign } from "../../features/campaigns/types";

type CampaignContextType = {
  campaigns: Campaign[];
  updateCampaignStatus: (id: number, status: "Active" | "Paused") => void;
};

const CampaignContext = createContext<CampaignContextType | null>(null);

export const CampaignProvider = ({ children }: PropsWithChildren) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  const updateCampaignStatus = (id: number, status: "Active" | "Paused") => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  };

  return (
    <CampaignContext.Provider value={{ campaigns, updateCampaignStatus }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error("useCampaigns must be used within CampaignProvider");
  }

  return context;
};
