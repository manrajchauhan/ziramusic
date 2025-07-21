import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zira - Web Player:Music for everyone",
  description: "Zira By Manraj Chauhan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        {children}
      </body>
    </html>
  );
}
