import React from 'react';

export default function SubscriptionIncludes() {
  const features = [
    {
      title: 'Digital Strategy',
      description: 'Tailored plans for online presence and growth.'
    },
    {
      title: 'Content Hub',
      description: 'High-quality articles, blogs, and visual content.'
    },
    {
      title: 'Social Boost',
      description: 'Boost your presence across all social platforms.'
    },
    {
      title: 'Ad Campaigns',
      description: 'High-converting ads on Google, Meta, and more.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-8">
          A Starter subscription includes
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center"
            >
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}