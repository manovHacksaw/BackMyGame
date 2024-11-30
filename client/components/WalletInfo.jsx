import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const WalletInfo = ({ account, balance }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check and set dark mode based on the theme stored in local storage
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  const formatAddress = (address) => {
    return `${address.slice(0, 12)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    const balanceNumber = parseFloat(balance);
    const balanceStr = balanceNumber.toString();
    if (balanceStr.includes('.')) {
      const decimalPart = balanceStr.split('.')[1];
      if (decimalPart.length > 5) {
        return balanceNumber.toFixed(5);
      }
    }
    return balanceNumber.toString();
  };

  

  return (
    <div
      className={`flex items-center justify-between px-5 py-3 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      <Image src="/aia_avatar.png" alt="Avatar" width={30} height={30} className="rounded-full mr-3" />
      <div className="ml-2">
        <p className="font-semibold text-md">{formatAddress(account)}</p>
        <p className={`text-sm text-center font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatBalance(balance)} ETH
        </p>
      </div>
    </div>
  );
};

export default WalletInfo;
