import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  insertSchoolSchema,
  insertTeacherSchema,
  insertStudentSchema,
  insertAttendanceSchema,
  insertReportSchema,
  insertAlertSchema,
  insertActivitySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Error handler for Zod validation errors
  const handleZodError = (err: unknown, res: any) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({
        message: validationError.message,
        errors: validationError.details
      });
    }
    throw err;
  };

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Middleware to check if user is admin
  const isAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden: Admin access required" });
  };

  // SCHOOLS API
  app.get("/api/schools", isAuthenticated, async (req, res) => {
    try {
      const schools = await storage.getAllSchools();
      res.json(schools);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch schools" });
    }
  });

  app.get("/api/schools/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchool(id);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      
      res.json(school);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch school" });
    }
  });

  app.post("/api/schools", isAdmin, async (req, res) => {
    try {
      const schoolData = insertSchoolSchema.parse(req.body);
      const school = await storage.createSchool(schoolData);
      res.status(201).json(school);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/schools/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchool(id);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      
      const updatedSchool = await storage.updateSchool(id, req.body);
      res.json(updatedSchool);
    } catch (err) {
      res.status(500).json({ message: "Failed to update school" });
    }
  });

  app.delete("/api/schools/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteSchool(id);
      
      if (!result) {
        return res.status(404).json({ message: "School not found" });
      }
      
      res.status(200).json({ message: "School deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete school" });
    }
  });

  // TEACHERS API
  app.get("/api/teachers", isAuthenticated, async (req, res) => {
    try {
      const teachers = await storage.getAllTeachers();
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.get("/api/schools/:schoolId/teachers", isAuthenticated, async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      const teachers = await storage.getTeachersBySchoolId(schoolId);
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.get("/api/teachers/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const teacher = await storage.getTeacher(id);
      
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      
      res.json(teacher);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch teacher" });
    }
  });

  app.post("/api/teachers", isAdmin, async (req, res) => {
    try {
      const teacherData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(teacherData);
      res.status(201).json(teacher);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/teachers/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const teacher = await storage.getTeacher(id);
      
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      
      const updatedTeacher = await storage.updateTeacher(id, req.body);
      res.json(updatedTeacher);
    } catch (err) {
      res.status(500).json({ message: "Failed to update teacher" });
    }
  });

  app.delete("/api/teachers/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteTeacher(id);
      
      if (!result) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      
      res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete teacher" });
    }
  });

  // STUDENTS API
  app.get("/api/students", isAuthenticated, async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/schools/:schoolId/students", isAuthenticated, async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      const students = await storage.getStudentsBySchoolId(schoolId);
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.post("/api/students", isAuthenticated, async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/students/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      const updatedStudent = await storage.updateStudent(id, req.body);
      res.json(updatedStudent);
    } catch (err) {
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteStudent(id);
      
      if (!result) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // ATTENDANCE API
  app.get("/api/attendance", isAuthenticated, async (req, res) => {
    try {
      const attendance = await storage.getAllAttendance();
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch attendance records" });
    }
  });

  app.get("/api/schools/:schoolId/attendance", isAuthenticated, async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      const attendance = await storage.getAttendanceBySchoolId(schoolId);
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch attendance records" });
    }
  });

  app.post("/api/attendance", isAuthenticated, async (req, res) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/attendance/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const attendance = await storage.getAttendance(id);
      
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      
      const updatedAttendance = await storage.updateAttendance(id, req.body);
      res.json(updatedAttendance);
    } catch (err) {
      res.status(500).json({ message: "Failed to update attendance record" });
    }
  });

  // REPORTS API
  app.get("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/schools/:schoolId/reports", isAuthenticated, async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      const reports = await storage.getReportsBySchoolId(schoolId);
      res.json(reports);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.post("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/reports/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      const updatedReport = await storage.updateReport(id, req.body);
      res.json(updatedReport);
    } catch (err) {
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  app.delete("/api/reports/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteReport(id);
      
      if (!result) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.status(200).json({ message: "Report deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete report" });
    }
  });

  // ALERTS API
  app.get("/api/alerts", isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/active", isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch active alerts" });
    }
  });

  app.post("/api/alerts", isAuthenticated, async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/alerts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.getAlert(id);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      const updatedAlert = await storage.updateAlert(id, req.body);
      res.json(updatedAlert);
    } catch (err) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // ACTIVITIES API
  app.get("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/recent", isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  app.get("/api/schools/:schoolId/activities", isAuthenticated, async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      const activities = await storage.getActivitiesBySchoolId(schoolId);
      res.json(activities);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch school activities" });
    }
  });

  app.post("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.put("/api/activities/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = await storage.getActivity(id);
      
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      const updatedActivity = await storage.updateActivity(id, req.body);
      res.json(updatedActivity);
    } catch (err) {
      res.status(500).json({ message: "Failed to update activity" });
    }
  });

  // DASHBOARD API
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const schools = await storage.getAllSchools();
      const teachers = await storage.getAllTeachers();
      const students = await storage.getAllStudents();
      const attendance = await storage.getAllAttendance();
      
      // Calculate attendance percentage
      let studentAttendanceCount = 0;
      let studentTotalCount = 0;
      
      attendance.forEach(record => {
        if (record.type === 'student') {
          studentTotalCount++;
          if (record.status === 'present') {
            studentAttendanceCount++;
          }
        }
      });
      
      const avgAttendance = studentTotalCount > 0 
        ? ((studentAttendanceCount / studentTotalCount) * 100).toFixed(1) 
        : "0.0";
      
      res.json({
        totalSchools: schools.length,
        totalTeachers: teachers.length,
        totalStudents: students.length,
        avgAttendance: `${avgAttendance}%`
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  app.get("/api/dashboard/top-schools", isAuthenticated, async (req, res) => {
    try {
      const schools = await storage.getAllSchools();
      const students = await storage.getAllStudents();
      
      // For demonstration, creating a simple random performance metric
      // In a real app, this would be calculated based on actual performance data
      const topSchools = schools.map(school => {
        const schoolStudents = students.filter(s => s.schoolId === school.id);
        const studentCount = schoolStudents.length;
        
        // Generate a random score between 80 and 95 for demonstration
        const score = (80 + Math.random() * 15).toFixed(1);
        const changePercentage = (Math.random() * 5 * (Math.random() > 0.2 ? 1 : -1)).toFixed(1);
        
        return {
          id: school.id,
          name: school.name,
          score: `${score}%`,
          change: changePercentage,
          studentCount
        };
      });
      
      // Sort by score in descending order
      topSchools.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
      
      res.json(topSchools.slice(0, 5));
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch top schools" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
