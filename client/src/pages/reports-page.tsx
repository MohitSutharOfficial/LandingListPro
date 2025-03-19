import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  FileText, 
  BarChart4, 
  Users, 
  Calendar,
  Eye,
  Share2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Report } from "@shared/schema";

// Report card component
function ReportCard({ report, schools }: { report: Report, schools: any[] }) {
  const schoolName = schools?.find(s => s.id === report.schoolId)?.name || "Unknown";
  const formattedDate = new Date(report.date).toLocaleDateString();
  
  // Get badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "published": return "success";
      case "draft": return "secondary";
      case "archived": return "outline";
      default: return "default";
    }
  };
  
  // Get icon based on report type
  const getIcon = (type: string) => {
    switch (type) {
      case "inspection": return <FileText className="h-5 w-5 text-primary" />;
      case "performance": return <BarChart4 className="h-5 w-5 text-purple-600" />;
      case "attendance": return <Users className="h-5 w-5 text-green-600" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="p-2 bg-neutral-100 rounded-md">
              {getIcon(report.type)}
            </div>
            <div>
              <CardTitle className="text-base">{report.title}</CardTitle>
              <CardDescription className="text-xs">{schoolName}</CardDescription>
            </div>
          </div>
          <Badge variant={getBadgeVariant(report.status) as any}>
            {report.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-neutral-600">
          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-2">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between border-t border-neutral-100">
        <Button variant="ghost" size="sm" className="h-8">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  // Fetch reports
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  // Fetch schools
  const { data: schools } = useQuery({
    queryKey: ["/api/schools"],
  });

  // Filter reports based on search, tabs, and other filters
  const filteredReports = reports?.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    // Filter by date range
    let matchesDate = true;
    if (dateFilter !== "all") {
      const reportDate = new Date(report.date);
      const today = new Date();
      
      if (dateFilter === "lastWeek") {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        matchesDate = reportDate >= lastWeek;
      } else if (dateFilter === "lastMonth") {
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        matchesDate = reportDate >= lastMonth;
      } else if (dateFilter === "lastQuarter") {
        const lastQuarter = new Date();
        lastQuarter.setMonth(today.getMonth() - 3);
        matchesDate = reportDate >= lastQuarter;
      }
    }
    
    // Apply tab filtering
    const matchesTab = activeTab === "all" || 
                      (activeTab === "inspection" && report.type === "inspection") ||
                      (activeTab === "performance" && report.type === "performance") ||
                      (activeTab === "attendance" && report.type === "attendance");
    
    return matchesSearch && matchesType && matchesStatus && matchesDate && matchesTab;
  });

  return (
    <AppLayout title="Reports">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 font-heading">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="inspection">Inspection</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="pt-4">
          {reportsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map(report => (
                <ReportCard key={report.id} report={report} schools={schools || []} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-500">
              No reports found. {searchQuery && "Try a different search term."}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inspection" className="pt-4">
          {reportsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map(report => (
                <ReportCard key={report.id} report={report} schools={schools || []} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-500">
              No inspection reports found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="pt-4">
          {reportsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map(report => (
                <ReportCard key={report.id} report={report} schools={schools || []} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-500">
              No performance reports found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance" className="pt-4">
          {reportsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map(report => (
                <ReportCard key={report.id} report={report} schools={schools || []} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-500">
              No attendance reports found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
