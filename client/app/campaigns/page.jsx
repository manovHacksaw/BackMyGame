"use client";
import { useState } from "react";
import { ethers } from "ethers";
import WalletInfo from "@/components/WalletInfo";
import { usePlaiaZone } from "@/context/PlaiaZone";
import CampaignCard from "@/components/CampaignCard";
import ConnectWallet from "@/components/ConnectWallet";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CampaignListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { campaigns, account, connectWallet, balance, loading } =
    usePlaiaZone();
  const router = useRouter();

 

  const parseCampaignData = (campaign, index) => {
    return {
      index,
      owner: campaign[0],
      title: campaign[1],
      description: campaign[2],
      target: ethers.formatUnits(campaign[3]).toString(),
      repaymentAmount: ethers.formatUnits(campaign[4]).toString(),
      deadline: new Date(Number(campaign[5]) * 1000).toLocaleDateString(),
      campaignType: campaign[7] === 1n ? "Loan" : "Donation",
    };
  };

  const parsedCampaigns = campaigns.map(parseCampaignData).reverse();

  const filteredCampaigns = parsedCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="min-h-screen">
      <div className="py-6 px-4 sm:py-10 sm:px-6">
        {/* Top section with Search bar and Wallet Info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 w-full">
          {/* Left: Plaia Zone header */}
          <div onClick={()=>{router.push("/")}} className="text-2xl cursor-pointer hidden lg:block font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
            BackMyGame
          </div>

          {/* Right: Search bar and Campaign button */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full max-w-2xl justify-end">
  <input
    type="text"
    placeholder="Search campaigns by title..."
    className="w-full sm:w-1/2 px-2 sm:px-4 py-2 sm:py-4 rounded-lg bg-white text-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500 focus:outline-none transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
    value={searchTerm}
    onChange={handleSearch}
  />

  {account ? (
    <button
      onClick={() => {
        router.push("/request");
      }}
      className="w-[200px] sm:w-auto px-3 sm:px-4 py-3 mt-3 sm:mt-0 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-200 ease-in-out"
    >
      Create Your Own Campaign
    </button>
  ) : (
    <ConnectWallet loading={false} />
  )}
</div>

        </div>

        <div className="px-2 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
  {loading ? (
    <div className="flex justify-center items-center col-span-full h-[400px]">
      <Image
        src="/headerGIF.gif"
        className="dark:invert"
        width={300}
        height={300}
        alt="Loading..."
      />
    </div>
  ) : filteredCampaigns.length > 0 ? (
    filteredCampaigns.map((campaign) => (
      <CampaignCard key={campaign.index} {...campaign} />
    ))
  ) : (
    <p className="text-center text-gray-500 dark:text-gray-400 w-full col-span-full">
      No campaigns found.
    </p>
  )}
</div>
      </div>
    </div>
  );
};

export default CampaignListPage;
