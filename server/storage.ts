import { 
  users, type User, type InsertUser,
  schools, type School, type InsertSchool,
  teachers, type Teacher, type InsertTeacher,
  students, type Student, type InsertStudent,
  attendance, type Attendance, type InsertAttendance,
  reports, type Report, type InsertReport,
  alerts, type Alert, type InsertAlert,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Schools
  getSchool(id: number): Promise<School | undefined>;
  getSchoolByCode(code: string): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: number, school: Partial<School>): Promise<School | undefined>;
  deleteSchool(id: number): Promise<boolean>;
  getAllSchools(): Promise<School[]>;
  
  // Teachers
  getTeacher(id: number): Promise<Teacher | undefined>;
  getTeacherByUserId(userId: number): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<Teacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: number): Promise<boolean>;
  getTeachersBySchoolId(schoolId: number): Promise<Teacher[]>;
  getAllTeachers(): Promise<Teacher[]>;
  
  // Students
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<Student>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  getStudentsBySchoolId(schoolId: number): Promise<Student[]>;
  getAllStudents(): Promise<Student[]>;
  
  // Attendance
  getAttendance(id: number): Promise<Attendance | undefined>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<Attendance>): Promise<Attendance | undefined>;
  getAttendanceByDate(date: Date, schoolId: number): Promise<Attendance[]>;
  getAttendanceForTeacher(teacherId: number): Promise<Attendance[]>;
  getAttendanceForStudent(studentId: number): Promise<Attendance[]>;
  getAttendanceBySchoolId(schoolId: number): Promise<Attendance[]>;
  getAllAttendance(): Promise<Attendance[]>;
  
  // Reports
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  deleteReport(id: number): Promise<boolean>;
  getReportsBySchoolId(schoolId: number): Promise<Report[]>;
  getReportsByType(type: string): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  
  // Alerts
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<Alert>): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;
  getAlertsBySchoolId(schoolId: number): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  getAllAlerts(): Promise<Alert[]>;
  
  // Activities
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<Activity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;
  getActivitiesBySchoolId(schoolId: number): Promise<Activity[]>;
  getActivitiesByType(type: string): Promise<Activity[]>;
  getRecentActivities(limit: number): Promise<Activity[]>;
  getAllActivities(): Promise<Activity[]>;

}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private schools: Map<number, School>;
  private teachers: Map<number, Teacher>;
  private students: Map<number, Student>;
  private attendance: Map<number, Attendance>;
  private reports: Map<number, Report>;
  private alerts: Map<number, Alert>;
  private activities: Map<number, Activity>;
  
  private userIdCounter: number;
  private schoolIdCounter: number;
  private teacherIdCounter: number;
  private studentIdCounter: number;
  private attendanceIdCounter: number;
  private reportIdCounter: number;
  private alertIdCounter: number;
  private activityIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.schools = new Map();
    this.teachers = new Map();
    this.students = new Map();
    this.attendance = new Map();
    this.reports = new Map();
    this.alerts = new Map();
    this.activities = new Map();
    
    this.userIdCounter = 1;
    this.schoolIdCounter = 1;
    this.teacherIdCounter = 1;
    this.studentIdCounter = 1;
    this.attendanceIdCounter = 1;
    this.reportIdCounter = 1;
    this.alertIdCounter = 1;
    this.activityIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // School methods
  async getSchool(id: number): Promise<School | undefined> {
    return this.schools.get(id);
  }

  async getSchoolByCode(code: string): Promise<School | undefined> {
    return Array.from(this.schools.values()).find(
      (school) => school.code === code,
    );
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const id = this.schoolIdCounter++;
    const school: School = { ...insertSchool, id, principalId: null };
    this.schools.set(id, school);
    return school;
  }

  async updateSchool(id: number, schoolData: Partial<School>): Promise<School | undefined> {
    const school = this.schools.get(id);
    if (!school) return undefined;
    
    const updatedSchool = { ...school, ...schoolData };
    this.schools.set(id, updatedSchool);
    return updatedSchool;
  }

  async deleteSchool(id: number): Promise<boolean> {
    return this.schools.delete(id);
  }

  async getAllSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }
  
  // Teacher methods
  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeacherByUserId(userId: number): Promise<Teacher | undefined> {
    return Array.from(this.teachers.values()).find(
      (teacher) => teacher.userId === userId,
    );
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = this.teacherIdCounter++;
    const teacher: Teacher = { ...insertTeacher, id, performanceScore: null };
    this.teachers.set(id, teacher);
    return teacher;
  }

  async updateTeacher(id: number, teacherData: Partial<Teacher>): Promise<Teacher | undefined> {
    const teacher = this.teachers.get(id);
    if (!teacher) return undefined;
    
    const updatedTeacher = { ...teacher, ...teacherData };
    this.teachers.set(id, updatedTeacher);
    return updatedTeacher;
  }

  async deleteTeacher(id: number): Promise<boolean> {
    return this.teachers.delete(id);
  }

  async getTeachersBySchoolId(schoolId: number): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).filter(
      (teacher) => teacher.schoolId === schoolId,
    );
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }
  
  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.studentIdCounter++;
    const student: Student = { ...insertStudent, id, performanceScore: null };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, studentData: Partial<Student>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...studentData };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  async getStudentsBySchoolId(schoolId: number): Promise<Student[]> {
    return Array.from(this.students.values()).filter(
      (student) => student.schoolId === schoolId,
    );
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }
  
  // Attendance methods
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceIdCounter++;
    const attendance: Attendance = { ...insertAttendance, id };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, attendanceData: Partial<Attendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    
    const updatedAttendance = { ...attendance, ...attendanceData };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async getAttendanceByDate(date: Date, schoolId: number): Promise<Attendance[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.attendance.values()).filter((a) => {
      const attendanceDate = new Date(a.date).toISOString().split('T')[0];
      return attendanceDate === dateString && a.schoolId === schoolId;
    });
  }

  async getAttendanceForTeacher(teacherId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (a) => a.type === 'teacher' && a.teacherId === teacherId,
    );
  }

  async getAttendanceForStudent(studentId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (a) => a.type === 'student' && a.studentId === studentId,
    );
  }

  async getAttendanceBySchoolId(schoolId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (a) => a.schoolId === schoolId,
    );
  }

  async getAllAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }
  
  // Report methods
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const report: Report = { ...insertReport, id };
    this.reports.set(id, report);
    return report;
  }

  async updateReport(id: number, reportData: Partial<Report>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...reportData };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async deleteReport(id: number): Promise<boolean> {
    return this.reports.delete(id);
  }

  async getReportsBySchoolId(schoolId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.schoolId === schoolId,
    );
  }

  async getReportsByType(type: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.type === type,
    );
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }
  
  // Alert methods
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertIdCounter++;
    const createdAt = new Date();
    const alert: Alert = { ...insertAlert, id, createdAt };
    this.alerts.set(id, alert);
    return alert;
  }

  async updateAlert(id: number, alertData: Partial<Alert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...alertData };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async deleteAlert(id: number): Promise<boolean> {
    return this.alerts.delete(id);
  }

  async getAlertsBySchoolId(schoolId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.schoolId === schoolId,
    );
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.status === 'active',
    );
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }
  
  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    
    const updatedActivity = { ...activity, ...activityData };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }

  async deleteActivity(id: number): Promise<boolean> {
    return this.activities.delete(id);
  }

  async getActivitiesBySchoolId(schoolId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.schoolId === schoolId,
    );
  }

  async getActivitiesByType(type: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.type === type,
    );
  }

  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
}

export const storage = new MemStorage();
