'use client'
import { contractAbi, contractAddress } from "@/config/config";
import { Contract } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { metamaskContext } from "./metamask";
import { BrowserProvider } from "ethers";
import { Signer, Provider } from "ethers";

export const contractContext = createContext<{ contract?: Contract, signer?: Signer, provider?: Provider}>({});

export default function ContractProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [contract, setContract] = useState<Contract | undefined>(undefined);
    const [signer, setSigner] = useState<Signer | undefined>(undefined);
    const [provider, setProvider] = useState<Provider | undefined>(undefined);

    const { provider: metamaskProvider, account } = useContext(metamaskContext);

    useEffect(() => {
        if (!metamaskProvider) {
            setContract(undefined);
            setSigner(undefined);
            setProvider(undefined);
            return;
        }
        const etherProvider = new BrowserProvider(metamaskProvider);
        setProvider(etherProvider);
        etherProvider.getSigner().then((etherSigner) => {
            setContract(new Contract(contractAddress, contractAbi, etherSigner));
            setSigner(etherSigner);
        }).catch((err) => {
            console.error("Failed to get Signer", err);
            setContract(undefined);
            setSigner(undefined);
        });
    }, [metamaskProvider, account])

    return (
        <contractContext.Provider value={{ contract, signer, provider }}>
            {children}
        </contractContext.Provider>
    );
}