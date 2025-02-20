'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DiviPay",
  description: "An app to simplify expense distribution among friends",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then(() => {
        console.log("Service Worker Registered");
      }).catch((error) => console.error("Service Worker Registration Failed: ", error));
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
