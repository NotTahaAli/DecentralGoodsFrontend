'use client'
import { MetaMaskProvider } from "@metamask/sdk-react";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <MetaMaskProvider debug={false} sdkOptions={{
            dappMetadata: {
                name: "DecentralGoods",
                url: "https://decentralgoods.com/",
            }
        }}>
            {children}
        </MetaMaskProvider>
    );
}