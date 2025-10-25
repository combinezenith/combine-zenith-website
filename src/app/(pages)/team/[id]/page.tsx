import React from 'react';
import Link from 'next/link';
import ProfileHeroSection from '@/app/(components)/ProfileHero';
import AboutMeSection from '@/app/(components)/TeamAbout';
import SkillsExpertiseSection from '@/app/(components)/TeamSkills';
import TeamInfo from '@/app/(components)/TeamInfo';
import NotableAccomplishments from '@/app/(components)/NotableAccomplishments';
import Jibran from "../../../../../public/Jibran.png"
import Waqas from "../../../../../public/Waqas.jpg"
import Hamza from "../../../../../public/Hamza.jpeg"
import Umer from "../../../../../public/Umer.jpeg"
import Esha from "../../../../../public/Esha.png"
import { StaticImageData } from 'next/image'; 

// Define the accomplishment type
type Accomplishment = {
  title: string;
  description: string;
  image: string;
};

// Define the member type - allow both string and StaticImageData
type TeamMember = {
  name: string;
  role: string;
  tagline: string;
  image: string | StaticImageData;
  bio: string;
  philosophy: string;
  skills: string[];
  email: string;
  linkedin?: string;
  twitter?: string;
  accomplishments: Accomplishment[];
};

// Define the team members type with specific keys
type TeamMembersData = {
  [key: string]: TeamMember;
};

