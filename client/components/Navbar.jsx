"use client";
import { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import { usePlaiaZone } from "@/context/PlaiaZone";
import MetaMaskLoader from "./MetaMaskLoader";
import WalletInfo from "./WalletInfo";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, account, balance } = usePlaiaZone();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <MetaMaskLoader loading={loading} />
      <nav className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-xl md:text-2xl font-bold">BackMyGame</div>

       

        <div className="flex items-center space-x-4">
          {account ? (
            <WalletInfo account={account} balance={balance} />
          ) : (
            <ConnectWallet loading={loading} />
          )}
        </div>
      </nav>
    </>
  );
}
