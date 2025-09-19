import ScenarioSlider from '../ScenarioSlider';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function ScenarioSliderExample() {
  //todo: remove mock functionality - replace with real scenario state management
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(35000);
  const [teamSize, setTeamSize] = useState(8);
  const [burnRate, setBurnRate] = useState(15000);

  console.log('Scenario values updated:', { monthlyRevenue, monthlyExpenses, teamSize, burnRate });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}