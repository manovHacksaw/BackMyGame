"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePlaiaZone } from "@/context/PlaiaZone";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import MetaMaskLoader from "./MetaMaskLoader";

const FundCampaignDialog = ({ campaignId, title, remainingAmount }) => {
  const { fundCampaign, loading } = usePlaiaZone();
  const [amount, setAmount] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  const router = useRouter();

  const handleFund = async () => {
    if (!agreed || !amount || parseFloat(amount) > remainingAmount) return;
    try {
      
      const weiAmount = ethers.parseEther(amount); // Convert to Wei
      const success = await fundCampaign(campaignId, weiAmount);
      if(success){
        window.location.reload();
      }
    } catch (error) {
      console.error("Funding failed:", error);
      alert("Funding failed. Please try again.");
    } finally {
      
    }
  };

  return (
    <>
    <MetaMaskLoader loading={loading}/>
    <Dialog>
      <DialogTrigger className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        Fund Campaign
      </DialogTrigger>
      <DialogContent>
        <div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Fund for {title}
            </DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300">
              This action cannot be undone. You will contribute to the campaign with the specified amount.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (in ETH)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              disabled={loading}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter amount"
              min="0"
              step="any"
            />
            {amount && parseFloat(amount) > remainingAmount && (
              <p className="text-red-600 dark:text-red-400 mt-2">
                Amount exceeds the remaining funding required: {remainingAmount} ETH
              </p>
            )}
          </div>

          <div className="flex items-center mt-4">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 rounded"
            />
            <label htmlFor="agree" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              I agree to the terms and conditions.
            </label>
          </div>

          <button
            onClick={handleFund}
            disabled={!agreed || !amount || loading || parseFloat(amount) > remainingAmount}
            className={`w-full py-2 px-4 mt-6 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors 
              ${!agreed || !amount || loading || parseFloat(amount) > remainingAmount ? "bg-gray-400 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : "Send Amount"}
          </button>
        </div>
      </DialogContent>
    </Dialog></>
    
  );
};

export default FundCampaignDialog;
