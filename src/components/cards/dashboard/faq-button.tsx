"use client";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface FAQButtonProps {
  onClick?: () => void;
  className?: string;
}

export const FAQButton = ({ onClick, className = "" }: FAQButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 
        px-4 py-2 
        bg-blue-50 hover:bg-blue-100 
        text-blue-700 hover:text-blue-800 
        rounded-lg 
        border border-blue-200 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      <span className="font-medium">FAQ</span>
      <QuestionMarkCircleIcon className="w-5 h-5" />
    </button>
  );
};