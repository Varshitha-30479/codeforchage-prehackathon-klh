import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, CreditCard, Star } from "lucide-react";

interface UsageTrackerProps {
  scenariosUsed: number;
  scenariosLimit: number;
  reportsExported: number;
  reportsLimit: number;
  creditsRemaining: number;
  planType: "free" | "starter" | "pro";
  onUpgrade?: () => void;
  onPurchaseCredits?: () => void;
}

export default function UsageTracker({
  scenariosUsed,
  scenariosLimit,
  reportsExported,
  reportsLimit,
  creditsRemaining,
  planType,
  onUpgrade,
  onPurchaseCredits
}: UsageTrackerProps) {
  const scenarioProgress = (scenariosUsed / scenariosLimit) * 100;
  const reportProgress = (reportsExported / reportsLimit) * 100;
  
  const planNames = {
    free: "Free Plan",
    starter: "Starter Plan", 
    pro: "Pro Plan"
  };

  const planColors = {
    free: "secondary",
    starter: "default",
    pro: "default"
  } as const;

  const isLowOnScenarios = scenarioProgress > 80;
  const isLowOnReports = reportProgress > 80;
  const isLowOnCredits = creditsRemaining < 10;

  return (
    <Card data-testid="usage-tracker" className="hover-elevate">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-chart-1" />
            Usage & Billing
          </CardTitle>
          <Badge 
            variant={planColors[planType]}
            data-testid={`badge-plan-${planType}`}
          >
            {planNames[planType]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenarios Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Scenarios Simulated
            </span>
            <span 
              className="text-sm text-muted-foreground font-mono"
              data-testid="text-scenarios-count"
            >
              {scenariosUsed} / {scenariosLimit}
            </span>
          </div>
          <Progress 
            value={scenarioProgress} 
            className="h-2"
            data-testid="progress-scenarios"
          />
          {isLowOnScenarios && (
            <p className="text-xs text-chart-3">
              ⚠️ Approaching scenario limit
            </p>
          )}
        </div>

        {/* Reports Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Reports Exported
            </span>
            <span 
              className="text-sm text-muted-foreground font-mono"
              data-testid="text-reports-count"
            >
              {reportsExported} / {reportsLimit}
            </span>
          </div>
          <Progress 
            value={reportProgress} 
            className="h-2"
            data-testid="progress-reports"
          />
          {isLowOnReports && (
            <p className="text-xs text-chart-3">
              ⚠️ Approaching export limit
            </p>
          )}
        </div>

        {/* Credits Display */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Credits Remaining</span>
          </div>
          <Badge 
            variant={isLowOnCredits ? "destructive" : "secondary"}
            className="font-mono"
            data-testid="badge-credits"
          >
            {creditsRemaining}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {planType === "free" && (
            <Button 
              onClick={onUpgrade}
              className="w-full"
              data-testid="button-upgrade"
            >
              <Star className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
          
          {(isLowOnCredits || isLowOnScenarios || isLowOnReports) && (
            <Button 
              variant="outline"
              onClick={onPurchaseCredits}
              className="w-full"
              data-testid="button-purchase-credits"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Purchase Credits
            </Button>
          )}
        </div>

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> Save scenarios as templates to reuse later</p>
          <p>📊 Each scenario simulation costs 1 credit</p>
          <p>📋 Report exports cost 2 credits each</p>
        </div>
      </CardContent>
    </Card>
  );
}