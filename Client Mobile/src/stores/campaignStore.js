import { create } from "zustand";

const useCampaignStore = create((set) => ({
  campaigns: [],
  setCampaigns: (data) => set((state) => ({ campaigns: data })),

  campaign: {},
  setCampaign: (data) => set((state) => ({ campaign: data })),
}));

export default useCampaignStore;
