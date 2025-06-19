import React, { useEffect } from "react";

const SuccessToast = ({ message, isOpen, duration = 3000, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
        {message}
      </div>
    </div>
  );
};

export default SuccessToast;








