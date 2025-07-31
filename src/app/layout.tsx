import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

// Configuration des polices
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

// Métadonnées pour le SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://pioloop.com'),
  title: 'Pioloop | Location des logements moderne et sécurisée',
  description: 'Découvrez des logements et réservez votre séjour en toute simplicité. Une expérience de location immobilière moderne et sécurisée.',
  keywords: 'location, réservation, logement, vacances',
  authors: [{ name: 'Pioloop Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Pioloop | Location des logements moderne et sécurisée',
    description: 'Découvrez des logements et réservez votre séjour en toute simplicité.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://pioloop.com',
    siteName: 'Pioloop',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pioloop | Location de logements moderne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pioloop | Location des logements moderne et sécurisée',
    description: 'Découvrez des logements et réservez votre séjour en toute simplicité.',
    images: ['/images/twitter-image.png'],
  },
};

// Configuration du viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * LAYOUT PRINCIPAL DE L'APPLICATION
 * 
 * Ce layout est la BASE de toute l'application Next.js.
 * Il contient :
 * - Les balises HTML de base (<html>, <head>, <body>)
 * - Les polices (Inter, Poppins)
 * - Les métadonnées SEO
 * - AuthProvider pour la gestion de l'authentification
 * 
 * Ce layout N'INCLUT PAS de header/footer car ils sont gérés
 * par les layouts spécifiques des groupes de routes.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 