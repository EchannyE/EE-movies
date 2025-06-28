import React from "react";

export default function Input({ name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
  );
}
// This Input component is a reusable input field that can be used across different forms in the application.