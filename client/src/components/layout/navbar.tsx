import React from "react";
import { 
  Bell,
  HelpCircle,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Navbar({ title, onMenuClick }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="md:hidden mr-4 text-neutral-500"
          >
            <span className="material-icons">menu</span>
          </button>
          <h1 className="text-lg font-semibold text-neutral-800 font-heading">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 rounded-full pl-10 pr-4 py-2 border border-neutral-200 text-sm"
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <button className="text-neutral-500 hover:text-neutral-700 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button className="text-neutral-500 hover:text-neutral-700">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
