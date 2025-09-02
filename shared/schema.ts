import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const storyTemplates = pgTable("story_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  propertyAddress: text("property_address").notNull(),
  propertyType: text("property_type").notNull(),
  propertyArea: real("property_area").notNull(),
  totalCost: integer("total_cost").notNull(),
  initialPayment: integer("initial_payment").notNull(),
  bankRate: real("bank_rate").notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  selectedBank: text("selected_bank").notNull(),
  backgroundImageUrl: text("background_image_url"),
  floorPlanUrl: text("floor_plan_url"),
  floorPlanPosition: text("floor_plan_position"), // JSON string
  backgroundPosition: text("background_position"), // JSON string
  createdAt: text("created_at").default(sql`now()`),
});

export const insertStoryTemplateSchema = createInsertSchema(storyTemplates).omit({
  id: true,
  createdAt: true,
});

export type InsertStoryTemplate = z.infer<typeof insertStoryTemplateSchema>;
export type StoryTemplate = typeof storyTemplates.$inferSelect;

// Form validation schemas
export const propertyFormSchema = z.object({
  name: z.string().min(1, "Название обязательно").optional().default("Новый проект"),
  propertyAddress: z.string().min(1, "Адрес обязателен"),
  propertyType: z.enum(["1k", "2k", "3k", "studio"]),
  propertyArea: z.number().min(1, "Площадь должна быть больше 0"),
  totalCost: z.number().min(1, "Стоимость должна быть больше 0"),
  initialPayment: z.number().min(1, "Первый взнос должен быть больше 0"),
  bankRate: z.number().min(0.01, "Ставка должна быть больше 0"),
  monthlyPayment: z.number().min(0.01, "Платёж должен быть больше 0"),
  selectedBank: z.enum(["sovkombank", "sberbank", "vtb", "alfabank", "tinkoff"]),
  floorPlanPosition: z.string().optional(),
  backgroundPosition: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
