import { type StoryTemplate, type InsertStoryTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTemplate(id: string): Promise<StoryTemplate | undefined>;
  createTemplate(template: InsertStoryTemplate): Promise<StoryTemplate>;
  listTemplates(): Promise<StoryTemplate[]>;
}

export class MemStorage implements IStorage {
  private templates: Map<string, StoryTemplate>;

  constructor() {
    this.templates = new Map();
  }

  async getTemplate(id: string): Promise<StoryTemplate | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertStoryTemplate): Promise<StoryTemplate> {
    const id = randomUUID();
    const template: StoryTemplate = {
      ...insertTemplate,
      id,
      createdAt: new Date().toISOString(),
      backgroundImageUrl: insertTemplate.backgroundImageUrl || null,
      floorPlanUrl: insertTemplate.floorPlanUrl || null,
    };
    this.templates.set(id, template);
    return template;
  }

  async listTemplates(): Promise<StoryTemplate[]> {
    return Array.from(this.templates.values());
  }
}

export const storage = new MemStorage();
