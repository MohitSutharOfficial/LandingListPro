import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("teacher"), // admin, principal, teacher
  schoolId: integer("school_id").references(() => schools.id, { onDelete: "set null" }),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// School schema
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  principalId: integer("principal_id"),
  type: text("type").notNull(), // primary, secondary, higher-secondary
  status: text("status").notNull().default("active"), // active, inactive
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  principalId: true,
});

// Teacher schema
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  schoolId: integer("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  subjects: text("subjects").array(),
  qualification: text("qualification").notNull(),
  joiningDate: timestamp("joining_date").notNull(),
  performanceScore: real("performance_score"),
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  performanceScore: true,
});

// Student schema
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rollNumber: text("roll_number").notNull(),
  schoolId: integer("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  grade: text("grade").notNull(),
  section: text("section").notNull(),
  guardianName: text("guardian_name").notNull(),
  guardianPhone: text("guardian_phone").notNull(),
  performanceScore: real("performance_score"),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  performanceScore: true,
});

// Attendance schema
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  schoolId: integer("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").references(() => teachers.id, { onDelete: "cascade" }),
  studentId: integer("student_id").references(() => students.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // teacher, student
  status: text("status").notNull(), // present, absent, late
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

// Reports schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // inspection, performance, attendance
  schoolId: integer("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, archived
  data: json("data").notNull(),
  generatedBy: integer("generated_by").notNull().references(() => users.id),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
});

// Alerts schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // warning, info, success, error
  schoolId: integer("school_id").references(() => schools.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"), // active, dismissed, resolved
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Activities schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // inspection, report, event, issue
  schoolId: integer("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // completed, pending, urgent
  createdBy: integer("created_by").notNull().references(() => users.id),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
