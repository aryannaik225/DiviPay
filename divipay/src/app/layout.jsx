import { Poppins } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/utils/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100", "200", "300", "400", "500",
    "600", "700", "800", "900"
  ],
  style: ["normal", "italic"],
  variable: "--font-poppins",
})

export const viewport = { 
  themeColor: "#ffffff",
}

export const metadata = {
  title: "DiviPay",
  description: "An app to simplify expense distribution among friends",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
