import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Clipboard, 
  FileText, 
  Calendar, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  type: "inspection" | "report" | "event" | "issue";
  title: string;
  description: string;
  school: string;
  date: string;
  status: "completed" | "pending" | "urgent";
}

interface RecentActivitiesProps {
  activities: Activity[];
  onViewDetails: (id: number) => void;
}

export default function RecentActivities({ activities, onViewDetails }: RecentActivitiesProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const activitiesPerPage = 5;
  const totalActivities = 24; // This would come from API

  const filteredActivities = activeFilter === "all" 
    ? activities
    : activities.filter(activity => activity.type === activeFilter);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "inspection":
        return <Clipboard className="text-primary text-sm" />;
      case "report":
        return <FileText className="text-purple-600 text-sm" />;
      case "event":
        return <Calendar className="text-green-600 text-sm" />;
      case "issue":
        return <AlertCircle className="text-red-600 text-sm" />;
      default:
        return <FileText className="text-blue-600 text-sm" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending Review</span>;
      case "urgent":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Urgent</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{status}</span>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-semibold text-neutral-800 font-heading">Recent Activities</CardTitle>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={activeFilter === "all" ? "default" : "ghost"}
              className="px-2 py-1 text-xs rounded h-auto"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "inspection" ? "default" : "ghost"}
              className="px-2 py-1 text-xs rounded h-auto"
              onClick={() => setActiveFilter("inspection")}
            >
              Inspections
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "report" ? "default" : "ghost"}
              className="px-2 py-1 text-xs rounded h-auto"
              onClick={() => setActiveFilter("report")}
            >
              Reports
            </Button>
            <Button
              size="sm"
              variant={activeFilter === "event" ? "default" : "ghost"}
              className="px-2 py-1 text-xs rounded h-auto"
              onClick={() => setActiveFilter("event")}
            >
              Events
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Activity</th>
                <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">School</th>
                <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-neutral-50">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-800">{activity.title}</p>
                        <p className="text-xs text-neutral-500">{activity.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-800">{activity.school}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-500">{activity.date}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {getStatusBadge(activity.status)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    <Button 
                      variant="link" 
                      className="text-primary font-medium p-0 h-auto"
                      onClick={() => onViewDetails(activity.id)}
                    >
                      {activity.status === "urgent" ? "Resolve" : "View"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-neutral-500">Showing {filteredActivities.length} of {totalActivities} activities</div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3"
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
