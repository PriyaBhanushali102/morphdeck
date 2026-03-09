import React, { useState, useEffect } from 'react';
import { Lock, Trash2, Loader2, Bell, SlidersHorizontal, ShieldAlert, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import authService from '@/services/authService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input, Button } from '@/components';

const SettingsPage = () => {
  useEffect(() => { document.title = "Settings - MorphDeck"; }, []);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('security');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("Please fill in all password fields");
    if (currentPassword === newPassword) return toast.error("Password not same");
    if (newPassword.length < 8) return toast.error("New password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match"); 
    
    setIsUpdatingPassword(true);
    try {
      const data = await userService.changePassword({ oldPassword: currentPassword, newPassword });
      if (data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);
    
    try {
      const data = await userService.deleteUser();
      if (data.success) {
        toast.success("Account deleted successfully");
        authService.logout();
        navigate('/login');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

   const tabs = [
    { id: 'security',      label: 'Account Security', icon: ShieldAlert },
    { id: 'preferences',   label: 'Preferences',       icon: SlidersHorizontal },
    { id: 'notifications', label: 'Notifications',     icon: Bell },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full h-full overflow-y-auto no-scrollbar bg-background">      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition ${
                activeTab === id
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-3xl">
          
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
                  <p className="text-sm text-muted-foreground mt-1">Update the password associated with your account.</p>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                      <Input 
                        type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        placeholder="••••••••" required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                      <Input 
                        type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        placeholder="••••••••" required minLength="8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                      <Input
                        type="password" value={confirmPassword} required minLength="8"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                      />
                    </div>
                    <Button 
                      type="submit" disabled={isUpdatingPassword}
                      className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 mt-2"
                    >
                      {isUpdatingPassword ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                      Update Password
                    </Button>
                  </form>
                </div>
              </div>

              <div className="border border-red-500/20 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-red-500/20 bg-red-500/5 dark:bg-red-500/10">
                  <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">Permanently delete your account and all associated data.</p>
                </div>
                
                <div className="p-6 bg-red-500/5 dark:bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button 
                    onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 shrink-0"
                  >
                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    Delete Account
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground animate-in fade-in duration-300">
              <SlidersHorizontal size={32} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Preferences</h3>
              <p className="mt-2">Theme and app preferences coming soon.</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground animate-in fade-in duration-300">
              <Bell size={32} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Notifications</h3>
              <p className="mt-2">Email and alert settings coming soon.</p>
            </div>
          )}

        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={18} /> Delete Your Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is <strong>permanent and irreversible</strong>. Your account,
              all presentations, and all associated data will be deleted immediately.
              There is no way to recover this data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;