'use client';

import { usePathname } from 'next/navigation'
import Header from "@/app/(components)/Header";
import CursorSpark from "@/app/(components)/CursorSpark";
import Footer from "@/app/(components)/Footer";
import WhatsAppFloat from "@/app/(components)/WhatsAppFloat";
import Agent from "@/app/(components)/Agent";
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <CursorSpark />}
      {children}
      {!isAdmin && <WhatsAppFloat />}
      {!isAdmin && <Agent />}
      {!isAdmin && <Footer />}
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#685885',
            color: '#200053',
            borderRadius: '8px',
            fontFamily: 'var(--font-montserrat)',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#b5a6d0',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
