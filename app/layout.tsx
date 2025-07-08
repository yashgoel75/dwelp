import type { Metadata } from "next";
import "./globals.css";
import App from "./providers";

export const metadata: Metadata = {
  title: "Dwelp - Digital Records on the Blockchain",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <App>{children}</App>
      </body>
    </html>
  );
}
