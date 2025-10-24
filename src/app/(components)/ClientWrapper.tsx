'use client';

import { useState, useEffect } from 'react';
import WhatsAppFloat from './WhatsAppFloat';
import TerraAIAssistant from './Agent';

export default function ClientWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <WhatsAppFloat />
      <TerraAIAssistant />
    </>
  );
}