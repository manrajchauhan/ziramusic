import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Zira - Web Player: Music for everyone",
  description: "Zira By Manraj Chauhan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
         <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#1db954" />
      </head>
      <body>
        <Providers>
          {children}
       </Providers>
      </body>
    </html>
  );
}
