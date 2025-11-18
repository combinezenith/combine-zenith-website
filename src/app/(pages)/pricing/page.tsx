import PricingPlan from '@/app/(components)/PricingPlan';
import FeatureComparisonTable from '@/app/(components)/FeatureComparison';
import PricCTA from '@/app/(components)/PricCTA';

export default function Pricing() {
  return (
    <main className="min-h-screen">
      <PricingPlan />
      <div className="hidden md:block">
        <FeatureComparisonTable />
      </div>
      <PricCTA />
    </main>
  );
}