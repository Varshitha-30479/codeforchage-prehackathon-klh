import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Rocket, TrendingDown, TrendingUp, Users, Zap } from "lucide-react";

interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: "growth" | "optimization" | "crisis" | "planning";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  icon: React.ReactNode;
  presets: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    teamSize: number;
    burnRate: number;
  };
}

interface ScenarioTemplatesProps {
  onSelectTemplate: (template: ScenarioTemplate) => void;
}

export default function ScenarioTemplates({ onSelectTemplate }: ScenarioTemplatesProps) {
  //todo: remove mock functionality - replace with real scenario templates from backend
  const templates: ScenarioTemplate[] = [
    {
      id: "product-launch",
      name: "Product Launch",
      description: "Plan your next product launch with marketing spend, team scaling, and revenue projections.",
      category: "growth",
      difficulty: "intermediate",
      estimatedTime: "15 min",
      icon: <Rocket className="w-5 h-5" />,
      presets: {
        monthlyRevenue: 25000,
        monthlyExpenses: 35000,
        teamSize: 8,
        burnRate: 20000,
      },
    },
    {
      id: "cost-reduction",
      name: "Cost Reduction",
      description: "Identify areas to cut expenses while maintaining growth trajectory and team morale.",
      category: "optimization",
      difficulty: "beginner",
      estimatedTime: "10 min",
      icon: <TrendingDown className="w-5 h-5" />,
      presets: {
        monthlyRevenue: 45000,
        monthlyExpenses: 55000,
        teamSize: 12,
        burnRate: 30000,
      },
    },
    {
      id: "fundraising-prep",
      name: "Fundraising Preparation",
      description: "Model different funding scenarios and runway extensions for investor conversations.",
      category: "planning",
      difficulty: "advanced",
      estimatedTime: "25 min",
      icon: <TrendingUp className="w-5 h-5" />,
      presets: {
        monthlyRevenue: 80000,
        monthlyExpenses: 95000,
        teamSize: 18,
        burnRate: 45000,
      },
    },
    {
      id: "team-scaling",
      name: "Team Scaling",
      description: "Plan your hiring strategy with salary projections and productivity improvements.",
      category: "growth",
      difficulty: "intermediate",
      estimatedTime: "20 min",
      icon: <Users className="w-5 h-5" />,
      presets: {
        monthlyRevenue: 60000,
        monthlyExpenses: 50000,
        teamSize: 6,
        burnRate: 15000,
      },
    },
    {
      id: "rapid-growth",
      name: "Rapid Growth Scenario",
      description: "Model aggressive growth with increased spending on sales, marketing, and product development.",
      category: "growth",
      difficulty: "advanced",
      estimatedTime: "30 min",
      icon: <Zap className="w-5 h-5" />,
      presets: {
        monthlyRevenue: 120000,
        monthlyExpenses: 140000,
        teamSize: 25,
        burnRate: 60000,
      },
    },
    {
      id: "cash-crisis",
      name: "Cash Crisis Management",
      description: "Emergency planning for when runway is critically low and immediate action is needed.",
      category: "crisis",
      difficulty: "beginner",
      estimatedTime: "12 min",
      icon: <BookOpen className="w-5 h-5" />,
      presets: {
        monthlyRevenue: 15000,
        monthlyExpenses: 40000,
        teamSize: 8,
        burnRate: 35000,
      },
    },
  ];

  const getCategoryColor = (category: ScenarioTemplate['category']) => {
    switch (category) {
      case "growth":
        return "text-chart-2";
      case "optimization":
        return "text-chart-1";
      case "crisis":
        return "text-destructive";
      case "planning":
        return "text-chart-3";
      default:
        return "text-muted-foreground";
    }
  };

  const getDifficultyVariant = (difficulty: ScenarioTemplate['difficulty']) => {
    switch (difficulty) {
      case "beginner":
        return "secondary" as const;
      case "intermediate":
        return "default" as const;
      case "advanced":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const getCategoryEmoji = (category: ScenarioTemplate['category']) => {
    switch (category) {
      case "growth":
        return "🚀";
      case "optimization":
        return "⚡";
      case "crisis":
        return "🚨";
      case "planning":
        return "📋";
      default:
        return "💼";
    }
  };

  return (
    <Card data-testid="scenario-templates">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-chart-1" />
          Scenario Templates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get started quickly with pre-built financial scenarios
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className="hover-elevate cursor-pointer transition-all"
              onClick={() => onSelectTemplate(template)}
              data-testid={`template-${template.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={getCategoryColor(template.category)}>
                      {template.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {getCategoryEmoji(template.category)} {template.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {template.estimatedTime}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={getDifficultyVariant(template.difficulty)}
                    className="text-xs"
                  >
                    {template.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {template.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-mono">${(template.presets.monthlyRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team:</span>
                    <span className="font-mono">{template.presets.teamSize}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  data-testid={`button-use-template-${template.id}`}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}