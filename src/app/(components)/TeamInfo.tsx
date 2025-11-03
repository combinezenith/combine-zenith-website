import { Linkedin } from 'lucide-react';

interface TeamInfoProps {
  linkedin?: string;
}

export default function TeamInfo({ linkedin }: TeamInfoProps) {
  return (
    <div className="w-full bg-purple-400/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-300/30">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center sm:text-left">
        Get in Touch
      </h2>
      
      <div className="space-y-4 sm:space-y-5">
        {/* LinkedIn */}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 sm:gap-4 text-white hover:text-purple-200 transition-colors duration-300 group p-2 sm:p-0 rounded-lg sm:rounded-none hover:bg-purple-300/10 sm:hover:bg-transparent"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-base sm:text-lg group-hover:underline">
              LinkedIn Profile
            </span>
          </a>
        )}

        
      </div>
    </div>
  );
}