'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { createContext, useEffect, useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DecentralGoods",
  description: "Decentralized Marketplace to sell your items. End to End Encryption to protect your data. No fees. No middleman. No tracking. No ads. No data collection. No cookies. No tracking. No analytics.",
  icons: {
    icon: "/img/logo.svg",
  }
};

export const metamaskContext = createContext<MetaMaskInpageProvider | undefined>(undefined);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const [provider, setProvider] = useState<MetaMaskInpageProvider | undefined>(undefined);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) { setProvider(window.ethereum); }
    else {
      console.log("Install Metamask");
    }
  }, [])

  return (
    <html lang="en">
      <metamaskContext.Provider value={provider}>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </metamaskContext.Provider>
    </html >
  );
}
