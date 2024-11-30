import Image from 'next/image';
import React from 'react';

const MetaMaskLoader = ({ loading }) => {
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-9000 font-poppins">
          <div className="flex flex-col items-center p-10 bg-gray-950 rounded-lg shadow-lg relative max-w-xs sm:max-w-sm mx-4">
            {/* Spinning loader container */}
            <div className="mb-4 w-[125px] h-[125px] flex items-center justify-center">
              {/* Spinning border */}
              <div className="w-full h-full border-4 border-t-4 border-t-indigo-600 border-gray-600 rounded-full animate-spin"></div>
              {/* MetaMask Logo - stationary */}
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                width={70}
                height={70}
                alt="MetaMask Logo"
                className="absolute"
              />
            </div>
            <h2 className="text-xl text-white mb-2 text-center">Waiting for MetaMask Confirmation</h2>
            <p className="text-sm text-gray-400 text-center mb-4">
              Please accept the connection request in your wallet and wait for the transaction to be mined.
            </p>
            <button
              onClick={handleTryAgain}
              className="mt-4 px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-500 focus:outline-none focus:ring-4 focus:ring-red-400 transition duration-200 ease-in-out"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MetaMaskLoader;
