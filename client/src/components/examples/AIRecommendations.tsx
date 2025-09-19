import AIRecommendations from '../AIRecommendations';
import { useState } from 'react';

export default function AIRecommendationsExample() {
  //todo: remove mock functionality - replace with real AI-generated recommendations
  const [recommendations] = useState([
    {
      id: "rec-1",
      type: "warning" as const,
      title: "High Burn Rate Detected",
      description: "Your current burn rate of $27K/month is 15% higher than industry average for your stage. Consider reducing non-essential expenses to extend runway.",
      impact: "high" as const,
      category: "cost" as const,
    },
    {
      id: "rec-2", 
      type: "opportunity" as const,
      title: "Revenue Growth Potential",
      description: "Based on your current metrics, increasing pricing by 8% could boost monthly revenue by $4,000 with minimal churn risk.",
      impact: "medium" as const,
      category: "revenue" as const,
    },
    {
      id: "rec-3",
      type: "action" as const,
      title: "Optimize Team Structure",
      description: "Consider hiring 1 senior developer instead of 2 junior developers to improve efficiency and reduce onboarding costs.",
      impact: "medium" as const,
      category: "hiring" as const,
    },
  ]);

  const handleGenerateRecommendations = () => {
    console.log('Generating AI recommendations...');
  };

  const handleApplyRecommendation = (id: string) => {
    console.log(`Applying recommendation: ${id}`);
  };

  return (
    <AIRecommendations
      recommendations={recommendations}
      loading={false}
      onGenerateRecommendations={handleGenerateRecommendations}
      onApplyRecommendation={handleApplyRecommendation}
    />
  );
}