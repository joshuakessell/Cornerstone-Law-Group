import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIntakeSubmissionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import bcrypt from "bcrypt";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Intake Submissions API
  app.post("/api/intake", async (req, res) => {
    try {
      const validatedData = insertIntakeSubmissionSchema.parse(req.body);
      const submission = await storage.createIntakeSubmission(validatedData);
      res.json(submission);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating intake submission:", error);
      res.status(500).json({ error: "Failed to create intake submission" });
    }
  });

  app.get("/api/intake", async (req, res) => {
    try {
      const submissions = await storage.getIntakeSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching intake submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/intake/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getIntakeSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.patch("/api/intake/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const updated = await storage.updateIntakeSubmissionStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating submission status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.delete("/api/intake/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteIntakeSubmission(id);
      if (!deleted) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({ error: "Failed to delete submission" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getAdminUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ success: true, username: user.username });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Seed admin user if none exists (for demo purposes)
  app.post("/api/admin/seed", async (req, res) => {
    try {
      const existing = await storage.getAdminUserByUsername("admin");
      if (existing) {
        return res.json({ message: "Admin user already exists" });
      }
      
      const passwordHash = await bcrypt.hash("admin123", 10);
      await storage.createAdminUser({ username: "admin", passwordHash });
      
      res.json({ message: "Admin user created with username 'admin' and password 'admin123'" });
    } catch (error) {
      console.error("Error seeding admin:", error);
      res.status(500).json({ error: "Failed to seed admin user" });
    }
  });

  return httpServer;
}
