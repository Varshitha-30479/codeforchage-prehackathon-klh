import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    label: string;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  description?: string;
  loading?: boolean;
}

export default function MetricsCard({
  title,
  value,
  unit = "",
  change,
  icon,
  variant = "default",
  description,
  loading = false
}: MetricsCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      if (unit === "$" && val >= 1000000) {
        return `${unit}${(val / 1000000).toFixed(1)}M`;
      } else if (unit === "$" && val >= 1000) {
        return `${unit}${(val / 1000).toFixed(0)}K`;
      }
      return `${unit}${val.toLocaleString()}`;
    }
    return `${unit}${val}`;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-chart-2/20 bg-chart-2/5";
      case "warning":
        return "border-chart-3/20 bg-chart-3/5";
      case "destructive":
        return "border-destructive/20 bg-destructive/5";
      default:
        return "";
    }
  };

  const getChangeClasses = () => {
    if (!change) return "";
    switch (change.type) {
      case "increase":
        return "text-chart-2 bg-chart-2/10";
      case "decrease":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted/50";
    }
  };

  const getChangeSymbol = () => {
    if (!change) return "";
    switch (change.type) {
      case "increase":
        return "↗";
      case "decrease":
        return "↘";
      default:
        return "→";
    }
  };

  if (loading) {
    return (
      <Card data-testid={`metrics-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            {icon && (
              <div className="w-4 h-4 bg-muted animate-pulse rounded" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn("hover-elevate", getVariantClasses())}
      data-testid={`metrics-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground opacity-60">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div 
            className="text-2xl font-bold text-foreground"
            data-testid={`value-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {formatValue(value)}
          </div>
          <div className="flex items-center gap-2">
            {change && (
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium", getChangeClasses())}
                data-testid={`change-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="mr-1">{getChangeSymbol()}</span>
                {change.value > 0 ? "+" : ""}{change.value}% {change.label}
              </Badge>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}