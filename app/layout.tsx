import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title:       "Snap Fury — Marvel Snap's #1 Clip Community",
  description: "Share your greatest Marvel Snap moments. Upload, browse, and react to the best snaps in the community.",
  openGraph: {
    title:       "Snap Fury",
    description: "Marvel Snap's #1 Clip Community",
    siteName:    "Snap Fury",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&family=Permanent+Marker&family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
