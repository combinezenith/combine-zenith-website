'use client';

export default function AboutStory() {
  return (
    <section className="mt-20 relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="mb-20 container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Story Igniting Brands
              for a Digital Tomorrow
            </h1>
            </div>

          {/* Content Section */}
<div className="space-y-8 text-center max-w-3xl mx-auto text-bold">
  <p className="text-lg text-gray-300 leading-relaxed">
    At Combine Zenith, we believe in the transformative power of strategic marketing.
    We are a collective of innovative minds, passionate about elevating brands and
    driving meaningful connections in an ever-evolving digital landscape. Our mission
    is to empower businesses to not just compete, but to lead.
  </p>
  <p className="space-y-8 text-center text-white max-w-3xl mx-auto">
Founded on principles of creativity, integrity, and relentless excellence, we craft bespoke strategies that
resonate with your audience and deliver measurable impact. We&apos;re not just service providers; we are your partners in
growth, dedicated to uncovering your unique potential and projecting it powerfully to the world. Join us on a journey to
redefine what&apos;s possible for your brand.
  </p>
</div>
        </div>
      </div>
    </section>
  );
}