import express, { type Express } from "express";
import type { Server } from "http";
import path from "path";
import { promises as fsp } from "fs";
import { storage } from "./storage";
import { insertIntakeSubmissionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { ensureUploadsRoot, readPacketIndex, templatesRoot, upsertCompletedForm, uploadsRoot } from "./intake/indexStore";
import { fillPdfFromTemplate } from "./intake/pdfFill";
import { generateThumbnail } from "./intake/thumb";
import { sendPacketEmail } from "./intake/email";
import { convertDocxTemplates } from "./intake/docxConvert";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await ensureUploadsRoot();
  app.use("/uploads", express.static(uploadsRoot));

  const allowedCategories = new Set([
    "divorce",
    "modification",
    "enforcement",
    "adoption",
    "mediation",
    "marital-agreement",
    "prenuptial-agreement",
    "wills-trusts-estates",
    "unsure",
    "not-sure",
  ]);

  const allowedFormTypes = new Set([
    "basic-intake",
    "divorce",
    "modification",
    "enforcement",
    "adoption",
    "mediation",
    "marital-agreement",
    "prenuptial-agreement",
    "wills-trusts-estates",
    "unsure",
  ]);

  const normalizeCategory = (category: string) => {
    const lowered = (category || "").toLowerCase();
    if (lowered === "not-sure") return "unsure";
    return lowered;
  };

  const validateId = (label: string, value: string) => {
    if (!value || !/^[a-zA-Z0-9-]+$/.test(value)) {
      const err = new Error(`${label} is invalid.`);
      (err as Error & { status?: number }).status = 400;
      throw err;
    }
  };

  const handleError = (res: express.Response, error: unknown) => {
    const status =
      error && typeof error === "object" && "status" in error && typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    const message =
      error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string"
        ? (error as { message: string }).message
        : "Internal Server Error";
    res.status(status).json({ message });
  };

  // Completed forms index
  app.get("/api/client-intake/sessions/:sessionId/packets/:packetId/completed", async (req, res) => {
    try {
      const { sessionId, packetId } = req.params;
      validateId("sessionId", sessionId);
      validateId("packetId", packetId);

      const index = await readPacketIndex(sessionId, packetId);
      if (!index) {
        return res.status(404).json({ message: "No completed forms for this packet yet." });
      }

      return res.json(index);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Mark form complete + generate artifacts
  app.post("/api/client-intake/packets/:packetId/forms/:formType/complete", async (req, res) => {
    try {
      const { packetId, formType } = req.params;
      const { sessionId, category, answers } = req.body ?? {};

      validateId("packetId", packetId);
      validateId("sessionId", sessionId);

      if (!allowedFormTypes.has(formType)) {
        return res.status(400).json({ message: `Unsupported form type: ${formType}` });
      }

      const normalizedCategory = normalizeCategory(category);
      if (!allowedCategories.has(normalizedCategory)) {
        return res.status(400).json({ message: `Unsupported category: ${category}` });
      }

      if (!answers || typeof answers !== "object") {
        return res.status(400).json({ message: "answers must be an object" });
      }

      const templatePath = path.join(templatesRoot, `${formType}.template.pdf`);
      const fieldsPath = path.join(templatesRoot, `${formType}.fields.json`);
      const outputDir = path.join(uploadsRoot, sessionId, packetId, formType);
      const pdfPath = path.join(outputDir, "filled.pdf");
      const answersPath = path.join(outputDir, "answers.json");
      const thumbPath = path.join(outputDir, "thumb.png");

      const { pageCount } = await fillPdfFromTemplate({
        templatePath,
        fieldsPath,
        outputPath: pdfPath,
        answers,
      });

      await fsp.mkdir(outputDir, { recursive: true });
      await fsp.writeFile(answersPath, JSON.stringify(answers, null, 2), "utf-8");

      await generateThumbnail(pdfPath, thumbPath);

      const updatedIndex = await upsertCompletedForm({
        sessionId,
        packetId,
        category: normalizedCategory,
        formType,
        pageCount,
      });

      const completed = updatedIndex.completedForms.find((f) => f.formType === formType);
      return res.json({
        packetId,
        sessionId,
        category: updatedIndex.category,
        completedForm: completed,
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Submit packet via email
  app.post("/api/client-intake/sessions/:sessionId/packets/:packetId/submit", async (req, res) => {
    try {
      const { sessionId, packetId } = req.params;
      validateId("sessionId", sessionId);
      validateId("packetId", packetId);

      await sendPacketEmail({ sessionId, packetId });
      res.json({ message: "Submitted" });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Dev-only: convert DOCX templates using LibreOffice
  app.post("/api/client-intake/dev/convert-docx", async (_req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ message: "Conversion route disabled in production" });
      }
      const result = await convertDocxTemplates();
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Intake Submissions API
  app.post("/api/intake", async (req, res) => {
    try {
      const validatedData = insertIntakeSubmissionSchema.parse(req.body);
      const submission = await storage.createIntakeSubmission(validatedData);
      res.json(submission);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
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
