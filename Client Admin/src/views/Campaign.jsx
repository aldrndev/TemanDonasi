import { useEffect, useState } from 'react';
import CampaignTable from '../components/CampaignTable';
import CampaignDetailModal from '../components/CampaignDetailModal';
import { useCampaignStore } from '../stores/store';

const Campaign = () => {
  const { campaigns, error, fetchCampaigns, loading, deleteCampaign } =
    useCampaignStore((state) => state);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setDetailModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleDeleteCampaign = async (id) => {
    await deleteCampaign(id);
    fetchCampaigns();
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <h2 className="text-2xl font-semibold leading-tight text-gray-600">
          Campaigns
        </h2>
        <div className="my-2 flex sm:flex-row flex-col"></div>
        <CampaignTable
          campaigns={campaigns}
          onDetail={handleOpenDetailModal}
          onDelete={handleDeleteCampaign}
        />

        {isDetailModalOpen && selectedCampaign && (
          <CampaignDetailModal
            campaign={selectedCampaign}
            onClose={handleCloseModals}
          />
        )}
      </div>
    </div>
  );
};

export default Campaign;
