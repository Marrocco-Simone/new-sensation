import Contexts from "./contexts";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rule CRAFT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Contexts>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Contexts>
  );
}
