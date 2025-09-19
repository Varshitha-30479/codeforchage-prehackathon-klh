import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ScenarioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
  description?: string;
  onChange: (value: number) => void;
}

export default function ScenarioSlider({
  label,
  value,
  min,
  max,
  step,
  unit = "$",
  icon,
  color = "primary",
  description,
  onChange
}: ScenarioSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = (newValue: number[]) => {
    const val = newValue[0];
    onChange(val);
    setInputValue(val.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    } else {
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  const formatValue = (val: number): string => {
    if (unit === "$" && val >= 1000) {
      return `${unit}${(val / 1000).toFixed(0)}K`;
    }
    return `${unit}${val.toLocaleString()}`;
  };

  const colorClasses = {
    primary: "text-chart-1",
    secondary: "text-muted-foreground", 
    success: "text-chart-2",
    warning: "text-chart-3",
    destructive: "text-destructive"
  };

  return (
    <Card data-testid={`slider-${label.toLowerCase().replace(/\s+/g, '-')}`} className="hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`${colorClasses[color]} opacity-80`}>
                {icon}
              </div>
            )}
            <CardTitle className="text-sm font-medium text-foreground">
              {label}
            </CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`font-mono text-xs ${colorClasses[color]}`}
            data-testid={`badge-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {formatValue(value)}
          </Badge>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            max={max}
            min={min}
            step={step}
            className="w-full"
            data-testid={`input-slider-${label.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <div className="flex items-center gap-2">
            <Label htmlFor={`input-${label}`} className="text-xs text-muted-foreground shrink-0">
              Exact value:
            </Label>
            {isEditing ? (
              <Input
                id={`input-${label}`}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="h-7 text-xs font-mono"
                autoFocus
                data-testid={`input-exact-${label.toLowerCase().replace(/\s+/g, '-')}`}
              />
            ) : (
              <div
                onClick={() => {
                  setIsEditing(true);
                  setInputValue(value.toString());
                }}
                className="flex-1 h-7 px-2 py-1 text-xs font-mono bg-muted rounded cursor-pointer hover-elevate flex items-center"
                data-testid={`display-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {unit}{value.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}