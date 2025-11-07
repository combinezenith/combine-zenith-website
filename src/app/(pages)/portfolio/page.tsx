import React from "react";
import PortfolioCard from "@/app/(components)/PortfolioCard";

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col pt-30 justify-center">
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Our Strategic Masterpieces</h1>
        <p className="text-gray-200 max-w-2xl mx-auto">At Combine Zenith, we believe success isn&apos;t a destination it&apos;s a peak we climb together. Every project we create is a step toward that summit where imagination meets innovation and creativity meets measurable impact. 
Here&apos;s a glimpse of the journeys we&apos;ve crafted each a reflection of passion, precision, and our promise to take your brand to <span className="font-bold italic">the peak of success. </span>
</p>
      </div>
      <div className="">
        <PortfolioCard />
      </div>
    </div>
  );
};

export default Portfolio;