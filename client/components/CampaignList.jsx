import React from 'react';
import CampaignCard from './CampaignCard';

const CampaignList = ({ campaigns }) => {
  // Sort campaigns by deadline in ascending order
  const sortedCampaigns = [...campaigns].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-white">
        Campaigns
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10">
        {sortedCampaigns.length > 0 ? (
          sortedCampaigns.map((campaign, index) => (
            <CampaignCard
              key={index}
              index={index}
              owner={campaign.owner}
              title={campaign.title}
              description={campaign.description}
              target={campaign.target}
              fundedAmount={campaign.fundedAmount}
              repaymentAmount={campaign.repaymentAmount}
              deadline={campaign.deadline}
              campaignType={campaign.campaignType}
              handleClick={() => console.log(`Viewing campaign: ${campaign.title}`)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No campaigns found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignList;
