import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import FilterBar from "@/components/dashboard/filter-bar";
import StatCard from "@/components/dashboard/stat-card";
import AIAlerts from "@/components/dashboard/ai-alerts";
import AttendanceChart from "@/components/dashboard/attendance-chart";
import PerformanceChart from "@/components/dashboard/performance-chart";
import SchoolRankings from "@/components/dashboard/school-rankings";
import RecentActivities from "@/components/dashboard/recent-activities";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { User } from "@shared/schema";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const currentDate = format(new Date(), "MMMM d, yyyy");
  
  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock dashboard stats
  const stats = {
    totalSchools: "42",
    totalTeachers: "368",
    totalStudents: "5,247",
    avgAttendance: "92%"
  };
  const statsLoading = false;

  // Mock top schools
  const topSchoolsData = [
    { id: 1, name: "City Public School", score: "92%", change: "+2.4%" },
    { id: 2, name: "Municipal High School", score: "90%", change: "+1.8%" },
    { id: 3, name: "Modern Primary School", score: "88%", change: "+0.6%" },
    { id: 4, name: "Pioneer Academy", score: "87%", change: "-0.5%" },
    { id: 5, name: "Central Elementary", score: "86%", change: "+1.2%" }
  ];
  const topSchoolsLoading = false;

  // Alerts data
  const alerts = [
    {
      id: 1,
      type: "error" as const,
      title: "Low attendance detected at Ghanshyam Vidyalaya",
      description: "Attendance has dropped below 70% for the last 3 consecutive days.",
      time: "2h ago",
      actions: {
        primary: "Investigate",
        secondary: "Dismiss"
      }
    },
    {
      id: 2,
      type: "warning" as const,
      title: "Missing teacher reports from 5 schools",
      description: "Teacher performance reports for February are missing from 5 schools.",
      time: "1d ago",
      actions: {
        primary: "Send Reminder",
        secondary: "Dismiss"
      }
    },
    {
      id: 3,
      type: "success" as const,
      title: "Performance improvement detected",
      description: "Shree Nagar Primary School has shown 15% improvement in test scores.",
      time: "2d ago",
      actions: {
        primary: "View Report",
        secondary: "Dismiss"
      }
    }
  ];

  // Attendance chart data
  const attendanceData = [
    { date: "Mar 1", students: 87, teachers: 96 },
    { date: "Mar 5", students: 85, teachers: 97 },
    { date: "Mar 10", students: 88, teachers: 95 },
    { date: "Mar 15", students: 84, teachers: 94 },
    { date: "Mar 20", students: 89, teachers: 98 },
    { date: "Mar 25", students: 86, teachers: 97 },
    { date: "Mar 30", students: 90, teachers: 99 },
  ];
  
  // Performance chart data
  const performanceData = [
    { name: "Excellent", value: 32, color: "#4CAF50", bgColor: "bg-green-50" },
    { name: "Good", value: 45, color: "#1565C0", bgColor: "bg-blue-50" },
    { name: "Average", value: 18, color: "#FFC107", bgColor: "bg-yellow-50" },
    { name: "Needs Improvement", value: 5, color: "#F44336", bgColor: "bg-red-50" },
  ];

  // Recent activities data
  const activities = [
    {
      id: 1,
      type: "inspection" as const,
      title: "Inspection Report",
      description: "Quarterly inspection completed",
      school: "Shree Nagar Primary School",
      date: "15 Mar, 2023",
      status: "completed" as const
    },
    {
      id: 2,
      type: "report" as const,
      title: "Performance Report",
      description: "Monthly teacher evaluation",
      school: "Mahatma Gandhi School",
      date: "14 Mar, 2023",
      status: "pending" as const
    },
    {
      id: 3,
      type: "event" as const,
      title: "Science Exhibition",
      description: "Annual inter-school competition",
      school: "Vidyanagar Higher Secondary",
      date: "12 Mar, 2023",
      status: "completed" as const
    },
    {
      id: 4,
      type: "issue" as const,
      title: "Infrastructure Issue",
      description: "Water supply problem reported",
      school: "Bhavnagar Public School",
      date: "10 Mar, 2023",
      status: "urgent" as const
    },
    {
      id: 5,
      type: "report" as const,
      title: "Attendance Report",
      description: "Weekly attendance summary",
      school: "Subhash Chandra School",
      date: "09 Mar, 2023",
      status: "completed" as const
    }
  ];

  // Handle alert actions
  const handleAlertAction = (id: number, action: string) => {
    toast({
      title: `Alert ${id} action taken`,
      description: `You chose to ${action.toLowerCase()} this alert`,
    });
  };

  // Handle view school details
  const handleViewSchoolDetails = (id: number) => {
    toast({
      title: "School details",
      description: `Viewing details for school ${id}`,
    });
  };

  // Handle view all schools
  const handleViewAllSchools = () => {
    toast({
      title: "All schools",
      description: "Viewing all schools",
    });
  };

  // Handle view alert details
  const handleViewAlertDetails = () => {
    toast({
      title: "All alerts",
      description: "Viewing all alerts",
    });
  };

  // Handle view activity details
  const handleViewActivityDetails = (id: number) => {
    toast({
      title: "Activity details",
      description: `Viewing details for activity ${id}`,
    });
  };

  return (
    <AppLayout title="Dashboard">
      {/* Date & filter bar */}
      <FilterBar date={currentDate} userName={user?.name || ""} />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Schools"
          value={statsLoading ? "..." : stats?.totalSchools || "0"}
          icon="business"
          change={{ value: "3.2%", isPositive: true }}
          compareText="vs last year"
          color="primary"
        />
        <StatCard
          title="Total Teachers"
          value={statsLoading ? "..." : stats?.totalTeachers || "0"}
          icon="person"
          change={{ value: "5.1%", isPositive: true }}
          compareText="vs last year"
          color="secondary"
        />
        <StatCard
          title="Total Students"
          value={statsLoading ? "..." : stats?.totalStudents || "0"}
          icon="groups"
          change={{ value: "1.8%", isPositive: true }}
          compareText="vs last year"
          color="accent"
        />
        <StatCard
          title="Avg. Attendance"
          value={statsLoading ? "..." : stats?.avgAttendance || "0%"}
          icon="event_available"
          change={{ value: "2.4%", isPositive: false }}
          compareText="vs last month"
          color="error"
        />
      </div>

      {/* AI Alerts */}
      <AIAlerts 
        alerts={alerts} 
        onViewAll={handleViewAlertDetails} 
        onAction={(id, action) => handleAlertAction(id, action)}
      />

      {/* Chart sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AttendanceChart data={attendanceData} />
        <PerformanceChart data={performanceData} />
      </div>

      {/* Recent activities and School rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SchoolRankings 
          schools={topSchoolsLoading ? [] : (topSchoolsData || [])} 
          onViewDetails={handleViewSchoolDetails}
          onViewAll={handleViewAllSchools}
        />
        <RecentActivities 
          activities={activities}
          onViewDetails={handleViewActivityDetails}
        />
      </div>
    </AppLayout>
  );
}
