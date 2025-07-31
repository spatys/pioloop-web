import type { Metadata } from 'next';
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
  title: 'Pioloop - Location immobilière moderne et sécurisée',
  description: 'Découvrez des propriétés uniques et réservez votre séjour en toute simplicité. Une expérience de location immobilière moderne et sécurisée.',
  keywords: 'location, immobilier, propriété, réservation, logement, vacances',
  authors: [{ name: 'Pioloop Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Pioloop - Location immobilière moderne et sécurisée',
    description: 'Découvrez des propriétés uniques et réservez votre séjour en toute simplicité.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pioloop - Location immobilière moderne et sécurisée',
    description: 'Découvrez des propriétés uniques et réservez votre séjour en toute simplicité.',
  },
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
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