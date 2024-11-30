
import { usePlaiaZone } from '@/context/PlaiaZone'
import React from 'react'

const ConnectWallet = ({loading}) => {
    const { connectWallet } = usePlaiaZone();

    return (
        <button
            onClick={connectWallet} 
            disabled={loading}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer transition-transform hover:bg-blue-700 hover:scale-105 active:scale-95"
        >
            Connect Wallet
        </button>
    );
}

export default ConnectWallet;
