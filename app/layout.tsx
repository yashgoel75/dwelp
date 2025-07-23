import type { Metadata } from "next";
import "./globals.css";
import App from "./providers";
import { ThemeProvider } from "./context/theme";

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
        <App><ThemeProvider>{children}</ThemeProvider></App>
      </body>
    </html>
  );
}
