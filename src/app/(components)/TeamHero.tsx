export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Meet the Visionaries Behind Combine Zenith
        </h1>
        
        {/* Subheading */}
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Our diverse team of experts is dedicated to crafting innovative marketing strategies that drive unparalleled success for your brand.
        </p>
        
        {/* CTA Button */}
        <button className="bg-purple-800/60 hover:bg-purple-700/70 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-purple-700/50 shadow-lg hover:shadow-purple-500/30">
          Discover Our Services
        </button>
      </div>
    </div>
  );
}