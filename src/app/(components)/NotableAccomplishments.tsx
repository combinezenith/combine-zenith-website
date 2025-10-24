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
    <div className="w-full py-16">
      <h2 className="text-4xl font-bold text-white mb-12">Notable Accomplishments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accomplishments.map((item, index) => (
          <div
            key={index}
            className="bg-purple-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/50 hover:border-purple-600/70 transition-all duration-300 hover:scale-105"
          >
            {/* Image Section */}
            <div className="h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Section */}
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}