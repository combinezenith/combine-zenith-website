import { Mail, Linkedin, Twitter } from 'lucide-react';

interface TeamInfoProps {
  email: string;
  linkedin?: string;
  twitter?: string;
}

export default function TeamInfo({ email, linkedin, twitter }: TeamInfoProps) {
  return (
    <div className="w-full bg-purple-400/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-300/30">
      <h2 className="text-4xl font-bold text-white mb-8">Get in Touch</h2>
      
      <div className="space-y-5">
        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-4 text-white hover:text-purple-200 transition-colors duration-300 group"
        >
          <Mail className="w-5 h-5 flex-shrink-0" />
          <span className="text-lg group-hover:underline">{email}</span>
        </a>

        {/* LinkedIn */}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 text-white hover:text-purple-200 transition-colors duration-300 group"
          >
            <Linkedin className="w-5 h-5 flex-shrink-0" />
            <span className="text-lg group-hover:underline">LinkedIn Profile</span>
          </a>
        )}

        {/* Twitter */}
        {twitter && (
          <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 text-white hover:text-purple-200 transition-colors duration-300 group"
          >
            <Twitter className="w-5 h-5 flex-shrink-0" />
            <span className="text-lg group-hover:underline">Twitter Profile</span>
          </a>
        )}
      </div>
    </div>
  );
}