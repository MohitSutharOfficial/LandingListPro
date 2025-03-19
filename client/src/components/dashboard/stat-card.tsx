import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  compareText: string;
  color: "primary" | "secondary" | "accent" | "error";
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  compareText,
  color
}: StatCardProps) {
  const colorClasses = {
    primary: "border-primary", 
    secondary: "border-teal-500",
    accent: "border-amber-600",
    error: "border-red-500"
  };

  const bgColorClasses = {
    primary: "bg-primary bg-opacity-10 text-primary", 
    secondary: "bg-teal-500 bg-opacity-10 text-teal-500",
    accent: "bg-amber-600 bg-opacity-10 text-amber-600",
    error: "bg-red-500 bg-opacity-10 text-red-500"
  };

  return (
    <Card className={cn(
      "dashboard-card bg-white rounded-lg shadow-sm p-4 border-l-4 transition-all duration-200",
      colorClasses[color]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-800">{value}</p>
        </div>
        <div className={cn("p-2 rounded-full", bgColorClasses[color])}>
          <span className="material-icons">{icon}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <span 
          className={cn(
            "flex items-center text-xs font-medium",
            change.isPositive ? "text-green-600" : "text-red-500"
          )}
        >
          {change.isPositive ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {change.value}
        </span>
        <span className="text-xs text-neutral-500 ml-2">{compareText}</span>
      </div>
    </Card>
  );
}
