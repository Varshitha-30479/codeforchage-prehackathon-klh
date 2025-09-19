import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users2, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessProfile {
  id: string;
  name: string;
  stage: "early" | "growth" | "mature";
  industry: string;
  teamSize: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  burnRate: number;
  runway: number;
  similarity: number;
  metrics: {
    revenuePerEmployee: number;
    costPerEmployee: number;
    profitMargin: number;
    growthRate: number;
  };
}

interface FinancialTwinComparatorProps {
  userMetrics: {
    teamSize: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    burnRate: number;
    runway: number;
  };
  onSelectTwin?: (twin: BusinessProfile) => void;
}

export default function FinancialTwinComparator({ 
  userMetrics, 
  onSelectTwin 
}: FinancialTwinComparatorProps) {
  const [selectedTab, setSelectedTab] = useState("twins");
  
  //todo: remove mock functionality - replace with real anonymized business data from backend
  const financialTwins: BusinessProfile[] = [
    {
      id: "twin-1",
      name: "Company Alpha",
      stage: "growth",
      industry: "SaaS",
      teamSize: 10,
      monthlyRevenue: 55000,
      monthlyExpenses: 42000,
      burnRate: 18000,
      runway: 18,
      similarity: 94,
      metrics: {
        revenuePerEmployee: 5500,
        costPerEmployee: 4200,
        profitMargin: 23.6,
        growthRate: 15,
      },
    },
    {
      id: "twin-2",
      name: "Company Beta",
      stage: "growth",
      industry: "SaaS",
      teamSize: 8,
      monthlyRevenue: 48000,
      monthlyExpenses: 38000,
      burnRate: 16000,
      runway: 20,
      similarity: 89,
      metrics: {
        revenuePerEmployee: 6000,
        costPerEmployee: 4750,
        profitMargin: 20.8,
        growthRate: 12,
      },
    },
    {
      id: "twin-3",
      name: "Company Gamma",
      stage: "early",
      industry: "SaaS",
      teamSize: 6,
      monthlyRevenue: 45000,
      monthlyExpenses: 32000,
      burnRate: 12000,
      runway: 24,
      similarity: 86,
      metrics: {
        revenuePerEmployee: 7500,
        costPerEmployee: 5333,
        profitMargin: 28.9,
        growthRate: 20,
      },
    },
  ];

  // Calculate user metrics
  const userStats = {
    revenuePerEmployee: userMetrics.monthlyRevenue / userMetrics.teamSize,
    costPerEmployee: userMetrics.monthlyExpenses / userMetrics.teamSize,
    profitMargin: ((userMetrics.monthlyRevenue - userMetrics.monthlyExpenses) / userMetrics.monthlyRevenue) * 100,
    growthRate: 10, // Mock value - would come from historical data
  };

  const getComparisonIcon = (userValue: number, twinValue: number, higherIsBetter: boolean = true) => {
    const isUserBetter = higherIsBetter ? userValue > twinValue : userValue < twinValue;
    if (Math.abs(userValue - twinValue) < 0.1) {
      return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
    return isUserBetter ? 
      <ArrowUpRight className="w-3 h-3 text-chart-2" /> : 
      <ArrowDownRight className="w-3 h-3 text-chart-3" />;
  };

  const getComparisonColor = (userValue: number, twinValue: number, higherIsBetter: boolean = true) => {
    const isUserBetter = higherIsBetter ? userValue > twinValue : userValue < twinValue;
    if (Math.abs(userValue - twinValue) < 0.1) return "text-muted-foreground";
    return isUserBetter ? "text-chart-2" : "text-chart-3";
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card data-testid="financial-twin-comparator">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users2 className="w-5 h-5 text-chart-1" />
          Financial Twin Comparator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare your metrics with anonymized profiles of similar businesses
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="twins" data-testid="tab-twins">Similar Companies</TabsTrigger>
            <TabsTrigger value="benchmarks" data-testid="tab-benchmarks">Benchmarks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="twins" className="mt-4">
            <div className="space-y-4">
              {financialTwins.map((twin) => (
                <Card 
                  key={twin.id}
                  className="hover-elevate cursor-pointer transition-all"
                  onClick={() => onSelectTwin?.(twin)}
                  data-testid={`twin-${twin.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-foreground">
                            {twin.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {twin.industry} • {twin.stage} stage • {twin.teamSize} employees
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="font-mono text-xs">
                          {twin.similarity}% match
                        </Badge>
                        <Progress 
                          value={twin.similarity} 
                          className="w-16 h-1 mt-1"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Revenue/Employee:</span>
                          <div className="flex items-center gap-1">
                            {getComparisonIcon(userStats.revenuePerEmployee, twin.metrics.revenuePerEmployee)}
                            <span className={cn("font-mono", getComparisonColor(userStats.revenuePerEmployee, twin.metrics.revenuePerEmployee))}>
                              {formatCurrency(twin.metrics.revenuePerEmployee)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Profit Margin:</span>
                          <div className="flex items-center gap-1">
                            {getComparisonIcon(userStats.profitMargin, twin.metrics.profitMargin)}
                            <span className={cn("font-mono", getComparisonColor(userStats.profitMargin, twin.metrics.profitMargin))}>
                              {formatPercentage(twin.metrics.profitMargin)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Monthly Runway:</span>
                          <div className="flex items-center gap-1">
                            {getComparisonIcon(userMetrics.runway, twin.runway)}
                            <span className={cn("font-mono", getComparisonColor(userMetrics.runway, twin.runway))}>
                              {twin.runway}m
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Growth Rate:</span>
                          <div className="flex items-center gap-1">
                            {getComparisonIcon(userStats.growthRate, twin.metrics.growthRate)}
                            <span className={cn("font-mono", getComparisonColor(userStats.growthRate, twin.metrics.growthRate))}>
                              {formatPercentage(twin.metrics.growthRate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      data-testid={`button-view-twin-${twin.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Detailed Comparison
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="benchmarks" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4 text-chart-1" />
                    Your Performance vs Industry Average
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Revenue per Employee</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{formatCurrency(userStats.revenuePerEmployee)}</span>
                        <span className="text-xs text-muted-foreground">vs {formatCurrency(6000)}</span>
                        {getComparisonIcon(userStats.revenuePerEmployee, 6000)}
                      </div>
                    </div>
                    <Progress 
                      value={(userStats.revenuePerEmployee / 6000) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Profit Margin</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{formatPercentage(userStats.profitMargin)}</span>
                        <span className="text-xs text-muted-foreground">vs {formatPercentage(24.1)}</span>
                        {getComparisonIcon(userStats.profitMargin, 24.1)}
                      </div>
                    </div>
                    <Progress 
                      value={(userStats.profitMargin / 24.1) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Runway (months)</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{userMetrics.runway.toFixed(1)}m</span>
                        <span className="text-xs text-muted-foreground">vs 20.7m</span>
                        {getComparisonIcon(userMetrics.runway, 20.7)}
                      </div>
                    </div>
                    <Progress 
                      value={(userMetrics.runway / 20.7) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-3 h-3 text-chart-2 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">Revenue Efficiency:</span>
                        <p className="text-muted-foreground mt-1">
                          Similar companies generate ${((6000 - userStats.revenuePerEmployee) || 0).toLocaleString()} 
                          more revenue per employee on average.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-3 h-3 text-chart-1 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">Optimization Target:</span>
                        <p className="text-muted-foreground mt-1">
                          Improve profit margin by 3-5% to reach top quartile performance.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingDown className="w-3 h-3 text-chart-3 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">Risk Assessment:</span>
                        <p className="text-muted-foreground mt-1">
                          Current runway is below industry median. Consider cost optimization.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}