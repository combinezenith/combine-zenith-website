interface SkillsExpertiseSectionProps {
  skills: string[];
}

export default function SkillsExpertiseSection({ skills }: SkillsExpertiseSectionProps) {
  return (
    <div className="w-full bg-purple-400/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-300/30">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center sm:text-left">
        Skills & Expertise
      </h2>
      
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-purple-300/40 hover:bg-purple-300/50 text-white font-medium px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-full transition-all duration-300 hover:scale-105 border border-purple-200/30 text-xs sm:text-sm lg:text-base whitespace-nowrap"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}