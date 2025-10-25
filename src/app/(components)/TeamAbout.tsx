interface AboutMeSectionProps {
  name: string;
  bio: string;
  philosophy: string;
}

export default function AboutMeSection({ name, bio, philosophy }: AboutMeSectionProps) {
  return (
    <div className="w-full bg-[#685885] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-300/30">
      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        {/* About Me Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">About Me</h2>
          <p className="text-purple-100/90 text-base sm:text-lg leading-relaxed sm:leading-loose">
            {bio}
          </p>
        </div>

        {/* Professional Philosophy Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            My Professional Philosophy
          </h2>
          <p className="text-purple-100/90 text-base sm:text-lg leading-relaxed sm:leading-loose italic">
            &quot;{philosophy}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}