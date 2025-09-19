import MetricsCard from '../MetricsCard';
import { DollarSign, Calendar, TrendingUp, Users } from 'lucide-react';

export default function MetricsCardExample() {
  //todo: remove mock functionality - replace with real financial metrics
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Monthly Runway"
        value={18}
        unit=""
        change={{
          value: 12,
          label: "vs last month",
          type: "increase"
        }}
        icon={<Calendar className="w-4 h-4" />}
        variant="success"
        description="months remaining"
      />
      <MetricsCard
        title="Cash Balance"
        value={485000}
        unit="$"
        change={{
          value: -8,
          label: "this month",
          type: "decrease"
        }}
        icon={<DollarSign className="w-4 h-4" />}
        variant="warning"
      />
      <MetricsCard
        title="Burn Rate"
        value={27000}
        unit="$"
        change={{
          value: 5,
          label: "vs target",
          type: "increase"
        }}
        icon={<TrendingUp className="w-4 h-4" />}
        variant="destructive"
        description="per month"
      />
      <MetricsCard
        title="Team Growth"
        value={12}
        unit=""
        change={{
          value: 20,
          label: "this quarter",
          type: "increase"
        }}
        icon={<Users className="w-4 h-4" />}
        variant="default"
        description="employees"
      />
    </div>
  );
}