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
                    B-18, Block 16, Gulshan-e-Iqbal, Karachi
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
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1656.2622323475418!2d67.0791341!3d24.9046869!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f27a93d4a63%3A0x6aa262346658a91d!2sCombine%20Consultants%20(Pvt)%20Ltd!5e1!3m2!1sen!2s!4v1763437299487!5m2!1sen!2s"
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
