interface SkillsExpertiseSectionProps {
  skills: string[];
}

export default function SkillsExpertiseSection({ skills }: SkillsExpertiseSectionProps) {
  return (
    <div className="w-full bg-purple-400/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-300/30">
      <h2 className="text-4xl font-bold text-white mb-8">Skills & Expertise</h2>
      
      <div className="flex flex-wrap gap-4">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-purple-300/40 hover:bg-purple-300/50 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 border border-purple-200/30"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

// Example usage:
// <SkillsExpertiseSection 
//   skills={[
//     "Digital Marketing",
//     "Brand Strategy",
//     "Market Analysis",
//     "SEO/SEM",
//     "Content Marketing",
//     "Social Media Management",
//     "Team Leadership",
//     "Public Relations",
//     "Campaign Management",
//     "Data Analytics"
//   ]}
// />