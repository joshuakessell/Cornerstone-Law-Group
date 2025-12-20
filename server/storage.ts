import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { 
  type IntakeSubmission, 
  type InsertIntakeSubmission,
  type AdminUser,
  type InsertAdminUser,
  intakeSubmissions,
  adminUsers
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  // Intake submissions
  createIntakeSubmission(data: InsertIntakeSubmission): Promise<IntakeSubmission>;
  getIntakeSubmissions(): Promise<IntakeSubmission[]>;
  getIntakeSubmissionById(id: number): Promise<IntakeSubmission | undefined>;
  updateIntakeSubmissionStatus(id: number, status: string): Promise<IntakeSubmission | undefined>;
  deleteIntakeSubmission(id: number): Promise<boolean>;
  
  // Admin users
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(data: InsertAdminUser): Promise<AdminUser>;
}

export class DatabaseStorage implements IStorage {
  // Intake submissions
  async createIntakeSubmission(data: InsertIntakeSubmission): Promise<IntakeSubmission> {
    const [submission] = await db.insert(intakeSubmissions).values(data).returning();
    return submission;
  }

  async getIntakeSubmissions(): Promise<IntakeSubmission[]> {
    return await db.select().from(intakeSubmissions).orderBy(desc(intakeSubmissions.submittedAt));
  }

  async getIntakeSubmissionById(id: number): Promise<IntakeSubmission | undefined> {
    const [submission] = await db.select().from(intakeSubmissions).where(eq(intakeSubmissions.id, id));
    return submission;
  }

  async updateIntakeSubmissionStatus(id: number, status: string): Promise<IntakeSubmission | undefined> {
    const [updated] = await db
      .update(intakeSubmissions)
      .set({ status })
      .where(eq(intakeSubmissions.id, id))
      .returning();
    return updated;
  }

  async deleteIntakeSubmission(id: number): Promise<boolean> {
    const result = await db.delete(intakeSubmissions).where(eq(intakeSubmissions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Admin users
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(data: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(data).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
