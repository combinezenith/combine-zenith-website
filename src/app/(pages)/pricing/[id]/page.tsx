import React from "react";
import PricingDetail from "@/app/(components)/PricingDetail";
import SubscriptionIncludes from "@/app/(components)/SubscriptionIncludes";
import PlanCalculator from "@/app/(components)/PlanCalculator";

export default async function PricingDetailPage() {
  return (
    <div className="min-h-screen">
        <PricingDetail />
        <SubscriptionIncludes />
      <div className="hidden md:block">
        <PlanCalculator />
      </div>
    </div>
  );
}