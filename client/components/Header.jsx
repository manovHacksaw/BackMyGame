"use client";
import { usePlaiaZone } from "@/context/PlaiaZone";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { isConnected, connectWallet } = usePlaiaZone();
  
  const handleRequestClick = async () => {
    if (isConnected) {
      router.push("/request");
    }
    if (!isConnected) {
      // If the wallet is not connected, prompt the user to connect it
      await connectWallet();
      router.push("/request");
    }
  };

  return (
    <header className="text-center flex flex-col items-center justify-center my-8 px-4 md:my-12">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
        Help your fellow <span className="text-blue-500">Gamers</span> and Earn
      </h1>

      <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-600 dark:text-gray-300">
        Empowering Gamers, Connecting Worlds – Fund, Play, Thrive on Linea
      </p>

      <Image 
        src="/headerGIF.gif" 
        width={150} 
        height={150} 
        alt="Inverted Header Image" 
        className="dark:invert md:w-[200px] md:h-[200px]"
      />

      <div className="flex flex-col md:flex-row justify-center p-6 space-y-4 md:space-y-0 md:space-x-4">
        <button 
          onClick={() => { router.push("campaigns"); }}
          className="px-6 md:px-8 py-3 md:py-4 bg-purple-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-purple-700"
        >
          Fund Your Fellows
        </button>
        <button
          onClick={handleRequestClick}
          className="px-6 md:px-8 py-3 md:py-4 bg-pink-600 dark:bg-pink-500 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-pink-700"
        >
          Request/Borrow Funds
        </button>
      </div>
    </header>
  );
}
