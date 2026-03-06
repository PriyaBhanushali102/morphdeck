import React, { useState , useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RotateCcw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPassword } from '@/services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => { document.title = "Reset Password - MorphDeck"; }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success("Password reset! Please login.");
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Link invalid or expired");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-2xl border border-border text-center shadow-lg">
        <div className="mx-auto bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center rounded-full mb-6 text-green-600">
          <RotateCcw size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <input
            type="password"
            placeholder="New Password"
            required
            minLength="6"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            required
            minLength="6"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;