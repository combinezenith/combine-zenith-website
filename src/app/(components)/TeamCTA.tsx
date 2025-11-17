import Link from "next/link";

export default function TeamCTA() {
  return (
    <div className="py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Elevate Your Brand?
        </h2>
        
        {/* Description */}
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Partner with Combine Zenith and transform your marketing vision into reality.
        </p>
        
        {/* CTA Button */}
        <button className="bg-purple-400/80 hover:bg-purple-400/90 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-400/50">
          <Link href="/contact" className="block">
          Contact Our Experts
          </Link>
        </button>
      </div>
    </div>
  );
}