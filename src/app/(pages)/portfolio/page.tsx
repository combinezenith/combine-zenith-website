import React from "react";
import PortfolioCard from "@/app/(components)/PortfolioCard";

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col pt-30 justify-center">
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Our Strategic Masterpieces</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Explore a curated selection of projects that define our expertise and commitment to innovation.</p>
      </div>
      <div className="">
        <PortfolioCard />
      </div>
    </div>
  );
};

export default Portfolio;
