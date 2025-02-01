import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import Navbar from "@/app/components/Navbar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "HomeVideos",
  description: "Birch family videos",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
    <body>
    <Navbar/>
    {children}
    </body>
    </html>
  );
}
