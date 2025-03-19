import { useState } from "react";
import { ChevronDown, Filter, Download } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  date: string;
  userName: string;
}

export default function FilterBar({ date, userName }: FilterBarProps) {
  const [timeRange, setTimeRange] = useState("last7days");

  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 font-heading">{date}</h2>
        <p className="text-sm text-neutral-500">Welcome back, {userName}. Here's what's happening today.</p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="lastQuarter">Last quarter</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