// Define the params type for the page
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;

  // All 6 team members database with proper typing
  const teamMembers: TeamMembersData = {
    'Muhammad-Jibran-Rehan': {
      name: "Muhammad Jibran Rehan",
      role: "Chief Executive Officer",
      tagline: "Driving brand success through innovative and data-led strategies.",
      image: Jibran,
      bio: "Muhammad Jibran Rehan is a visionary Chief Executive Officer with over 15 years of experience in leading high-impact campaigns for global brands. Her expertise spans digital marketing, brand development, market research, and strategic communications. Eleanor is known for her ability to transform complex market data into actionable strategies that yield measurable results and foster sustainable growth. She thrives on building high-performing teams and fostering a culture of innovation. Prior to joining Combine Zenith, Eleanor held senior marketing roles at leading tech and consumer goods companies, where she successfully launched several flagship products and significantly expanded market share. Her strategic foresight and commitment to excellence have consistently placed her at the forefront of industry trends.",
      philosophy: "My philosophy centers on the belief that truly effective marketing is a blend of artistry and science. It requires deep empathy for the customer, rigorous data analysis, and a relentless pursuit of creative solutions. I am passionate about crafting narratives that resonate authentically and building brands that not only succeed but also inspire.",
      skills: ["Strategic Leadership", "Brand Development", "Market Research", "Digital Marketing", "Team Building", "Innovation Management", "Data Analytics", "Business Strategy"],
      email: "eleanor.pena@combinezenith.com",
      linkedin: "https://linkedin.com/in/Muhammad-Jibran-Rehan",
      twitter: "https://twitter.com/eleanor_pena",
      accomplishments: [
        {
          title: "Global Brand Relaunch",
          description: "Led a successful global brand relaunch project for a Fortune 500 tech company, resulting in a 25% increase in brand perception scores.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop"
        },
        {
          title: "AI-Powered Campaign",
          description: "Pioneered the integration of AI-driven analytics to optimize campaign performance, achieving a 40% improvement in conversion rates.",
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
        },
        {
          title: "Strategic Partnership Initiative",
          description: "Orchestrated key strategic partnerships that expanded market penetration by 15% in new emerging markets.",
          image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop"
        }
      ]
    },
    'Waqas-Ahmed': {
      name: "Waqas Ahmed",
      role: "Head of Marketing",
      tagline: "Transforming marketing campaigns into measurable business results.",
      image: Waqas,
      bio: "Waqas Ahmed is an accomplished Head of Marketing with over 12 years of experience driving revenue growth through innovative digital strategies. His expertise includes campaign management, performance marketing, and brand positioning. Ralph has a proven track record of scaling marketing operations for startups and Fortune 500 companies alike. He specializes in data-driven decision making and has successfully managed multi-million dollar budgets while consistently exceeding ROI targets. His leadership style emphasizes collaboration, continuous learning, and pushing creative boundaries to achieve exceptional results.",
      philosophy: "I believe that great marketing is about creating genuine connections between brands and people. Every campaign should tell a compelling story while being grounded in data and measurable outcomes. My approach combines creativity with analytical rigor to drive sustainable growth and build lasting customer relationships.",
      skills: ["Digital Marketing", "Campaign Management", "Performance Marketing", "Brand Positioning", "SEO/SEM", "Marketing Analytics", "Budget Management", "Team Leadership"],
      email: "ralph.edwards@combinezenith.com",
      linkedin: "https://linkedin.com/in/Waqas-Ahmed",
      twitter: "https://twitter.com/Waqas_Ahmed",
      accomplishments: [
        {
          title: "Revenue Growth Achievement",
          description: "Drove 300% revenue growth over 2 years through innovative digital marketing strategies and performance optimization.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
        },
        {
          title: "Multi-Channel Campaign Success",
          description: "Launched integrated marketing campaign across 12 channels, generating $10M in revenue with 5:1 ROI.",
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop"
        },
        {
          title: "Marketing Automation Implementation",
          description: "Implemented marketing automation system that increased lead conversion by 45% and reduced customer acquisition cost by 30%.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
        }
      ]
    },
    'Hamza-Ali': {
      name: "Hamza Ali",
      role: "Strategy Lead",
      tagline: "Crafting strategic roadmaps that turn visions into victories.",
      image: Hamza,
      bio: "Hamza Ali is a strategic mastermind with 10+ years of experience in developing comprehensive marketing strategies for leading brands. Her expertise lies in competitive analysis, market positioning, and long-term growth planning. Esther has guided numerous companies through successful brand transformations and market expansions. She excels at identifying untapped opportunities and translating insights into actionable strategies. Her work has helped clients achieve significant market share gains and establish strong competitive advantages in crowded marketplaces.",
      philosophy: "Strategy is the bridge between aspiration and achievement. I believe in creating roadmaps that are both visionary and practical, balancing bold thinking with realistic execution. Success comes from deep market understanding, clear objectives, and the courage to challenge conventional wisdom when necessary.",
      skills: ["Strategic Planning", "Market Analysis", "Competitive Intelligence", "Brand Strategy", "Growth Planning", "Market Positioning", "Business Consulting", "Data-Driven Insights"],
      email: "esther.howard@combinezenith.com",
      linkedin: "https://linkedin.com/in/Hamza-Ali",
      twitter: "https://twitter.com/Hamza_Ali",
      accomplishments: [
        {
          title: "Market Expansion Strategy",
          description: "Developed go-to-market strategy that enabled successful entry into 5 new international markets within 18 months.",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop"
        },
        {
          title: "Competitive Positioning Win",
          description: "Repositioned brand to capture 20% market share from competitors through strategic differentiation and messaging.",
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop"
        },
        {
          title: "Strategic Business Transformation",
          description: "Led comprehensive business transformation strategy that increased company valuation by $50M over 3 years.",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
        }
      ]
    },
    'Muhammad-Umer': {
      name: "Muhammad Umer",
      role: "Creative Director",
      tagline: "Bringing bold creative visions to life with innovative design solutions.",
      image: Umer,
      bio: "Muhammad Umer is an award-winning Creative Director with 8+ years of experience creating memorable brand experiences. Her portfolio spans digital campaigns, brand identities, and multimedia content that resonates across diverse audiences. Brooklyn's work has been recognized with multiple industry awards and has helped brands achieve viral success. She leads creative teams with a focus on innovation, inclusivity, and pushing design boundaries. Her approach combines artistic vision with strategic thinking to deliver work that is both beautiful and effective.",
      philosophy: "Creativity is not just about making things look good—it's about solving problems in unexpected ways. I believe every design decision should serve a purpose and contribute to the overall brand story. The best creative work challenges perceptions, sparks conversations, and leaves a lasting impression.",
      skills: ["Creative Direction", "Brand Identity", "Visual Design", "Art Direction", "Multimedia Content", "Team Leadership", "Design Strategy", "Creative Innovation"],
      email: "brooklyn.simmons@combinezenith.com",
      linkedin: "https://linkedin.com/in/Muhammad-Umer",
      twitter: "https://twitter.com/Muhammad_Umer",
      accomplishments: [
        {
          title: "Award-Winning Brand Identity",
          description: "Created brand identity that won 3 international design awards and increased brand recognition by 60%.",
          image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
        },
        {
          title: "Viral Social Campaign",
          description: "Directed creative campaign that achieved 50M+ impressions organically and became a trending topic worldwide.",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop"
        },
        {
          title: "Inclusive Design Initiative",
          description: "Pioneered inclusive design framework adopted by Fortune 500 companies, improving accessibility and user engagement.",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
        }
      ]
    },
    'cameron-williamson': {
      name: "Cameron Williamson",
      role: "Creative Director",
      tagline: "Leading creative excellence through collaboration and innovation.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=600&fit=crop",
      bio: "Cameron Williamson is a versatile Creative Director with 9+ years of experience leading award-winning creative teams. His expertise spans advertising, content creation, and brand storytelling across digital and traditional channels. Cameron has worked with Fortune 500 companies and innovative startups, bringing a fresh perspective to every project. He's known for his collaborative leadership style and ability to inspire teams to produce their best work. His campaigns have generated millions in revenue and earned recognition from top industry publications.",
      philosophy: "Great creative work happens at the intersection of strategy and imagination. I believe in empowering teams to take creative risks while staying focused on business objectives. Collaboration fuels innovation, and the best ideas often come from unexpected places when talented people work together.",
      skills: ["Creative Leadership", "Brand Storytelling", "Content Creation", "Advertising", "Campaign Development", "Team Collaboration", "Creative Strategy", "Cross-Channel Marketing"],
      email: "cameron.williamson@combinezenith.com",
      linkedin: "https://linkedin.com/in/cameron-williamson",
      twitter: "https://twitter.com/cameron_williamson",
      accomplishments: [
        {
          title: "Super Bowl Campaign",
          description: "Led creative team for Super Bowl commercial that generated $25M in earned media and 100M+ views.",
          image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=300&fit=crop"
        },
        {
          title: "Content Series Launch",
          description: "Created branded content series that achieved 200M+ views across platforms and won Emmy nomination.",
          image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop"
        },
        {
          title: "Cross-Platform Innovation",
          description: "Developed innovative cross-platform storytelling approach that increased engagement by 85% across all channels.",
          image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop"
        }
      ]
    },
    'Esha': {
      name: "Esha",
      role: "Client Relations Manager",
      tagline: "Building lasting partnerships through exceptional client experiences.",
      image: Esha,
      bio: "Esha is an experienced Client Relations Manager with 11+ years of building and nurturing strategic partnerships. Her expertise includes account management, client retention, and relationship development. Leslie has consistently maintained a 95%+ client satisfaction rate and has been instrumental in securing long-term contracts with major brands. She excels at understanding client needs, anticipating challenges, and delivering solutions that exceed expectations. Her proactive communication style and problem-solving abilities have made her a trusted advisor to clients across industries.",
      philosophy: "Strong client relationships are built on trust, transparency, and consistent delivery. I believe in being a true partner to our clients—understanding their business challenges deeply and working collaboratively to achieve their goals. Success is measured not just by project completion, but by the lasting value we create together.",
      skills: ["Client Relations", "Account Management", "Relationship Building", "Client Retention", "Communication", "Problem Solving", "Strategic Partnership", "Customer Success"],
      email: "leslie.alexander@combinezenith.com",
      linkedin: "https://linkedin.com/in/Esha",
      twitter: "https://twitter.com/Esha",
      accomplishments: [
        {
          title: "Client Retention Excellence",
          description: "Achieved 98% client retention rate over 5 years, managing portfolio of $15M+ annual recurring revenue.",
          image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop"
        },
        {
          title: "Strategic Account Growth",
          description: "Grew key accounts by 250% through upselling and cross-selling initiatives while maintaining satisfaction scores.",
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop"
        },
        {
          title: "Partnership Program Launch",
          description: "Designed and launched client partnership program that increased customer lifetime value by 40%.",
          image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=300&fit=crop"
        }
      ]
    }
  };

  const member = teamMembers[id];

  if (!member) {
    return (
    <div className="mt-30 min-h-screen bg-gradient-to-br from-black via-purple-950 to-purple-900 text-white relative overflow-hidden">

      {/* Decorative Elements - Right Side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-12 z-10">
        <div className="w-3 h-3 rounded-full bg-white opacity-60"></div>
        <div className="w-2 h-32 bg-purple-500 opacity-40"></div>
        <div className="w-3 h-3 rounded-full border-2 border-white opacity-60"></div>
        <div className="w-3 h-3 rounded-full border-2 border-white opacity-60"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-20 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <h2 className="text-5xl font-light mb-6">Team Member Not Found</h2>
          <p className="text-gray-300 mb-2">
            Oops! The page {`you're`} looking {`doesn't`} exist or has moved.
          </p>
          <p className="text-gray-300 mb-8">
            Please try navigating from the Team page or contact support.
          </p>
          
          <Link 
            href="/team"
            className="inline-block px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300"
          >
            Go back to Team Page
          </Link>
          
          <p className="mt-8 text-sm text-gray-400">
            If you believe there is an error, please contact support.
          </p>
        </div>
      </div>

      {/* Geometric Shapes */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-center pointer-events-none">
        {/* Large Triangle */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute" style={{ 
            width: 0, 
            height: 0, 
            borderLeft: '300px solid transparent',
            borderRight: '300px solid transparent',
            borderBottom: '520px solid rgba(88, 28, 135, 0.5)',
          }}></div>
          
          {/* Medium Triangle - Inverted */}
          <div className="absolute" style={{ 
            width: 0, 
            height: 0, 
            borderLeft: '120px solid transparent',
            borderRight: '120px solid transparent',
            borderTop: '208px solid rgba(88, 28, 135, 0.7)',
            transform: 'translate(-80px, -180px)'
          }}></div>
          
          {/* Star/Sparkle */}
          <div className="absolute bottom-32 right-32">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 0L32 28L60 30L32 32L30 60L28 32L0 30L28 28L30 0Z" fill="rgba(255, 255, 255, 0.3)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Overlay gradient for depth */}
      <div className="fixed inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none"></div>
    </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 p-4 sm:p-6 lg:p-8">
      <ProfileHeroSection member={member} />
      
      <div className="max-w-6xl mx-auto mt-8 sm:mt-10 lg:mt-12 space-y-6 sm:space-y-8 lg:space-y-12">
        <AboutMeSection 
          name={member.name}
          bio={member.bio}
          philosophy={member.philosophy}
        />

        <SkillsExpertiseSection skills={member.skills} />

        <TeamInfo 
          email={member.email}
          linkedin={member.linkedin}
          twitter={member.twitter}
        />
        <NotableAccomplishments accomplishments={member.accomplishments} />

      </div>
    </div>
  );
}