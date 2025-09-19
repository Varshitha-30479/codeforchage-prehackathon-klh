import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertScenarioSchema, 
  insertRecommendationSchema, 
  insertUsageSchema,
  insertTwinSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ success: false, error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Financial Scenario routes
  app.get("/api/scenarios/:userId", async (req, res) => {
    try {
      const scenarios = await storage.getScenarios(req.params.userId);
      res.json({ success: true, scenarios });
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/scenarios", async (req, res) => {
    try {
      const scenarioData = insertScenarioSchema.parse(req.body);
      const scenario = await storage.createScenario(scenarioData);
      
      // Track usage for scenario creation
      await storage.createUsageRecord({
        userId: scenarioData.userId,
        action: "scenario_save",
        creditsUsed: 1,
        metadata: { scenarioName: scenarioData.name }
      });
      
      // Update user credits
      await storage.updateUserCredits(scenarioData.userId, 1);
      
      res.json({ success: true, scenario });
    } catch (error) {
      console.error("Error creating scenario:", error);
      res.status(400).json({ success: false, error: "Invalid scenario data" });
    }
  });

  app.put("/api/scenarios/:id", async (req, res) => {
    try {
      const updateData = insertScenarioSchema.partial().parse(req.body);
      const scenario = await storage.updateScenario(req.params.id, updateData);
      
      if (!scenario) {
        return res.status(404).json({ success: false, error: "Scenario not found" });
      }
      
      res.json({ success: true, scenario });
    } catch (error) {
      console.error("Error updating scenario:", error);
      res.status(400).json({ success: false, error: "Invalid scenario data" });
    }
  });

  app.delete("/api/scenarios/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteScenario(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Scenario not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting scenario:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // AI Recommendations routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const recommendations = await storage.getRecommendations(req.params.userId);
      res.json({ success: true, recommendations });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const recommendationData = insertRecommendationSchema.parse(req.body);
      const recommendation = await storage.createRecommendation(recommendationData);
      res.json({ success: true, recommendation });
    } catch (error) {
      console.error("Error creating recommendation:", error);
      res.status(400).json({ success: false, error: "Invalid recommendation data" });
    }
  });

  app.patch("/api/recommendations/:id/apply", async (req, res) => {
    try {
      const applied = await storage.markRecommendationApplied(req.params.id);
      if (!applied) {
        return res.status(404).json({ success: false, error: "Recommendation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error applying recommendation:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Usage Tracking routes
  app.get("/api/usage/:userId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const usage = await storage.getUserUsage(req.params.userId, limit);
      res.json({ success: true, usage });
    } catch (error) {
      console.error("Error fetching usage:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/usage", async (req, res) => {
    try {
      const usageData = insertUsageSchema.parse(req.body);
      const usage = await storage.createUsageRecord(usageData);
      
      // Update user credits
      await storage.updateUserCredits(usageData.userId, usageData.creditsUsed);
      
      res.json({ success: true, usage });
    } catch (error) {
      console.error("Error creating usage record:", error);
      res.status(400).json({ success: false, error: "Invalid usage data" });
    }
  });

  // Financial Twin routes
  app.get("/api/financial-twins", async (req, res) => {
    try {
      const industry = req.query.industry as string;
      const twins = industry 
        ? await storage.getFinancialTwinsByIndustry(industry)
        : await storage.getFinancialTwins();
      res.json({ success: true, twins });
    } catch (error) {
      console.error("Error fetching financial twins:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/financial-twins", async (req, res) => {
    try {
      const twinData = insertTwinSchema.parse(req.body);
      const twin = await storage.createFinancialTwin(twinData);
      res.json({ success: true, twin });
    } catch (error) {
      console.error("Error creating financial twin:", error);
      res.status(400).json({ success: false, error: "Invalid twin data" });
    }
  });

  // AI-powered recommendation generation endpoint (placeholder for OpenAI integration)
  app.post("/api/generate-recommendations", async (req, res) => {
    try {
      const { userId, scenarioData } = req.body;
      
      if (!userId || !scenarioData) {
        return res.status(400).json({ success: false, error: "Missing required data" });
      }

      // For now, return mock recommendations - will be replaced with OpenAI integration
      const mockRecommendations = [
        {
          userId,
          scenarioId: scenarioData.id || null,
          title: "Optimize Marketing Spend",
          description: "Based on your current burn rate, consider reducing marketing expenses by 15% to extend runway by 2.3 months.",
          impact: "medium",
          category: "cost"
        },
        {
          userId,
          scenarioId: scenarioData.id || null,
          title: "Revenue Diversification",
          description: "Explore additional revenue streams to reduce dependency on your primary product. Consider upselling existing customers.",
          impact: "high",
          category: "revenue"
        }
      ];

      const recommendations = [];
      for (const recData of mockRecommendations) {
        const recommendation = await storage.createRecommendation(recData);
        recommendations.push(recommendation);
      }

      // Track usage for AI recommendation generation
      await storage.createUsageRecord({
        userId,
        action: "ai_recommendation",
        creditsUsed: 5,
        metadata: { scenarioId: scenarioData.id }
      });
      
      // Update user credits
      await storage.updateUserCredits(userId, 5);

      res.json({ success: true, recommendations });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
