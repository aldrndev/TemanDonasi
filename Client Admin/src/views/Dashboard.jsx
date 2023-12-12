import { useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import { useCampaignStore, useUserStore } from "../stores/store";

const Dashboard = () => {
  const { users, fetchUsers } = useUserStore((state) => state);
  const { campaigns, fetchCampaigns } = useCampaignStore((state) => state);

  const activeCampaign = campaigns.filter((campaign) => {
    const expiration = new Date(campaign.expirationDate);
    const now = new Date();
    return expiration > now;
  });

  const inActiveCampaign = campaigns.filter((campaign) => {
    const expiration = new Date(campaign.expirationDate);
    const now = new Date();
    return expiration < now;
  });
  const completedCampaign = campaigns.filter((campaign) => {
    const goal = campaign.goal;
    const progress = campaign.progress;
    return progress >= goal;
  });
  const unfinishedCampaign = campaigns.filter((campaign) => {
    const goal = campaign.goal;
    const progress = campaign.progress;
    return progress < goal;
  });
  console.log(campaigns);
  useEffect(() => {
    fetchUsers();
    fetchCampaigns();
  }, []);

  return (
    <div>
      <main className="p-8">
        <h2 className="text-2xl font-semibold leading-tight mb-4 text-gray-600">
          Dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Active Campaigns"
            count={activeCampaign.length}
          />
          <DashboardCard
            title="Inactive Campaigns"
            count={inActiveCampaign.length}
          />
          <DashboardCard title="Total Users" count={users.length} />
          <DashboardCard
            title="Completed Campaigns"
            count={completedCampaign.length}
          />
          <DashboardCard
            title="Unfinished Campaigns"
            count={unfinishedCampaign.length}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
