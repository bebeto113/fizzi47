import localFont from 'next/font/local'

import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

import "./app.css";
import Header from '@/components/Header';
import ViewCanvas from '@/components/ViewCanvas';

const alpino = localFont({
  src: "../../public/fonts/Alpino-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-alpino",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={alpino.variable}>

      <body className='overflow-x-hidden bg-yellow-300'>
        <Header />
        <main>
          {children} {/* children no RootLayout é o conteúdo da rota atual. // Quando você acessa /, o children é app/page.tsx.  Quando você acessa /about, o children é app/about/page.tsx. */}
          <ViewCanvas />
        </main>
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
