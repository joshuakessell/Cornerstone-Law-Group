import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Intake submissions table
export const intakeSubmissions = pgTable("intake_submissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  occupation: text("occupation"),
  employer: text("employer"),
  
  opposingName: text("opposing_name").notNull(),
  relationship: text("relationship").notNull(),
  dateOfMarriage: text("date_of_marriage"),
  dateOfSeparation: text("date_of_separation"),
  opposingAttorney: text("opposing_attorney"),
  
  hasChildren: text("has_children").notNull(),
  childrenDetails: text("children_details"),
  
  primaryIssue: text("primary_issue").notNull(),
  description: text("description").notNull(),
  goals: text("goals").notNull(),
  
  status: text("status").notNull().default("New"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertIntakeSubmissionSchema = createInsertSchema(intakeSubmissions).omit({
  id: true,
  submittedAt: true,
  status: true,
});

export type InsertIntakeSubmission = z.infer<typeof insertIntakeSubmissionSchema>;
export type IntakeSubmission = typeof intakeSubmissions.$inferSelect;

// Admin users table (simple password-based auth)
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
