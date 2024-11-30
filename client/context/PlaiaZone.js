"use client";

import { ethers } from "ethers";
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import abi from "@/utils/Abi";

const PlaiaZoneContext = createContext();

export const PlaiaZoneProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0.000");
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const contractABI = abi;
  const contractAddress = "0x34b685622230284fA93051F77C927FCFb47BCd55";

  const loadContract = async (signer = null) => {
    const providerInstance = new ethers.BrowserProvider(
      window.ethereum ||
        new ethers.JsonRpcProvider("https://rpc.sepolia.linea.build") // Linea Sepolia RPC URL
    );
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer ? signer : providerInstance
    );
    setContract(contractInstance);
    return contractInstance;
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        setProvider(providerInstance);

        const lineasepoliaChainId = "0xe705"; // Chain ID for Linea Sepolia (59141 in hexadecimal)
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Switch to the correct network
        if (chainId !== lineasepoliaChainId) {
          await switchNetwork(lineasepoliaChainId);
        }

        const accounts = await providerInstance.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const balance = await providerInstance.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
        setIsConnected(true);
        setLoading(false);

        await loadContract();
      } catch (error) {
        console.error("Error connecting to wallet: ", error);
      }
    } else {
      alert("MetaMask is required to use this app.");
      window.open("https://metamask.io/download.html", "_blank");
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await addNetwork(chainId);
      } else {
        console.error("Error switching networks:", switchError);
      }
    }
  };

  const addNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName: "Linea Sepolia",
            rpcUrls: ["https://rpc.sepolia.linea.build"], // Linea Sepolia RPC URL
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://sepolia.etherscan.io/"], // Sepolia Explorer URL
          },
        ],
      });
    } catch (addError) {
      console.error("Error adding network:", addError);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance("0.000");
    loadContract();
  };

  const createCampaign = async (
    owner,
    title,
    description,
    target,
    repaymentAmount,
    deadline,
    campaignType
  ) => {
    const signer = await provider.getSigner();
    const contract = await loadContract(signer);

    if (!contract) {
      console.error("Provider is not set. Please connect your wallet.");
      return false;
    }

    try {
      setLoading(true);

      const transaction = await contract.createCampaign(
        owner,
        title,
        description,
        ethers.parseEther(target),
        campaignType === "Loan" ? ethers.parseEther(repaymentAmount) : 0,
        deadline,
        campaignType === "Loan" ? 1 : 0
      );

      await transaction.wait();
      await getCampaigns();
      return true;
    } catch (error) {
      console.error("Error creating campaign:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCampaigns = async () => {
    setLoading(true);
    try {
      const contract = await loadContract();
      const n = await contract.getTotalCampaigns();
      const campaignsArray = [];

      for (let i = 0; i < n; i++) {
        const campaign = await contract.getCampaignById(i);
        campaignsArray.push(campaign);
      }

      setCampaigns(campaignsArray);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCampaignById = async (id) => {
    setLoading(true);
    try {
      const contract = await loadContract();
      const campaign = await contract.getCampaignById(id);

      const parsedCampaign = {
        id,
        owner: campaign[0],
        title: campaign[1],
        description: campaign[2],
        target: ethers.formatUnits(campaign[3], "ether").toString(),
        repaymentAmount: ethers.formatUnits(campaign[4], "ether").toString(),
        deadline: new Date(Number(campaign[5]) * 1000).toLocaleDateString(),
        campaignType: campaign[7] === 1n ? "Loan" : "Donation",
        isRepaid: campaign[8],
        isWithdrawn: campaign[9],
      };

      setLoading(false);
      return parsedCampaign;
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setLoading(false);
      throw error;
    }
  };

  const fundCampaign = async (id, amount) => {
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = await loadContract(signer);

      const transaction = await contract.backCampaign(id, {
        value: amount,
      });

      await transaction.wait();
      return true;
    } catch (error) {
      console.error("Error funding campaign:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getRemainingAmount = async (id) => {
    try {
      const contract = await loadContract();
      const remainingAmount = await contract.getRemainingAmount(id);
      return ethers.formatUnits(remainingAmount, "ether").toString();
    } catch (error) {
      console.error("Error getting remaining amount:", error);
    }
  };

  const getBackersByCampaignId = async (campaignId) => {
    try {
      const contract = await loadContract();
      const [backers, contributions] = await contract.getBackers(campaignId);
  
      return backers.map((backer, index) => ({
        address: backer,
        amount: ethers.formatUnits(contributions[index], "ether").toString(),
      }));
    } catch (error) {
      console.error("Failed to fetch backers:", error);
      return [];
    }
  };

  const repayLoan = async (campaignId, amount) => {
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = await loadContract(signer);
      const transaction = await contract.repayLoan(campaignId, {
        value: ethers.parseUnits(amount, "ether"),
      });
      await transaction.wait();
      return true;
    } catch (error) {
      console.error("Failed to repay loan:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isCampaignFullyFunded = async (id) => {
    try {
      const contract = await loadContract();
      return await contract.isCampaignFullyFunded(id);
    } catch (error) {
      console.error("Error checking if campaign is fully funded:", error);
    }
  };

  const withdrawFunds = async (id) => {
    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = await loadContract(signer);

      const transaction = await contract.withdrawFunds(id);
      await transaction.wait();

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    loadContract();
    getCampaigns();
  }, []);

  useEffect(() => {
    if (account) {
      loadContract();
    }
  }, [account]);

  return (
    <PlaiaZoneContext.Provider
      value={{
        account,
        balance,
        isConnected,
        loading,
        campaigns,
        connectWallet,
        disconnectWallet,
        createCampaign,
        getCampaignById,
        fundCampaign,
        getRemainingAmount,
        getBackersByCampaignId,
        repayLoan,
        isCampaignFullyFunded,
        withdrawFunds,
      }}
    >
      {children}
    </PlaiaZoneContext.Provider>
  );
};

export const usePlaiaZone = () => useContext(PlaiaZoneContext);
