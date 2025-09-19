import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  type: "insight" | "warning" | "opportunity" | "action";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "cost" | "revenue" | "runway" | "hiring" | "strategy";
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  loading?: boolean;
  onGenerateRecommendations?: () => void;
  onApplyRecommendation?: (id: string) => void;
}

export default function AIRecommendations({
  recommendations,
  loading = false,
  onGenerateRecommendations,
  onApplyRecommendation
}: AIRecommendationsProps) {
  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case "insight":
        return <Lightbulb className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "opportunity":
        return <TrendingUp className="w-4 h-4" />;
      case "action":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case "insight":
        return "text-chart-1";
      case "warning":
        return "text-chart-3";
      case "opportunity":
        return "text-chart-2";
      case "action":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const getImpactColor = (impact: Recommendation['impact']) => {
    switch (impact) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCategoryEmoji = (category: Recommendation['category']) => {
    switch (category) {
      case "cost":
        return "💰";
      case "revenue":
        return "📈";
      case "runway":
        return "⏰";
      case "hiring":
        return "👥";
      case "strategy":
        return "🎯";
      default:
        return "💡";
    }
  };

  if (loading) {
    return (
      <Card data-testid="ai-recommendations">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-chart-1 animate-pulse" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="ai-recommendations">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-chart-1" />
            AI Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGenerateRecommendations}
            disabled={loading}
            data-testid="button-generate-recommendations"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No recommendations yet.</p>
            <p className="text-xs">Try adjusting your scenario parameters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className="p-4 border rounded-lg hover-elevate space-y-3"
                data-testid={`recommendation-${rec.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("opacity-80", getTypeColor(rec.type))}>
                      {getTypeIcon(rec.type)}
                    </div>
                    <h4 className="font-medium text-foreground text-sm">
                      {getCategoryEmoji(rec.category)} {rec.title}
                    </h4>
                  </div>
                  <Badge 
                    variant={getImpactColor(rec.impact)}
                    className="text-xs"
                    data-testid={`badge-impact-${rec.impact}`}
                  >
                    {rec.impact} impact
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>
                
                {rec.type === "action" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onApplyRecommendation?.(rec.id)}
                    data-testid={`button-apply-${rec.id}`}
                  >
                    Apply Suggestion
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}