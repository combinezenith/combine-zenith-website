import React from "react";
import PricingDetail from "@/app/(components)/PricingDetail";
import SubscriptionIncludes from "@/app/(components)/SubscriptionIncludes";
import PlanCalculator from "@/app/(components)/PlanCalculator";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricingDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  console.log('Page id:', id);
  
  return (
    <div className="min-h-screen">
      <PricingDetail id={id} />
      <SubscriptionIncludes />
      <div className="hidden md:block">
        <PlanCalculator />
      </div>
    </div>
  );
}