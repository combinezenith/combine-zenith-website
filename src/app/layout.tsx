import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import CursorSpark from "@/app/(components)/CursorSpark";
import NextAuthProvider from "@/app/context/NextAuthProvider";
import { Toaster } from "react-hot-toast";

const surgena = localFont({
  src: [
    { path: "./fonts/Surgena-Regular.woff2", weight: "400" },
    { path: "./fonts/Surgena-Medium.woff2", weight: "500" },
    { path: "./fonts/Surgena-Bold.woff2", weight: "700" },
  ],
  variable: "--font-surgena",
});

const glancyr = localFont({
  src: [
    { path: "./fonts/Glancyr-Regular.woff2", weight: "400" },
    { path: "./fonts/Glancyr-Medium.woff2", weight: "500" },
    { path: "./fonts/Glancyr-Bold.woff2", weight: "700" },
  ],
  variable: "--font-glancyr",
});

const montserrat = localFont({
  src: [
    { path: "./fonts/Montserrat-Thin.woff2", weight: "100" },
    {
      path: "./fonts/Montserrat-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    { path: "./fonts/Montserrat-Regular.woff2", weight: "400" },
    { path: "./fonts/Montserrat-Bold.woff2", weight: "700" },
  ],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Combine Zenith",
  description: "Combine Zenith website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body
        className={`${surgena.variable} ${glancyr.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <NextAuthProvider>
          <CursorSpark />
          {children}
        </NextAuthProvider>

        {/* ✅ Global Toasts */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#2a2250",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 16px",
            },
          }}
        />

        {/* ✅ Google Analytics Scripts */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
