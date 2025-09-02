import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStoryTemplateSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) and PDF files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.listTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get template by ID
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Create new template
  app.post("/api/templates", upload.fields([
    { name: "background", maxCount: 1 },
    { name: "floorPlan", maxCount: 1 }
  ]), async (req, res) => {
    try {
      let data;
      
      // Handle both JSON and form-data
      if (req.body.data) {
        data = JSON.parse(req.body.data);
      } else {
        // Extract data from form fields
        data = {
          name: req.body.name || "Новый проект",
          propertyAddress: req.body.propertyAddress || "",
          propertyType: req.body.propertyType || "2k",
          propertyArea: parseFloat(req.body.propertyArea) || 0,
          totalCost: parseInt(req.body.totalCost) || 0,
          initialPayment: parseInt(req.body.initialPayment) || 0,
          bankRate: parseFloat(req.body.bankRate) || 0,
          monthlyPayment: parseFloat(req.body.monthlyPayment) || 0,
          selectedBank: req.body.selectedBank || "sovkombank",
        };
      }
      
      const validationResult = insertStoryTemplateSchema.safeParse(data);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors,
        });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      // In a real app, you would upload these files to cloud storage
      // For now, we'll just store the file names
      const templateData = {
        ...validationResult.data,
        backgroundImageUrl: files?.background?.[0]?.originalname || null,
        floorPlanUrl: files?.floorPlan?.[0]?.originalname || null,
      };

      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update template by ID
  app.put("/api/templates/:id", upload.fields([
    { name: "background", maxCount: 1 },
    { name: "floorPlan", maxCount: 1 }
  ]), async (req, res) => {
    try {
      let data;
      
      // Handle both JSON and form-data
      if (req.body.data) {
        data = JSON.parse(req.body.data);
      } else {
        // Extract data from form fields
        data = {
          name: req.body.name || "Новый проект",
          propertyAddress: req.body.propertyAddress || "",
          propertyType: req.body.propertyType || "2k",
          propertyArea: parseFloat(req.body.propertyArea) || 0,
          totalCost: parseInt(req.body.totalCost) || 0,
          initialPayment: parseInt(req.body.initialPayment) || 0,
          bankRate: parseFloat(req.body.bankRate) || 0,
          monthlyPayment: parseFloat(req.body.monthlyPayment) || 0,
          selectedBank: req.body.selectedBank || "sovkombank",
        };
      }
      
      const validationResult = insertStoryTemplateSchema.safeParse(data);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: validationResult.error.errors,
        });
      }

      // Check if template exists
      const existingTemplate = await storage.getTemplate(req.params.id);
      if (!existingTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      // Use new files if provided, otherwise keep existing ones
      const templateData = {
        ...validationResult.data,
        backgroundImageUrl: files?.background?.[0]?.originalname || existingTemplate.backgroundImageUrl,
        floorPlanUrl: files?.floorPlan?.[0]?.originalname || existingTemplate.floorPlanUrl,
      };

      const updatedTemplate = await storage.updateTemplate(req.params.id, templateData);
      
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(updatedTemplate);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
