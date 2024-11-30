"use client";
import FundCampaignDialog from "@/components/FundCampaignDialog";
import MetaMaskLoader from "@/components/MetaMaskLoader";
import Skeleton from "@/components/Skeleton"; // Import the Skeleton component
import { usePlaiaZone } from "@/context/PlaiaZone";
import { useState, useEffect } from "react";

const BackCampaignPage = ({ params }) => {
  const {
    getCampaignById,
    getRemainingAmount,
    isCampaignFullyFunded,
    withdrawFunds,
    account,
    getBackersByCampaignId,
    repayLoan,
    loading,
  } = usePlaiaZone();

  const { connectWallet } = usePlaiaZone();

  const [campaign, setCampaign] = useState(null);
  const [fundedAmount, setFundedAmount] = useState("0.000");
  const [isFullyFunded, setIsFullyFunded] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [backers, setBackers] = useState([]);
  const [error, setError] = useState(null);
  const [remaining, setRemaining] = useState(null);

  // New variables to hold campaign state
  const [isWithdrawn, setIsWithdrawn] = useState(false);
  const [isRepaid, setIsRepaid] = useState(false);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${monthNames[month - 1]} ${year}`;
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoadingPage(true);
        const campaignData = await getCampaignById(params.id);
        setCampaign(campaignData);
        console.log(campaignData);

        const backersList = await getBackersByCampaignId(params.id);
        setBackers(backersList);

        const remaining = await getRemainingAmount(params.id);
        setRemaining(remaining);
        const target = campaignData.target;
        setFundedAmount((target - remaining).toString());

        const fullyFunded = await isCampaignFullyFunded(params.id);
        setIsFullyFunded(fullyFunded);

        // Set withdrawn and repaid status
        setIsWithdrawn(campaignData.isWithdrawn);
        setIsRepaid(campaignData.isRepaid);
      } catch (err) {
        console.error("Failed to fetch campaign:", err);
        setError("Could not load campaign details.");
      } finally {
        setLoadingPage(false);
      }
    };
    fetchCampaign();
  }, [params.id]);

  useEffect(() => {
    connectWallet();
  }, []);

  const handleWithdraw = async () => {
    try {
      const success = await withdrawFunds(params.id);
      if (success) {
        window.location.reload();
      } else{
        alert("Some error occured!");
      }
      // Update the state after withdrawal
    } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Failed to withdraw funds.");
    }
  };

  const handleRepayLoan = async () => {
    try {
      await repayLoan(params.id, campaign.repaymentAmount);
      alert("Loan repaid successfully!");
      setIsRepaid(true); // Update the state after repayment
    } catch (error) {
      console.error("Repayment failed:", error);
      alert("Failed to repay loan.");
    }
  };

  // Loading state
  if (loadingPage)
    return (
      <div className="flex flex-col items-center min-h-screen py-6 px-4 lg:py-12 lg:px-6">
        <MetaMaskLoader loading={loading} />
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:p-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 lg:mb-8 text-center">
            <Skeleton className="h-8 w-2/4 mb-4" />
          </h1>

          <div className="text-gray-700 dark:text-gray-300 mb-6 lg:mb-8 space-y-2 lg:space-y-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 lg:p-5 rounded-lg mb-6 lg:mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4"></h2>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
          </div>

          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-4" />

          <div className="bg-yellow-100 dark:bg-yellow-700 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-200 p-4 lg:p-5 mb-6 lg:mb-8">
            <p className="font-semibold"></p>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold dark:text-red-400">
        {error}
      </div>
    );

    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed
    };
    
    const campaignDeadline = parseDate(campaign.deadline);
    const isDeadlinePassed = Date.now() >= campaignDeadline.getTime();
    console.log(campaignDeadline)


  return (
    <div className="flex flex-col items-center min-h-screen py-6 px-4 lg:py-12 lg:px-6">
      <MetaMaskLoader loading={loading} />
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:p-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 lg:mb-8 text-center">
          {campaign.title}
        </h1>

        <div className="text-gray-700 dark:text-gray-300 mb-6 lg:mb-8 space-y-2 lg:space-y-4">
          <p>{campaign.description}</p>
          <p className="mt-2">
            <strong>Target Amount:</strong> {campaign.target} ETH
          </p>
          <p className="mt-2">
            <strong>Remaining Amount:</strong> {remaining} ETH
          </p>
          {campaign.campaignType === "Loan" && (
            <p className="mt-2">
              <strong>Repayment Amount:</strong> {campaign.repaymentAmount} ETH
            </p>
          )}
          <p className="mt-2">
            <strong>Deadline:</strong> {formatDate(campaign.deadline)}
          </p>
          <p className="mt-2">
            <strong>Type:</strong> {campaign.campaignType}
          </p>
          <p className="mt-2"> <strong> Owner: </strong> {campaign.owner} </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 lg:p-5 rounded-lg mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Funded By:
          </h2>
          {backers.length > 0 ? (
            <ul className="space-y-2">
              {backers.map((backer, index) => (
                <li
                  key={index}
                  className="flex justify-between text-gray-600 dark:text-gray-300"
                >
                  <span className="truncate w-1/2 sm:w-auto">
                    {backer.address}
                  </span>
                  <span>{backer.amount} ETH</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No backers yet.</p>
          )}
        </div>

        <p className="text-lg font-bold text-gray-800 dark:text-[#e6e6ea] mb-2">
          {Math.min(
            (parseFloat(fundedAmount) / parseFloat(campaign.target)) * 100,
            100
          ).toFixed(0)}{" "}
          % Funded
        </p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4 mb-8 overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(
                (parseFloat(fundedAmount) / parseFloat(campaign.target)) * 100,
                100
              ).toFixed(0)}%`,
            }}
          ></div>
        </div>

        {account?.toLowerCase() === campaign.owner.toLowerCase() &&
  !isFullyFunded &&
  !isDeadlinePassed &&  (
    <p className="text-gray-500 dark:text-gray-400 italic mb-6">
      Once the campaign is fully funded or the deadline has passed, you can withdraw the funds!
    </p>
  )}

