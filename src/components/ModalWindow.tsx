import React from "react";

interface ModalWindowProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWindow: React.FC<ModalWindowProps> = ({ onClose, children }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-gradient-to-br from-[#1f1f2b] to-[#141421] text-white border border-gray-700 rounded-xl shadow-xl p-6 sm:p-8 transition-all"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;
