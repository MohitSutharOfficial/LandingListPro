import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface School {
  id: number;
  name: string;
  score: string;
  change: string;
}

interface SchoolRankingsProps {
  schools: School[];
  onViewDetails: (id: number) => void;
  onViewAll: () => void;
}

export default function SchoolRankings({ schools, onViewDetails, onViewAll }: SchoolRankingsProps) {
  const [period, setPeriod] = useState("thisMonth");

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-primary text-white";
      case 2:
        return "bg-primary-light text-white";
      case 3:
        return "bg-teal-500 text-white";
      case 4:
        return "bg-amber-600 text-white";
      default:
        return "bg-neutral-400 text-white";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-neutral-800 font-heading">Top Performing Schools</CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] border-0 text-xs h-8">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastQuarter">Last Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {schools.map((school, index) => (
            <div key={school.id} className="flex items-center">
              <div className={cn(
                "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium",
                getRankColor(index + 1)
              )}>
                {index + 1}
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="text-sm font-medium text-neutral-800">{school.name}</h3>
                <div className="flex items-center text-xs text-neutral-500">
                  <span className="mr-2">Overall Score: {school.score}</span>
                  <span className={cn(
                    "flex items-center",
                    parseFloat(school.change) >= 0 ? "text-green-600" : "text-red-500"
                  )}>
                    {parseFloat(school.change) >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(parseFloat(school.change))}%
                  </span>
                </div>
              </div>
              <Button 
                variant="link" 
                className="text-xs text-primary p-0 h-auto"
                onClick={() => onViewDetails(school.id)}
              >
                Details
              </Button>
            </div>
          ))}
        </div>
        <Button 
          variant="link" 
          className="mt-4 text-primary text-sm font-medium w-full"
          onClick={onViewAll}
        >
          See All Schools
        </Button>
      </CardContent>
    </Card>
  );
}
