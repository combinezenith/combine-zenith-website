'use client';

import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactDetails() {
  return (
    <section
      className="py-20 px-6"
      aria-labelledby="headquarters-heading"
    >
      <div className="container mx-auto max-w-6xl">
            <h2
              id="headquarters-heading"
              className="text-4xl md:text-5xl font-bold text-white leading-tight font-glancyr text-center mb-12"
            >
              Find Our Headquarters
            </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-8">

            {/* Info Blocks */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-accent mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Our Address</h3>
                  <p className="text-white/90">
                    B, University, 18 Road, Block 16 Gulshan-e-Iqbal, Karachi, 75300
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-accent mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Phone Number</h3>
                  <p className="text-white/90">+92 319 3372277</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-accent mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                  <p className="text-white/90">info@combinezenith.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center lg:justify-end">
            <iframe
              src="https://maps.google.com/maps?q=Combine+Group+B+University+18+Road+Block+16+Gulshan-e-Iqbal+Karachi+75300&z=17&t=m&output=embed"
              width="400"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl shadow-lg max-w-full
              "
              title="Google Maps location of Combine Zenith headquarters"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
