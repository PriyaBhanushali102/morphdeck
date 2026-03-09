import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Zap, Calendar, Edit3, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '@/services/userService';
import ProfileUpdateForm from '@/components/layout/ProfileUpdateForm';
import useAuthStore from '@/store/useAuthStore';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isLoading, setIsLoading] = useState(!user);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { document.title = "Profile - MorphDeck"; }, []);
  
  const fetchUserData = useCallback(async () => { 
    try {
      const data = await userService.getUserProfile();
      if (data.success) updateUser(data.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const isPro = user?.plan === "pro" || user?.credits > 5; 
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="h-full w-full overflow-y-auto bg-muted/10">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 w-full relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">

        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-5xl font-bold text-blue-600">{initial}</span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">{user?.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mt-2 text-sm">
              <span className="flex items-center gap-1"><Mail size={14} /> {user?.email}</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`mb-4 md:mb-2 flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition text-sm font-medium border ${
              isEditing
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md"
            }`}
          >
            <Edit3 size={16} /> {isEditing ? "Close Editing" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} /></div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Plan Usage</h3>
              <div className={`text-4xl font-bold mb-1 ${isPro ? "text-blue-600" : "text-gray-700"}`}>
                {user?.credits}
              </div>
              <p className="text-sm text-muted-foreground">Credits Available</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account Type</span>
                  {isPro ? (
                    <span className="font-bold text-blue-600 flex items-center gap-1">
                      <Zap size={12} className="fill-blue-600" /> Pro Tier
                    </span>
                  ) : (
                    <span className="font-medium text-gray-500">Free Tier</span>
                  )}
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            {isEditing ? (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6">Edit Personal Information</h2>
                <ProfileUpdateForm
                  user={user}
                  onUpdate={() => { fetchUserData(); setIsEditing(false); }}
                />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                <div className="bg-muted/50 p-4 rounded-full mb-4"><Edit3 size={32} /></div>
                <h3 className="text-lg font-medium text-foreground">Welcome to your profile</h3>
                <p className="max-w-xs mx-auto mt-2">
                  Click the "Edit Profile" button above to update your name or personal details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;