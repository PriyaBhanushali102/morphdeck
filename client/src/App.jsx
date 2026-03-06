import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

import DashboardShell from "@/components/layout/DashboardShell";
import HomeChat from './pages/HomeChat';
import Login from './pages/Login';
import Register from './pages/Register';
import PresentationEditor from './pages/PresentationEditor';
import Library from './pages/Library';
import Trash from './pages/TrashPage';
import BillingPage from "./pages/BillingPage";
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
function App() {
  return (
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      <BrowserRouter>
        <ErrorBoundary>
        <Toaster
        position="top-right"
        reverseOrder={false}
        />
        
        <Routes>
            
          <Route path="/view/:id" element={<PresentationEditor />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />          
            <Route path="/register" element={<Register />} />          
            <Route path="/forgot-password" element={<ForgotPassword />} />         
            <Route path="/reset-password/:token" element={<ResetPassword />} />        
          </Route>
            

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardShell />}>
              <Route path="/" element={<HomeChat />} />
              <Route path="/library" element={<Library />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/presentation/:id" element={<PresentationEditor />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />

          </Routes>
          </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
