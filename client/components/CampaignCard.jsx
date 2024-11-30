"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlaiaZone } from "@/context/PlaiaZone";

const CampaignCard = ({
  index,
  owner,
  title,
  description,
  target,
  repaymentAmount,
  deadline,
  campaignType,
  handleClick,
  fundedAmount,
}) => {
  const { getRemainingAmount } = usePlaiaZone();
  const [funded, setFunded] = useState(0);

  useEffect(() => {
    const fetchFundedAmount = async () => {
      const remaining = await getRemainingAmount(index);
      setFunded(target - remaining);
    };
    fetchFundedAmount();
  }, [index, target]);

  // Calculate funding progress and round to an integer
  const progress = Math.min(Math.round((funded / target) * 100), 100);

  // Format date
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

 

  // Limit description to 80 words
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <Link href={`/back-campaign/${index}`}>
      <div
        className="sm:w-[300px]  w-full h-[440px] rounded-lg bg-white dark:bg-[#2a2b36] hover:bg-gray-100 dark:hover:bg-[#34353f] cursor-pointer transition-shadow duration-200 ease-in-out shadow-lg hover:shadow-2xl"
        onClick={handleClick}
      >
        <div className="flex flex-col justify-between h-full p-6">
          {/* Title */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-black dark:text-white leading-6">
              {title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              {truncateDescription(description, 35)}
            </p>
          </div>

          {/* Campaign Stats */}
          <div className="flex justify-between mt-4 gap-4">
            {/* Target Amount */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-md text-gray-800 dark:text-[#e6e6ea] leading-5">
                {target} ETH
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-[#a1a2ad]">
                Target
              </p>
            </div>

            {/* Deadline */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-md text-gray-800 dark:text-[#e6e6ea] leading-5">
                {Date.now() / 1000 >= deadline ? (
                  <i>Deadline passed</i>
                ) : (
                  formatDate(deadline)
                )}
              </h4>
              <p className="mt-1 text-sm text-right text-gray-600 dark:text-[#a1a2ad]">
                Deadline
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-800 dark:text-[#e6e6ea] mt-2 ml-2">
            {progress}% funded
          </p>

          {/* Footer: Avatar, Owner, and Campaign Type */}
          <div className="flex items-center mt-6 gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-100 dark:bg-[#1e1e29] flex items-center justify-center">
              <Image
                src="/aia_avatar.png"
                alt="user"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <p className="flex-1 text-sm text-gray-600 dark:text-[#a1a2ad] truncate">
              by{" "}
              <span className="text-gray-800 dark:text-[#d2d3e0]">{owner}</span>
            </p>

            {/* Campaign Type Badge */}
            <span
              className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${
                campaignType === "Loan" ? "bg-pink-500" : "bg-blue-500"
              }`}
            >
              {campaignType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
