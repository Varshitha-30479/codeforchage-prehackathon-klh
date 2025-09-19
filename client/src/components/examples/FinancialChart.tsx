import FinancialChart from '../FinancialChart';

export default function FinancialChartExample() {
  //todo: remove mock functionality - replace with real financial data
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsl(var(--chart-2) / 0.1)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: [35000, 42000, 38000, 45000, 41000, 48000],
        borderColor: 'hsl(var(--chart-3))',
        backgroundColor: 'hsl(var(--chart-3) / 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <FinancialChart 
      title="Revenue vs Expenses Forecast" 
      data={mockData}
      height={350}
    />
  );
}