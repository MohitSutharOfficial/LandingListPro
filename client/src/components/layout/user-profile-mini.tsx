import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AvatarFallbackIcon } from "@/components/ui/avatar-fallback-icon";

export default function UserProfileMini() {
  const { user, logoutMutation } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={user.name} />
          <AvatarFallback><AvatarFallbackIcon /></AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-neutral-800">{user.name}</p>
        <p className="text-xs text-neutral-500">{user.role}</p>
      </div>
      <button 
        onClick={handleLogout}
        className="ml-auto text-neutral-400 hover:text-neutral-600"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
