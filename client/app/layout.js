import localFont from "next/font/local";
import "./globals.css";
import { PlaiaZoneProvider } from "../context/PlaiaZone";
import DarkModeToggle from "@/components/DarkModeToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "BackMyGame - Help Your Fellow Gamers",
  description: "Help your fellow gamers and Earn",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head> <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased px-6 md:px-12 lg:px-24 dark:bg-[#1f2022]`}
        >
          <PlaiaZoneProvider>
            {children}
            <DarkModeToggle />
          </PlaiaZoneProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
