import type { Metadata } from "next";
import { Providers } from "../providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Stats Dash",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
