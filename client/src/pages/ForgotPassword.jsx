import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/services/authService';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  useEffect(() => {
    document.title = "ForgotPassword - MorphDeck"; }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email.trim()); 
      toast.success("Check your email for the reset link!");
      setIsSent(true); 
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-2xl border border-border text-center shadow-lg">

        {/* Icon */}
        <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 flex items-center justify-center rounded-full mb-6 text-blue-600">
          <KeyRound size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Enter your email and we'll send you instructions.
        </p>

        {isSent ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-600 dark:text-green-400 font-medium text-sm">
              Reset link sent! Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left space-y-4">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Send Reset Link"}
            </button>
          </form>
        )}

        <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:underline">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;