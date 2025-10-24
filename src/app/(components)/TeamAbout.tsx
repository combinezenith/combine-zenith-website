interface AboutMeSectionProps {
  name: string;
  bio: string;
  philosophy: string;
}

export default function AboutMeSection({ name, bio, philosophy }: AboutMeSectionProps) {
  return (
    <div className="w-full bg-[#685885] rounded-3xl p-12 border border-purple-300/30">
      <div className="space-y-12">
        {/* About Me Section */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">About Me</h2>
          <p className="text-purple-100/90 text-lg leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Professional Philosophy Section */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">My Professional Philosophy</h2>
          <p className="text-purple-100/90 text-lg leading-relaxed italic">
            &quot;{philosophy}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}