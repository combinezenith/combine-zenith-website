import { usePathname } from 'next/navigation'
import Header from "@/app/(components)/Header";
import CursorSpark from "@/app/(components)/CursorSpark";
import Footer from "@/app/(components)/Footer";
import WhatsAppFloat from "@/app/(components)/WhatsAppFloat";
import Agent from "@/app/(components)/Agent";
export default function Layout({ children }: { children: React.ReactNode }) {  
const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <html lang="en">
      <body
        className='bg-background text-foreground'
      >
        {!isAdmin && <Header />}
        {!isAdmin && <CursorSpark />}
        {children}
        {!isAdmin && <WhatsAppFloat />}
        {!isAdmin && <Agent />}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}