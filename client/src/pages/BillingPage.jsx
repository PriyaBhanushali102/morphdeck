import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Zap, Loader2, Check, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '@/services/userService';
import paymentService from '@/services/paymentService';
import useAuthStore from '@/store/useAuthStore';

const BillingPage = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const location = useLocation();

  const credits = useAuthStore((state) => state.user?.credits ?? 0);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => { document.title = "BillingPage - MorphDeck"; }, []);

  const fetchUserData = async () => {
    try {
      const data = await userService.getUserProfile();
      if (data.success) {
        updateUser({ credits: data.data.credits });
      }
    } finally {
      setIsLoadingUser(false);
    }
  }

  useEffect(() => { fetchUserData(); }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    if (query.get("success") && !sessionStorage.getItem("payment_handled")) {
      sessionStorage.setItem("payment_handled", "true");
      window.history.replaceState(null, '', location.pathname);
      setTimeout(async () => {
        await fetchUserData();
        sessionStorage.removeItem("payment_handled");
        toast.success("Payment successful! Credits added. 🚀", { id: "payment-success" });
      }, 4000);
    }

    if (query.get("canceled") && !sessionStorage.getItem("payment_handled")) {
      sessionStorage.setItem("payment_handled", "true");
      window.history.replaceState(null, '', location.pathname);
      toast.error("Payment was canceled.", { id: "payment-canceled" });
      sessionStorage.removeItem("payment_handled");
    }
  }, [location.search]);


  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const data = await paymentService.createCheckoutSession('pro_50_credits');
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Network error. Try again later.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full h-full overflow-y-auto bg-background">

      {/* Header */}
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-3 text-foreground">
          <CreditCard className="text-blue-600" size={28} />
          Billing & Credits
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Manage your AI generation credits and subscription plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6 items-stretch">

        {/* Current Balance */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center min-h-[240px]">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center rounded-full mb-3">
            <Zap className="text-blue-600 dark:text-blue-400" size={28} />
          </div>
          <h2 className="text-lg font-semibold mb-1 text-foreground">Available Credits</h2>
          {isLoadingUser ? (
            <Loader2 className="animate-spin text-blue-600 mt-2" size={28} />
          ) : (
            <div className="text-6xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent my-2">
              {credits}
            </div>
          )}
        </div>

        {/* Purchase Card */}
        <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-50/30 dark:bg-blue-900/10 relative shadow-lg flex flex-col min-h-[240px] mt-5 lg:mt-0">
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-max">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
              Most Popular
            </span>
          </div>
          <h3 className="text-xl font-bold text-center mt-3 text-foreground">Pro Creator Pack</h3>
          <div className="mt-3 flex items-baseline justify-center gap-1 flex-wrap">
            <span className="text-4xl font-black text-foreground">$5.00</span>
            <span className="text-muted-foreground font-medium text-xs whitespace-nowrap">/ one-time</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm font-medium text-foreground flex-1">
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
              <span>Instantly add 50 Credits</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
              <span>High-Res PDF & PPTX Exports</span>
            </li>
          </ul>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || isLoadingUser}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-bold text-base shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {isCheckingOut ? <Loader2 size={20} className="animate-spin" /> : "Purchase 50 Credits"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;