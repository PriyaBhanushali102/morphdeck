import React, { useState } from 'react'; 
import { Zap } from 'lucide-react';
import UpgradeModal from './UpgradeModal';
import useAuthStore from '@/store/useAuthStore'; 

const FREE_TIER_CREDITS = 5;

const CreditWallet = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const userCredits = useAuthStore((state) => state.user?.credits ?? 0); 
  const maxForBar = Math.max(userCredits, FREE_TIER_CREDITS);
  const progressWidth = `${Math.min((userCredits / maxForBar) * 100, 100)}%`;
  const isLow = userCredits < 3;

  return (
    <>
      <div className="p-4 mt-auto border-t border-border shrink-0">
        <div className="bg-muted/50 rounded-lg p-3 border border-border">

          {/* Credits Count */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credits</span>
            <span className={`text-sm font-bold ${isLow ? "text-red-500" : ""}`}>{userCredits}</span>
          </div>

          {isLow && (
            <p className="text-[10px] text-red-500 mb-1">Running low!</p>
          )}

          <div className="w-full bg-secondary h-1.5 rounded-full mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: progressWidth }}
            />
          </div>

          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-3 text-sm font-medium rounded-md hover:shadow-md transition-all"
          >
            <Zap size={14} className="fill-white" /> Get More
          </button>
        </div>
      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
};

export default CreditWallet;