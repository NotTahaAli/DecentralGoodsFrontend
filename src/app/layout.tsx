import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Provider from "@/providers/metamask";
import ContractProvider from "@/providers/contract";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DecentralGoods",
  description: "Decentralized Marketplace to sell your items. End to End Encryption to protect your data. No fees. No middleman. No tracking. No ads. No data collection. No cookies. No tracking. No analytics.",
  icons: {
    icon: "/img/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <Provider>
        <ContractProvider>
          <body className={inter.className}>
            <Header />
            {children}
            <Footer />
          </body>
        </ContractProvider>
      </Provider>
    </html >
  );
}