{account?.toLowerCase() === campaign.owner.toLowerCase() &&
  isFullyFunded &&
  !isDeadlinePassed && (
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Congratulations! Your campaign got fully funded, you can withdraw the funds to your wallet address {account} now.
    </p>
  )}

{account?.toLowerCase() === campaign.owner.toLowerCase() &&
  !isFullyFunded &&
  isDeadlinePassed && !isWithdrawn &&  (
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Your campaign didn't get 100% funded, however you can withdraw the funds to your wallet address {account} now.
    </p>
  )}

{account?.toLowerCase() === campaign.owner.toLowerCase() &&
  campaign.campaignType === "Loan" &&
  isFullyFunded &&
  !isDeadlinePassed && (
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Congratulations! Your campaign got fully funded, you can withdraw the funds to your wallet address {account} now. Please remember to repay the loan.
    </p>
  )}

{account?.toLowerCase() !== campaign.owner.toLowerCase() &&
  isFullyFunded &&
  !isDeadlinePassed && (
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      This campaign was 100% funded before the deadline!
    </p>
  )}

{account?.toLowerCase() !== campaign.owner.toLowerCase() &&
  isDeadlinePassed &&
  !isFullyFunded && (
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      The deadline of this campaign passed before it got fully funded.
    </p>
  )}

{/* Existing Check for Repaid Loan (for Owner) */}
{isRepaid &&
  account?.toLowerCase() === campaign.owner.toLowerCase() && (
    <div className="bg-green-100 dark:bg-green-700 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-200 p-5 mb-8">
      <p className="font-semibold">Thank You!</p>
      <p className="text-sm mt-2 leading-relaxed">
        Thank you for repaying your loan and maintaining the trust within our community. We appreciate your commitment to upholding transparency and trust on BackMyGame.
      </p>
    </div>
  )}

{/* Existing Check for Repaid Loan (for Non-Owner) */}
{account?.toLowerCase() !== campaign.owner.toLowerCase() && isRepaid && (
  <div className="bg-green-100 dark:bg-green-700 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-200 p-5 mb-8">
    <p className="font-semibold">Loan Repaid</p>
    <p className="text-sm mt-2 leading-relaxed">
      BackMyGame thanks the campaign owner for fulfilling their commitment by repaying the loan. This action strengthens the trust and integrity within our community.
    </p>
  </div>
)}

{/* Withdraw and Repay Loan Buttons */}
{isFullyFunded && !isWithdrawn && account?.toLowerCase() === campaign.owner.toLowerCase() && (
  <button
    onClick={handleWithdraw}
    className="bg-blue-600 flex justify-center items-center text-white px-8 py-3 rounded-md hover:bg-blue-700 transition mb-4"
  >
    Withdraw Funds
  </button>
)}

{isDeadlinePassed && !isWithdrawn && account?.toLowerCase() === campaign.owner.toLowerCase() && (
  <button
    onClick={handleWithdraw}
    className="bg-blue-600 flex justify-center items-center text-white px-8 py-3 rounded-md hover:bg-blue-700 transition mb-4"
  >
    Withdraw Funds
  </button>
)}

{campaign.campaignType === "Loan" && account?.toLowerCase() === campaign.owner.toLowerCase() &&
  (isFullyFunded || isDeadlinePassed) && !isRepaid && (
    <button
      onClick={handleRepayLoan}
      className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition"
    >
      Repay Loan
    </button>
)}

        <div className="bg-yellow-100 dark:bg-yellow-700 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-200 p-5 mt-8 mb-8">
          <p className="font-semibold">Terms and Conditions</p>
          <p className="text-sm mt-2 leading-relaxed">
            BackMyGame is primarily intended for donations to support gamers.
            While some campaigns may involve loans where repayment is expected,
            BackMyGame is not responsible for ensuring that these repayments are
            made. Supporters should carefully consider the campaign details and
            make decisions at their own risk.
          </p>
        </div>

        {/* Contribute Button for Non-Owner */}
{account?.toLowerCase() !== campaign.owner.toLowerCase() &&
  !isFullyFunded &&
  !isDeadlinePassed && (
    <FundCampaignDialog
      title={campaign.title}
      campaignId={campaign.id}
      remainingAmount={remaining}
    />
  )}
      </div>
    </div>
  );
};

export default BackCampaignPage;
