'use client';

export default function AboutStory() {
  return (
    <section aria-label="About Story Section" className="mt-20 relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div aria-label="Background Decorations" className="absolute inset-0 overflow-hidden">
        <div aria-label="Background Blur Circle 1" className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl" />
        <div aria-label="Background Blur Circle 2" className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full blur-3xl" />
        <div aria-label="Background Blur Circle 3" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div aria-label="About Content Container" className="mb-20 container mx-auto px-6 relative z-10">
        <div aria-label="About Text Content" className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div aria-label="About Header" className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Where Creativity Meets Connection, Vision Turns Into Reality
            </h1>
            </div>

          {/* Content Section */}
<div aria-label="About Description" className="space-y-8 text-center max-w-3xl mx-auto text-bold">
  <p className="text-lg text-gray-300 leading-relaxed">
    At Combine Zenith, creativity isn&apos;t just about colors, shapes, or visuals it&apos;s about people, emotions, and purpose. We believe every brand has a story worth telling a story that deserves honesty, heart, and imagination.
  </p>
  <p className="text-lg text-gray-300 leading-relaxed">
    We don&apos;t just build campaigns; we build meaningful connections. Before creating, we listen to your ideas, challenges, and dreams because behind every brand lies a purpose waiting to shine.
  </p>
  <p className="text-lg text-gray-300 leading-relaxed">
    Our team of dreamers, thinkers, and creators blends strategy with imagination and design with emotion to craft experiences that not only look extraordinary but feel authentic. We don&apos;t see clients as projects we see them as partners. Every logo, campaign, and concept we craft carries a piece of your story and our promise of passion and precision.
  </p>
  <p className="text-lg text-gray-300 leading-relaxed">
    We work with brands that dare to dream, grow, and make an impact because we believe great work happens when passion meets purpose. Our goal isn&apos;t just to make you visible it&apos;s to elevate our clients to the peak of their market success and make their presence unforgettable.
  </p>
</div>
        </div>
      </div>
    </section>
  );
}