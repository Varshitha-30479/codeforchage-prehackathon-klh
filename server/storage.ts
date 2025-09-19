import { 
  type User, 
  type InsertUser,
  type FinancialScenario,
  type InsertScenario,
  type AIRecommendation,
  type InsertRecommendation,
  type UsageTracking,
  type InsertUsage,
  type FinancialTwin,
  type InsertTwin
} from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for all CFO Helper operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: string, creditsUsed: number): Promise<User | undefined>;
  
  // Financial Scenario operations
  getScenarios(userId: string): Promise<FinancialScenario[]>;
  getScenario(id: string): Promise<FinancialScenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<FinancialScenario>;
  updateScenario(id: string, scenario: Partial<InsertScenario>): Promise<FinancialScenario | undefined>;
  deleteScenario(id: string): Promise<boolean>;
  
  // AI Recommendations operations
  getRecommendations(userId: string): Promise<AIRecommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<AIRecommendation>;
  markRecommendationApplied(id: string): Promise<boolean>;
  
  // Usage Tracking operations
  createUsageRecord(usage: InsertUsage): Promise<UsageTracking>;
  getUserUsage(userId: string, limit?: number): Promise<UsageTracking[]>;
  
  // Financial Twin operations
  getFinancialTwins(): Promise<FinancialTwin[]>;
  getFinancialTwinsByIndustry(industry: string): Promise<FinancialTwin[]>;
  createFinancialTwin(twin: InsertTwin): Promise<FinancialTwin>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scenarios: Map<string, FinancialScenario>;
  private recommendations: Map<string, AIRecommendation>;
  private usage: Map<string, UsageTracking>;
  private twins: Map<string, FinancialTwin>;

  constructor() {
    this.users = new Map();
    this.scenarios = new Map();
    this.recommendations = new Map();
    this.usage = new Map();
    this.twins = new Map();
    
    // Seed some financial twin data
    this.seedFinancialTwins();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      companyName: insertUser.companyName || null,
      industry: insertUser.industry || null,
      teamSize: insertUser.teamSize || null,
      creditsUsed: 0,
      creditsRemaining: 100,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: string, creditsUsed: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      creditsUsed: (user.creditsUsed || 0) + creditsUsed,
      creditsRemaining: (user.creditsRemaining || 0) - creditsUsed
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Financial Scenario operations
  async getScenarios(userId: string): Promise<FinancialScenario[]> {
    return Array.from(this.scenarios.values()).filter(s => s.userId === userId);
  }

  async getScenario(id: string): Promise<FinancialScenario | undefined> {
    return this.scenarios.get(id);
  }

  async createScenario(insertScenario: InsertScenario): Promise<FinancialScenario> {
    const id = randomUUID();
    const scenario: FinancialScenario = {
      ...insertScenario,
      id,
      teamSize: insertScenario.teamSize || null,
      monthlyRevenue: insertScenario.monthlyRevenue || null,
      monthlyExpenses: insertScenario.monthlyExpenses || null,
      burnRate: insertScenario.burnRate || null,
      runway: insertScenario.runway || null,
      cashBalance: insertScenario.cashBalance || null,
      scenarioData: insertScenario.scenarioData || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.scenarios.set(id, scenario);
    return scenario;
  }

  async updateScenario(id: string, updateData: Partial<InsertScenario>): Promise<FinancialScenario | undefined> {
    const scenario = this.scenarios.get(id);
    if (!scenario) return undefined;
    
    const updatedScenario = {
      ...scenario,
      ...updateData,
      updatedAt: new Date()
    };
    this.scenarios.set(id, updatedScenario);
    return updatedScenario;
  }

  async deleteScenario(id: string): Promise<boolean> {
    return this.scenarios.delete(id);
  }

  // AI Recommendations operations
  async getRecommendations(userId: string): Promise<AIRecommendation[]> {
    return Array.from(this.recommendations.values()).filter(r => r.userId === userId);
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<AIRecommendation> {
    const id = randomUUID();
    const recommendation: AIRecommendation = {
      ...insertRecommendation,
      id,
      scenarioId: insertRecommendation.scenarioId || null,
      applied: false,
      createdAt: new Date()
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async markRecommendationApplied(id: string): Promise<boolean> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return false;
    
    const updated = { ...recommendation, applied: true };
    this.recommendations.set(id, updated);
    return true;
  }

  // Usage Tracking operations
  async createUsageRecord(insertUsage: InsertUsage): Promise<UsageTracking> {
    const id = randomUUID();
    const usage: UsageTracking = {
      ...insertUsage,
      id,
      metadata: insertUsage.metadata || null,
      createdAt: new Date()
    };
    this.usage.set(id, usage);
    return usage;
  }

  async getUserUsage(userId: string, limit = 50): Promise<UsageTracking[]> {
    return Array.from(this.usage.values())
      .filter(u => u.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  // Financial Twin operations
  async getFinancialTwins(): Promise<FinancialTwin[]> {
    return Array.from(this.twins.values()).filter(t => t.isActive);
  }

  async getFinancialTwinsByIndustry(industry: string): Promise<FinancialTwin[]> {
    return Array.from(this.twins.values()).filter(t => t.industry === industry && t.isActive);
  }

  async createFinancialTwin(insertTwin: InsertTwin): Promise<FinancialTwin> {
    const id = randomUUID();
    const twin: FinancialTwin = {
      ...insertTwin,
      id,
      teamSize: insertTwin.teamSize || null,
      monthlyRevenue: insertTwin.monthlyRevenue || null,
      monthlyExpenses: insertTwin.monthlyExpenses || null,
      burnRate: insertTwin.burnRate || null,
      runway: insertTwin.runway || null,
      description: insertTwin.description || null,
      isActive: true,
      createdAt: new Date()
    };
    this.twins.set(id, twin);
    return twin;
  }

  private seedFinancialTwins() {
    const seedTwins = [
      {
        name: "Company Alpha",
        industry: "SaaS",
        stage: "seed",
        teamSize: 12,
        monthlyRevenue: "85000",
        monthlyExpenses: "65000",
        burnRate: "20000",
        runway: "18.5",
        description: "B2B productivity software startup with strong early traction"
      },
      {
        name: "Company Beta",
        industry: "E-commerce",
        stage: "series_a",
        teamSize: 25,
        monthlyRevenue: "150000",
        monthlyExpenses: "120000",
        burnRate: "30000",
        runway: "22.3",
        description: "Direct-to-consumer retail platform with expanding market reach"
      },
      {
        name: "Company Gamma",
        industry: "FinTech",
        stage: "seed",
        teamSize: 8,
        monthlyRevenue: "45000",
        monthlyExpenses: "55000",
        burnRate: "10000",
        runway: "14.2",
        description: "Financial services API with emerging customer base"
      },
      {
        name: "Company Delta",
        industry: "HealthTech",
        stage: "series_a",
        teamSize: 35,
        monthlyRevenue: "200000",
        monthlyExpenses: "180000",
        burnRate: "20000",
        runway: "28.7",
        description: "Healthcare automation platform with proven ROI"
      }
    ];

    seedTwins.forEach(twin => {
      const id = randomUUID();
      const financialTwin: FinancialTwin = {
        ...twin,
        id,
        teamSize: twin.teamSize || null,
        monthlyRevenue: twin.monthlyRevenue || null,
        monthlyExpenses: twin.monthlyExpenses || null,
        burnRate: twin.burnRate || null,
        runway: twin.runway || null,
        description: twin.description || null,
        isActive: true,
        createdAt: new Date()
      };
      this.twins.set(id, financialTwin);
    });
  }
}

export const storage = new MemStorage();
