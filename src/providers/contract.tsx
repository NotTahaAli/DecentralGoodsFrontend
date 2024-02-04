'use client'
import { contractAbi, contractAddress } from "@/config/config";
import { Contract } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { metamaskContext } from "./metamask";
import { BrowserProvider } from "ethers";

export const contractContext = createContext<{ contract?: Contract }>({});

export default function ContractProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [contract, setContract] = useState<Contract | undefined>(undefined);

    const { provider } = useContext(metamaskContext);

    useEffect(() => {
        if (!provider) {
            setContract(undefined);
            return;
        }
        const etherProvider = new BrowserProvider(provider);
        etherProvider.getSigner().then((etherSigner) => {
            setContract(new Contract(contractAddress, contractAbi, etherSigner));
        });
    }, [provider])

    return (
        <contractContext.Provider value={{ contract }}>
            {children}
        </contractContext.Provider>
    );
}