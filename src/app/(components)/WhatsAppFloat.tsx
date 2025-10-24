'use client';

import Image from 'next/image';

export default function WhatsAppFloat() {
  const phoneNumber = "+923193372277";
  const message = "Hello! I'm interested in your services.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-all duration-300 hover:scale-110 hover:rotate-12"
        aria-label="Contact us on WhatsApp"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 border-2 border-white">
            <Image
              src="/Whatsapp.png" 
              alt="WhatsApp" 
              width={28}
              height={28}
              className="w-8 h-8"
            />
          </div>
          <div className="absolute inset-0 w-14 h-14 bg-green-500 rounded-full animate-ping opacity-20"></div>
        </div>
      </a>
    </div>
  );
}
