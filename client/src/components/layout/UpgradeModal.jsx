import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createCheckoutSession } from '@/services/paymentService.js';
import { Zap, Loader2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const data = await createCheckoutSession('pro_50_credits');
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (error) {
      toast.error(error.message || "Network error. Try again later.");
    } finally {
      setIsLoading(false); 
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-full mb-4">
            <Zap className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Out of Credits?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Upgrade your account to generate more AI-powered presentations instantly.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="border border-blue-200 dark:border-blue-900 rounded-lg p-5 bg-blue-50/50 dark:bg-blue-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Creator Pack</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">$5.00</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">/ one-time</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> 50 AI Presentation Generations</li>
            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> High-Res PDF Exports</li>
          </ul>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Purchase 50 Credits"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpgradeModal;