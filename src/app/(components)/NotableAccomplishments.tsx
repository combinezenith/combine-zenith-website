interface Accomplishment {
  title: string;
  description: string;
  image: string;
}

interface NotableAccomplishmentsProps {
  accomplishments: Accomplishment[];
}

export default function NotableAccomplishments({ accomplishments }: NotableAccomplishmentsProps) {
  return (
    <div className="w-full py-8 sm:py-12 lg:py-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-12 text-center sm:text-left">
        Notable Accomplishments
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {accomplishments.map((item, index) => (
          <div
            key={index}
            className="bg-purple-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-purple-800/50 hover:border-purple-600/70 transition-all duration-300 hover:scale-105"
          >
            {/* Image Section */}
            <div className="h-40 sm:h-44 lg:h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Section */}
            <div className="p-4 sm:p-5 lg:p-6 space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-purple-200/80 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}