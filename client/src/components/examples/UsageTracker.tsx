import UsageTracker from '../UsageTracker';
import { useState } from 'react';

export default function UsageTrackerExample() {
  //todo: remove mock functionality - replace with real usage tracking
  const [scenariosUsed] = useState(7);
  const [reportsExported] = useState(3);

  const handleUpgrade = () => {
    console.log('Upgrade plan triggered');
  };

  const handlePurchaseCredits = () => {
    console.log('Purchase credits triggered');
  };

  return (
    <UsageTracker
      scenariosUsed={scenariosUsed}
      scenariosLimit={10}
      reportsExported={reportsExported}
      reportsLimit={5}
      creditsRemaining={25}
      planType="free"
      onUpgrade={handleUpgrade}
      onPurchaseCredits={handlePurchaseCredits}
    />
  );
}