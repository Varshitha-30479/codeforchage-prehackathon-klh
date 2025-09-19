import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FinancialChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
    }[];
  };
  height?: number;
}

export default function FinancialChart({ title, data, height = 300 }: FinancialChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "Inter",
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--popover-border))",
        borderWidth: 1,
        cornerRadius: 8,
        font: {
          family: "Inter",
        },
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: "hsl(var(--border))",
          lineWidth: 1,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            family: "Inter",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "hsl(var(--border))",
          lineWidth: 1,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            family: "Inter",
            size: 11,
          },
          callback: function(value: any) {
            return `$${value.toLocaleString()}`;
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.1,
      },
    },
  };

  return (
    <Card data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}