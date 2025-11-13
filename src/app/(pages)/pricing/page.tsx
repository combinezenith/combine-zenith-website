import PricingPlan from '@/app/(components)/PricingPlan';
import FeatureComparisonTable from '@/app/(components)/FeatureComparison';
import PricCTA from '@/app/(components)/PricCTA';


export default function Pricing() {
  return (
    <main className="min-h-screen">
      <PricingPlan />
      <FeatureComparisonTable />
      <PricCTA />      
    </main>
  );
}
