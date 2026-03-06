import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useUIStore from "@/store/useUIStore";

const DashboardShell = () => {
  const { isSidebarOpen, toggleSidebar, setSidebar } = useUIStore();
  const location = useLocation();
  const isEditorPage = location.pathname.includes("/presentation");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (e) => {
      if (e.matches) setSidebar(false);          
      else if (!isEditorPage) setSidebar(true);  
      else setSidebar(false);                   
    };

    handleChange(mediaQuery);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isEditorPage]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">

      {/* Desktop Sidebar */}
      {isSidebarOpen && !isEditorPage && (
        <aside className="w-64 border-r bg-muted/10 shrink-0 h-full hidden md:block transition-all">
          <Sidebar />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setSidebar(false)}
      >
        <div
          className={`bg-background w-64 h-full shadow-xl transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {!isEditorPage && (
          <Navbar onMenuClick={toggleSidebar} />
        )}
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;