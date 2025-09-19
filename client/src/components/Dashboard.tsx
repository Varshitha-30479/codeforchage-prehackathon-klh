import { useState } from "react";
import MetricsCard from "./MetricsCard";
import ScenarioSlider from "./ScenarioSlider";
import FinancialChart from "./FinancialChart";
import AIRecommendations from "./AIRecommendations";
import UsageTracker from "./UsageTracker";
import ScenarioTemplates from "./ScenarioTemplates";
import FinancialTwinComparator from "./FinancialTwinComparator";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Download,
  Sparkles,
  BarChart3,
  Settings
} from "lucide-react";

export default function Dashboard() {
  //todo: remove mock functionality - replace with real state management
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(35000);
  const [teamSize, setTeamSize] = useState(8);
  const [burnRate, setBurnRate] = useState(15000);
  const [cashBalance, setCashBalance] = useState(485000);
  
  // Calculated metrics
  const monthlyProfit = monthlyRevenue - monthlyExpenses;
  const runway = cashBalance / burnRate;
  const costPerEmployee = monthlyExpenses / teamSize;

  //todo: remove mock functionality - replace with real chart data calculation
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((_, i) => monthlyRevenue + (i * monthlyRevenue * 0.1));
    const expenseData = months.map((_, i) => monthlyExpenses + (i * monthlyExpenses * 0.05));
    const cashData = months.map((_, i) => Math.max(0, cashBalance - (i * burnRate)));

    return {
      forecastData: {
        labels: months,
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            borderColor: 'hsl(var(--chart-2))',
            backgroundColor: 'hsl(var(--chart-2) / 0.1)',
            fill: true,
          },
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: 'hsl(var(--chart-3))',
            backgroundColor: 'hsl(var(--chart-3) / 0.1)',
            fill: true,
          },
        ],
      },
      cashData: {
        labels: months,
        datasets: [
          {
            label: 'Cash Balance',
            data: cashData,
            borderColor: 'hsl(var(--chart-1))',
            backgroundColor: 'hsl(var(--chart-1) / 0.1)',
            fill: true,
          },
        ],
      },
    };
  };

  const { forecastData, cashData } = generateChartData();

  const handleExportReport = () => {
    console.log('Export PDF report triggered');
    // TODO: Implement PDF generation
  };

  const handleGenerateAI = () => {
    console.log('Generate AI recommendations triggered');
    // TODO: Call OpenAI API
  };

  const handleSelectTemplate = (template: any) => {
    console.log('Applying template:', template.name);
    setMonthlyRevenue(template.presets.monthlyRevenue);
    setMonthlyExpenses(template.presets.monthlyExpenses);
    setTeamSize(template.presets.teamSize);
    setBurnRate(template.presets.burnRate);
  };

  //todo: remove mock functionality - replace with real AI recommendations
  const mockRecommendations = [
    {
      id: "rec-1",
      type: "warning" as const,
      title: "Optimize Burn Rate",
      description: `Current burn rate of $${burnRate.toLocaleString()}/month could be reduced by 12% through expense optimization.`,
      impact: "high" as const,
      category: "cost" as const,
    },
    {
      id: "rec-2",
      type: "opportunity" as const,
      title: "Revenue Growth Potential",
      description: `Based on current trajectory, consider increasing revenue targets by 15% through pricing optimization.`,
      impact: "medium" as const,
      category: "revenue" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">CFO Helper</h1>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Scenario Analysis
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportReport}
              data-testid="button-export-report"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button 
              size="sm"
              onClick={handleGenerateAI}
              data-testid="button-generate-ai"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-card p-6 min-h-screen">
          <div className="space-y-6">
            <UsageTracker
              scenariosUsed={7}
              scenariosLimit={10}
              reportsExported={3}
              reportsLimit={5}
              creditsRemaining={25}
              planType="free"
              onUpgrade={() => console.log('Upgrade triggered')}
              onPurchaseCredits={() => console.log('Purchase credits triggered')}
            />
            
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Scenario Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScenarioSlider
                  label="Monthly Revenue"
                  value={monthlyRevenue}
                  min={0}
                  max={200000}
                  step={1000}
                  unit="$"
                  icon={<DollarSign className="w-4 h-4" />}
                  color="success"
                  description="Expected recurring monthly revenue"
                  onChange={setMonthlyRevenue}
                />
                <ScenarioSlider
                  label="Monthly Expenses"
                  value={monthlyExpenses}
                  min={0}
                  max={150000}
                  step={1000}
                  unit="$"
                  icon={<TrendingUp className="w-4 h-4" />}
                  color="warning"
                  description="Fixed and variable monthly expenses"
                  onChange={setMonthlyExpenses}
                />
                <ScenarioSlider
                  label="Team Size"
                  value={teamSize}
                  min={1}
                  max={50}
                  step={1}
                  unit=""
                  icon={<Users className="w-4 h-4" />}
                  color="primary"
                  description="Number of full-time employees"
                  onChange={setTeamSize}
                />
                <ScenarioSlider
                  label="Monthly Burn Rate"
                  value={burnRate}
                  min={5000}
                  max={100000}
                  step={1000}
                  unit="$"
                  icon={<Calendar className="w-4 h-4" />}
                  color="destructive"
                  description="Monthly cash consumption rate"
                  onChange={setBurnRate}
                />
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricsCard
                title="Monthly Runway"
                value={Math.round(runway)}
                unit=""
                change={{
                  value: runway > 12 ? 8 : -12,
                  label: "vs last scenario",
                  type: runway > 12 ? "increase" : "decrease"
                }}
                icon={<Calendar className="w-4 h-4" />}
                variant={runway > 12 ? "success" : runway > 6 ? "warning" : "destructive"}
                description="months remaining"
              />
              <MetricsCard
                title="Monthly Profit"
                value={monthlyProfit}
                unit="$"
                change={{
                  value: monthlyProfit > 0 ? 15 : -25,
                  label: "vs expenses",
                  type: monthlyProfit > 0 ? "increase" : "decrease"
                }}
                icon={<DollarSign className="w-4 h-4" />}
                variant={monthlyProfit > 0 ? "success" : "destructive"}
                description="net income"
              />
              <MetricsCard
                title="Cost Per Employee"
                value={Math.round(costPerEmployee)}
                unit="$"
                change={{
                  value: 5,
                  label: "industry avg",
                  type: "neutral"
                }}
                icon={<Users className="w-4 h-4" />}
                variant="default"
                description="monthly cost"
              />
              <MetricsCard
                title="Cash Balance"
                value={cashBalance}
                unit="$"
                change={{
                  value: -8,
                  label: "this month",
                  type: "decrease"
                }}
                icon={<TrendingUp className="w-4 h-4" />}
                variant="warning"
                description="available funds"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart 
                title="Revenue vs Expenses Forecast" 
                data={forecastData}
                height={300}
              />
              <FinancialChart 
                title="Cash Runway Projection" 
                data={cashData}
                height={300}
              />
            </div>

            {/* AI Recommendations & Templates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIRecommendations
                recommendations={mockRecommendations}
                loading={false}
                onGenerateRecommendations={handleGenerateAI}
                onApplyRecommendation={(id) => console.log('Apply recommendation:', id)}
              />
              <ScenarioTemplates onSelectTemplate={handleSelectTemplate} />
            </div>

            {/* Financial Twin Comparator */}
            <FinancialTwinComparator
              userMetrics={{
                teamSize,
                monthlyRevenue,
                monthlyExpenses,
                burnRate,
                runway
              }}
              onSelectTwin={(twin) => {
                console.log('Selected financial twin for analysis:', twin.name);
                // Apply twin's metrics for comparison
                setMonthlyRevenue(twin.monthlyRevenue);
                setMonthlyExpenses(twin.monthlyExpenses);
                setBurnRate(twin.burnRate);
                setTeamSize(twin.teamSize);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}