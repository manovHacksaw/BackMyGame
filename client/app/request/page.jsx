"use client";
import React, { useState } from "react";
import { usePlaiaZone } from "../../context/PlaiaZone";
import MetaMaskLoader from "@/components/MetaMaskLoader";
import { useRouter } from "next/navigation";
import { formatDateForContract, getMinDate } from "@/utils/date";

const RequestFundsPage = () => {
  const {
    account,
    loading,
    disconnectWallet,
    connectWallet,
    createCampaign,
  } = usePlaiaZone();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    repaymentAmount: "",
    deadline: "",
    campaignType: "Donation",
    repaymentPromise: false,
  });
  
  const [errors, setErrors] = useState({});

  const handleReconnect = async () => {
    disconnectWallet();
    router.push("/");
    connectWallet();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({}); // Reset errors on input change
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters long.";
    }
    if (formData.description.length <= 40) {
      newErrors.description = "Description must be more than 40 characters.";
    }
    if (formData.campaignType === "Loan") {
      const targetAmount = parseFloat(formData.target) || 0;
      const repaymentAmount = parseFloat(formData.repaymentAmount) || 0;
      if (repaymentAmount < targetAmount + 50) {
        newErrors.repaymentAmount = "Repayment amount must be at least 0.5 ETH more than the target amount.";
      }
    }
    if (!formData.deadline) {
      newErrors.deadline = "Please select a deadline date.";
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.deadline = "Deadline must be a future date.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const unixTimestamp = formatDateForContract(formData.deadline);
      const success = await createCampaign(
        account,
        formData.title,
        formData.description,
        formData.target,
        formData.repaymentAmount,
        unixTimestamp,
        formData.campaignType
      );
      if (success) {
        router.push("/campaigns");
      } else {
        console.log("ERROR");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!account) {
    connectWallet();
  }

  return (
    <div className="min-h-screen px-10 text-gray-800 dark:text-white flex justify-center items-center py-12 sm:px-6 lg:px-8 relative">
      <MetaMaskLoader loading={loading} />

      {/* Form Container */}
      <div className="bg-gray-100 dark:bg-gray-800 shadow-lg shadow-gray-300/50 dark:shadow-none rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Request or Borrow Funds
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block font-semibold mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none`}
                placeholder="Enter the purpose you would need funds for"
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Target Amount */}
            <div className="mb-4">
              <label htmlFor="target" className="block font-semibold mb-2">
                Target Amount (in ETH)
              </label>
              <input
                type="number"
                id="target"
                name="target"
                value={formData.target}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
                placeholder="How much would you need?"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none`}
              rows="4"
              placeholder="Describe your campaign, including purpose, goals, and achievements"
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

            {/* Description Tips */}
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Tips for writing an effective campaign description:</p>
              <ul className="list-disc list-inside">
                <li>Mention notable achievements that build trust.</li>
                <li>Include links to your social media profiles.</li>
                <li>
                  For streamers, add your YouTube or Twitch streaming link.
                </li>
              </ul>
            </div>
          </div>

          {/* Repayment Amount & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.campaignType === "Loan" && (
              <div className="mb-4">
                <label
                  htmlFor="repaymentAmount"
                  className="block font-semibold mb-2"
                >
                  Repayment Amount (only for loans)
                </label>
                <input
                  type="number"
                  id="repaymentAmount"
                  name="repaymentAmount"
                  value={formData.repaymentAmount}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border ${
                    errors.repaymentAmount ? 'border-red-500' : 'border-gray-300'
                  } dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none`}
                  placeholder="Enter repayment amount"
                />
                {errors.repaymentAmount && <p className="text-red-500 text-sm mt-1">{errors.repaymentAmount}</p>}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="deadline" className="block font-semibold mb-2">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={getMinDate()}
                className={`w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                } dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none`}
                required
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            </div>
          </div>

          {/* Campaign Type - Radio Buttons */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Campaign Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="campaignType"
                  value="Donation"
                  checked={formData.campaignType === "Donation"}
                  onChange={handleChange}
                  className="text-purple-500 focus:ring-2 focus:ring-purple-400"
                />
                <span>Donation</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="campaignType"
                  value="Loan"
                  checked={formData.campaignType === "Loan"}
                  onChange={handleChange}
                  className="text-purple-500 focus:ring-2 focus:ring-purple-400"
                />
                <span>Loan</span>
              </label>
            </div>
          </div>

          {/* Repayment Promise Checkbox - Only for Loan */}
          {formData.campaignType === "Loan" && (
            <div className="mb-6">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="repaymentPromise"
                  checked={formData.repaymentPromise}
                  onChange={handleChange}
                  className="text-purple-500 focus:ring-2 focus:ring-purple-400 mt-1"
                />
                <span>
                  I solemnly commit to repay the borrowed amount in full by the
                  specified deadline and to allocate the funds exclusively to
                  the stated purpose of this campaign.
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 dark:bg-purple-700 text-white py-4 rounded-lg font-bold hover:bg-purple-700 dark:hover:bg-purple-800 transition duration-300"
            disabled={
              (formData.campaignType === "Loan" && !formData.repaymentPromise) || 
              !!Object.keys(errors).length
            }
          >
            Submit Request
          </button>
        </form>

        {/* Address Summary */}
        <div className="mt-8 text-center text-gray-700 dark:text-gray-300 text-sm">
          You are formally requesting {formData.campaignType.toLowerCase()}{" "}
          funds from the wallet address{" "}
          <span className="font-bold">{account}</span>. Only the holder of this
          address will be eligible to withdraw the campaign funds upon
          fulfillment of the specified conditions. To switch to another account,
          please{" "}
          <button
            onClick={handleReconnect}
            className="text-purple-600 dark:text-purple-400 font-semibold underline"
          >
            disconnect and reconnect
          </button>
          .
        </div>
      </div>
    </div>
  );
};

export default RequestFundsPage;