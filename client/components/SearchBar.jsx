// components/SearchBar.js
"use client";
import { useState } from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <input
        type="text"
        placeholder="Search campaigns..."
        className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
