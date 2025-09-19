import FinancialTwinComparator from '../FinancialTwinComparator';

export default function FinancialTwinComparatorExample() {
  //todo: remove mock functionality - replace with real user metrics from state
  const mockUserMetrics = {
    teamSize: 8,
    monthlyRevenue: 50000,
    monthlyExpenses: 35000,
    burnRate: 15000,
    runway: 32.3, // cashBalance / burnRate
  };

  const handleSelectTwin = (twin: any) => {
    console.log('Selected financial twin for detailed comparison:', twin.name, twin);
  };

  return (
    <FinancialTwinComparator 
      userMetrics={mockUserMetrics}
      onSelectTwin={handleSelectTwin}
    />
  );
}