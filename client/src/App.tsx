import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import SchoolsPage from "@/pages/schools-page";
import TeachersPage from "@/pages/teachers-page";
import StudentsPage from "@/pages/students-page";
import ReportsPage from "@/pages/reports-page";
import AttendancePage from "@/pages/attendance-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "@/lib/protected-route";

function App() {
  return (
    <>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={DashboardPage} />
        <ProtectedRoute path="/schools" component={SchoolsPage} />
        <ProtectedRoute path="/teachers" component={TeachersPage} />
        <ProtectedRoute path="/students" component={StudentsPage} />
        <ProtectedRoute path="/reports" component={ReportsPage} />
        <ProtectedRoute path="/attendance" component={AttendancePage} />
        <ProtectedRoute path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
