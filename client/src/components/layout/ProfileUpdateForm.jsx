import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react'; 
import toast from 'react-hot-toast';
import userService from '@/services/userService';
import useAuthStore from '@/store/useAuthStore';

const ProfileUpdateForm = ({ onUpdate }) => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const data = await userService.updateProfile({ name: name.trim() }); 
      if (data.success) {
        toast.success("Profile updated successfully!");
        updateUser({ name: name.trim() }); 

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full p-3 bg-muted/50 border border-border rounded-xl text-muted-foreground cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Your email is managed by your account login.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          required
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isUpdating || name.trim() === user?.name} 
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;