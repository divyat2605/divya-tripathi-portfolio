import { Geist, Geist_Mono, Baloo_2, Dancing_Script } from "next/font/google";
import "./globals.css";
import { SITE_URL } from '@/lib/siteConfig';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Divya Tripathi | Software Engineer',
    template: '%s | Divya Tripathi',
  },
  description:
    'Aspiring Software Engineer specializing in backend systems, AI/ML, and Retrieval-Augmented Generation (RAG) using Python, FastAPI, and Docker. Available worldwide for opportunities.',
  keywords: [
    'Divya Tripathi',
    'Software Engineer',
    'Backend Developer',
    'AI/ML Engineer',
    'FastAPI Developer',
    'Python Developer',
    'LangChain',
    'RAG Systems',
    'Portfolio',
    'India',
  ],
  authors: [{ name: 'Divya Tripathi', url: SITE_URL }],
  creator: 'Divya Tripathi',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Divya Tripathi',
    title: 'Divya Tripathi | Software Engineer',
    description:
      'Aspiring Software Engineer specializing in backend systems, AI/ML, and Retrieval-Augmented Generation (RAG) using Python, FastAPI, and Docker. Available worldwide for opportunities.',
    images: [
      {
        url: '/assets/speaker.png',
        width: 1200,
        height: 630,
        alt: 'Divya Tripathi | Software Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divya Tripathi | Software Engineer',
    description:
      'Aspiring Software Engineer specializing in backend systems, AI/ML, and Retrieval-Augmented Generation (RAG) using Python, FastAPI, and Docker. Available worldwide for opportunities.',
    images: ['/assets/speaker.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png' },
      { url: '/favicons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicons/manifest.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Divya Tripathi',
              url: SITE_URL,
              email: 'divya.tripathi.official2605@gmail.com',
              jobTitle: 'Software Engineer',
              sameAs: [
                'https://github.com/divyat2605',
                'https://www.linkedin.com/in/divya-tripathi-techenthusiast/',
              ],
            }),
          }}
        />

        {children}
        <Analytics />
      </body>
    </html>
  );
}