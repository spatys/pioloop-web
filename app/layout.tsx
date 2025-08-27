import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SWRProvider } from "@/providers/SWRProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { LoaderProvider } from "@/context/LoaderContext";
import { FetchInterceptor } from "@/components/shared/FetchInterceptor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pioloop - Location de logements",
  description: "Trouvez votre logement idéal avec Pioloop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SWRProvider>
          <AuthProvider>
            <LoaderProvider>
              <FetchInterceptor />
              <ConditionalLayout>{children}</ConditionalLayout>
            </LoaderProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
