
import React from "react";

function Button({ title = "Submit", loading = false, icon = null, size = "md", type = "submit", onClick }) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition duration-300 ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${sizeClasses[size]}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </>
      )}
    </button>
  );
}

export default Button;
