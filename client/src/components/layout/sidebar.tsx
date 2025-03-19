import { Link, useLocation } from "wouter";
import UserProfileMini from "./user-profile-mini";

interface SidebarItemProps {
  title: string;
  icon: string;
  href: string;
  active: boolean;
}

function SidebarItem({ title, icon, href, active }: SidebarItemProps) {
  return (
    <Link href={href}>
      <a
        className={`sidebar-item flex items-center px-2 py-3 text-sm font-medium rounded-md ${
          active
            ? "border-l-4 border-primary bg-primary bg-opacity-10 text-primary"
            : "text-neutral-600 hover:bg-neutral-50"
        }`}
      >
        <span className="material-icons mr-3">{icon}</span>
        {title}
      </a>
    </Link>
  );
}

interface SidebarProps {
  showMobile: boolean;
  onClose: () => void;
}

export default function Sidebar({ showMobile, onClose }: SidebarProps) {
  const [location] = useLocation();

  // Close sidebar on mobile when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (showMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {showMobile && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOutsideClick}
        ></div>
      )}

      <div
        className={`${
          showMobile ? "fixed inset-y-0 left-0 z-40" : "hidden"
        } md:relative md:flex md:w-64 flex-shrink-0 flex-col bg-white border-r border-neutral-100`}
      >
        <div className="flex items-center justify-center h-16 border-b border-neutral-100">
          <h1 className="text-xl font-bold text-primary font-heading">School Monitor</h1>
        </div>
        <div className="overflow-y-auto flex-grow">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <SidebarItem
                title="Dashboard"
                icon="dashboard"
                href="/"
                active={location === "/"}
              />
              <SidebarItem
                title="Schools"
                icon="business"
                href="/schools"
                active={location === "/schools"}
              />
              <SidebarItem
                title="Teachers"
                icon="person"
                href="/teachers"
                active={location === "/teachers"}
              />
              <SidebarItem
                title="Students"
                icon="groups"
                href="/students"
                active={location === "/students"}
              />
              <SidebarItem
                title="Reports"
                icon="bar_chart"
                href="/reports"
                active={location === "/reports"}
              />
              <SidebarItem
                title="Attendance"
                icon="fingerprint"
                href="/attendance"
                active={location === "/attendance"}
              />
              <SidebarItem
                title="Settings"
                icon="settings"
                href="/settings"
                active={location === "/settings"}
              />
            </div>
          </nav>
        </div>
        <div className="border-t border-neutral-100 p-4">
          <UserProfileMini />
        </div>
      </div>
    </>
  );
}
