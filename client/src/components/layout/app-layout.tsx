import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar
        showMobile={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
      />

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white shadow-lg focus:outline-none"
        >
          <span className="material-icons">menu</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <Navbar title={title} onMenuClick={toggleSidebar} />

        {/* Main content scroll area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
