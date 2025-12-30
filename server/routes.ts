import express, { type Express } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import { storage } from "./storage";
import { insertIntakeSubmissionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { ensureUploadsRoot, readPacketIndex, templatesRoot, upsertCompletedForm, uploadsRoot } from "./intake/indexStore";
import { buildIntakePdf } from "./intake/pdfBuild";
import { generateThumbnail } from "./intake/thumb";
import { sendPacketEmail } from "./intake/email";
import { convertDocxTemplates } from "./intake/docxConvert";
import crypto from "crypto";
import { getAuthorizeUrl, isClioConfigured } from "./integrations/clio";
import {
  allowedFormTypes,
  ensureTemplatesExist,
  ensureFieldMapsExist,
  getIntakeDefForFormType,
  getTemplateMeta,
  ensurePreviewPng,
  listFields,
  type FormType,
} from "./intake/templateTools";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await ensureUploadsRoot();
  app.use("/uploads", express.static(uploadsRoot));

  // Dev-only: static serving of templates and previews
  if (process.env.NODE_ENV !== "production") {
    app.use("/__templates", express.static(templatesRoot));
    app.use("/__template-previews", express.static(path.join(templatesRoot, "_previews")));
  }

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

  app.get("/api/integrations/clio/status", (_req, res) => {
    res.json({ configured: isClioConfigured() });
  });

  app.get("/api/integrations/clio/authorize", (req, res) => {
    if (!isClioConfigured()) {
      return res.status(400).json({ message: "Clio OAuth is not configured." });
    }

    const state = typeof req.query.state === "string" ? req.query.state : crypto.randomUUID();

    try {
      const authorizeUrl = getAuthorizeUrl(state);
      return res.redirect(authorizeUrl);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.get("/api/integrations/clio/callback", (req, res) => {
    if (!isClioConfigured()) {
      return res.status(501).json({ message: "Not implemented. Configure Clio OAuth to enable callback handling." });
    }

    const code = typeof req.query.code === "string" ? req.query.code : null;
    if (!code) {
      return res.status(400).json({ message: "Missing code query param." });
    }

    return res.json({
      message: "TODO: exchange code for tokens.",
      code,
      state: typeof req.query.state === "string" ? req.query.state : null,
    });
  });

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
      const { sessionId, category, answers, presentation } = req.body ?? {};

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

      const outputDir = path.join(uploadsRoot, sessionId, packetId, formType);
      const pdfPath = path.join(outputDir, "filled.pdf");
      const answersPath = path.join(outputDir, "answers.json");
      const thumbPath = path.join(outputDir, "thumb.png");

      // Build PDF using unified entry point
      const { pdfBytes, pageCount, mode } = await buildIntakePdf({
        formType,
        sessionId,
        packetId,
        category: normalizedCategory,
        answers,
        presentation,
      });

      // Write PDF and answers
      await fsp.mkdir(outputDir, { recursive: true });
      await fsp.writeFile(pdfPath, pdfBytes);
      await fsp.writeFile(answersPath, JSON.stringify(answers, null, 2), "utf-8");

      // Try to generate thumbnail (non-blocking)
      let thumbUrl: string | null = null;
      try {
        await generateThumbnail(pdfPath, thumbPath);
        thumbUrl = `/uploads/${sessionId}/${packetId}/${formType}/thumb.png`;
      } catch (thumbError) {
        // Thumbnail generation failed, but don't fail the request
        console.warn(`Thumbnail generation failed for ${formType}:`, thumbError);
        // Try to use logo as placeholder if available
        const logoPath = path.resolve(process.cwd(), "client", "public", "brand", "logo-black.png");
        if (fs.existsSync(logoPath)) {
          try {
            await fsp.copyFile(logoPath, thumbPath);
            thumbUrl = `/uploads/${sessionId}/${packetId}/${formType}/thumb.png`;
          } catch {
            // Ignore logo copy failure
          }
        }
      }

      const updatedIndex = await upsertCompletedForm({
        sessionId,
        packetId,
        category: normalizedCategory,
        formType,
        pageCount,
        pdfMode: mode,
        thumbUrl,
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

  // Dev-only: setup templates and field maps
  app.post("/api/client-intake/dev/setup-templates", async (_req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ message: "Setup route disabled in production" });
      }

      const templatesResult = await ensureTemplatesExist();
      const fieldMapsResult = await ensureFieldMapsExist();

      res.json({
        templates: templatesResult,
        fieldMaps: fieldMapsResult,
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Dev-only: get mapper data for a form type
  app.get("/api/client-intake/dev/mapper/:formType", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ message: "Mapper route disabled in production" });
      }

      const { formType } = req.params;
      const page = parseInt(req.query.page as string) || 1;

      if (!allowedFormTypes.includes(formType as FormType)) {
        return res.status(400).json({ message: `Unsupported form type: ${formType}` });
      }

      const def = getIntakeDefForFormType(formType as FormType);
      if (!def) {
        return res.status(400).json({ message: `No intake definition for form type: ${formType}` });
      }

      const meta = await getTemplateMeta(formType as FormType);
      await ensurePreviewPng(formType as FormType, page);

      const fields = listFields(def);
      const fieldsPath = path.join(templatesRoot, `${formType}.fields.json`);
      let placements: Array<{ key: string; page: number; x: number; y: number; size: number; label?: string }> = [];

      if (fs.existsSync(fieldsPath)) {
        const fieldsData = JSON.parse(await fsp.readFile(fieldsPath, "utf-8"));
        if (fieldsData.fields && Array.isArray(fieldsData.fields)) {
          placements = fieldsData.fields;
        }
      }

      const currentPageMeta = meta.pages[page - 1];
      if (!currentPageMeta) {
        return res.status(400).json({ message: `Page ${page} does not exist (total pages: ${meta.pageCount})` });
      }

      res.json({
        formType,
        templatePdfUrl: `/__templates/${formType}.template.pdf`,
        previewPngUrl: `/__template-previews/${formType}-p${page}.png`,
        page,
        pageCount: meta.pageCount,
        pageWidth: currentPageMeta.width,
        pageHeight: currentPageMeta.height,
        fields,
        placements,
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Dev-only: save field placements
  app.post("/api/client-intake/dev/mapper/:formType/save", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ message: "Save route disabled in production" });
      }

      const { formType } = req.params;
      const { fields } = req.body;

      if (!allowedFormTypes.includes(formType as FormType)) {
        return res.status(400).json({ message: `Unsupported form type: ${formType}` });
      }

      if (!fields || !Array.isArray(fields)) {
        return res.status(400).json({ message: "fields must be an array" });
      }

      const fieldsPath = path.join(templatesRoot, `${formType}.fields.json`);
      await fsp.writeFile(fieldsPath, JSON.stringify({ fields }, null, 2), "utf-8");

      res.json({ ok: true });
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

  // Pre-intake submission endpoint (lightweight, flexible schema)
  app.post("/api/pre-intake", async (req, res) => {
    try {
      const data = req.body;
      
      // Basic validation
      if (!data.fullName || !data.email || !data.phone || !data.serviceType) {
        return res.status(400).json({ error: "Missing required fields: fullName, email, phone, serviceType" });
      }

      // Store in a simple JSON file or log for now (can be migrated to DB later)
      // For now, just log and return success
      console.log("Pre-intake submission received:", JSON.stringify(data, null, 2));
      
      res.json({ success: true, message: "Pre-intake submission received" });
    } catch (error) {
      console.error("Error processing pre-intake submission:", error);
      res.status(500).json({ error: "Failed to process pre-intake submission" });
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
