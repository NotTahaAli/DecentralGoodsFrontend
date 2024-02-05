'use client'
import { contractChainId } from "@/config/config";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createContext, useContext, useEffect, useState } from "react";
import { contractContext } from "./contract";

export const metamaskContext = createContext<{
    provider?: MetaMaskInpageProvider,
    account?: string,
    connected: boolean,
    connecting: boolean,
    connect: () => Promise<void>
}>({
    connected: false,
    connecting: false,
    connect: async function () { }
});

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const {signer} = useContext(contractContext);

    async function updatePublicKey(account: string) {
        const curTime = Date.now();
        console.log(JSON.stringify({
            "method": "eth_getEncryptionPublicKey",
            "params": [account]
        }));
        const publicKey = await (provider?.request({
            "method": "eth_getEncryptionPublicKey",
            "params": [account]
        }));
        // const signature = await (provider?.request({
        //     "method": "personal_sign",
        //     "params": [
        //         hexer(publicKey + " " + curTime),
        //         account
        //     ]
        // }))
        const signature = await signer?.signMessage(publicKey + " " + curTime);
        const res = await fetch("https://decentral-goods-backend.vercel.app/publicKey/" + account, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                publicKey,
                timestamp: curTime,
                signature
            })
        })
        const { success, message } = await res.json();
        if (success) {
            console.log("Public Key Added");
        } else {
            throw Error(message);
        }
    }

    async function setPublicKey(account: undefined | string) {
        if (account) {
            try {
                await changeChain();
            } catch (err) {
                console.log("Unable to Change Chain", err);
                setConnected(false);
                return;
            }
            const res = await fetch("https://decentral-goods-backend.vercel.app/publicKey/" + account)
            const { success, message } = await res.json();
            if (!success && res.status == 404) {
                console.log("Public Key Not Found");
                try {
                    await updatePublicKey(account);
                    setConnected(true);
                } catch (err) {
                    console.log("Failed To Add Public Key", err);
                    setConnected(false);
                }
            } else if (success) {
                setConnected(true);
            }
        }
    }

    async function connect() {
        setConnecting(true);
        try {
            const accounts: any = await provider?.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            const account = accounts[0];
            await setPublicKey(account);
        } catch (err) {
            setConnected(false);
            console.log("Error while Connecting", err);
        }
        setConnecting(false);
    }

    async function changeChain() {
        const chainId = await provider?.request({
            method: "eth_chainId"
        });
        if (chainId != contractChainId) {
            await provider?.request({
                "method": "wallet_switchEthereumChain",
                "params": [
                    {
                        "chainId": contractChainId
                    }
                ]
            });
        }
    }

    const [provider, setProvider] = useState<MetaMaskInpageProvider | undefined>(undefined);
    const [account, setAccount] = useState<undefined | string>(undefined);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            setProvider(window.ethereum);

            changeChain();

            window.ethereum.on("accountsChanged", async (accounts: any) => {
                if (accounts.length == 0) {
                    setConnected(false);
                } else {
                    setAccount(accounts[0]);
                    const account = accounts[0];
                    setConnecting(true);
                    await setPublicKey(account);
                    setConnecting(false);
                }
            });

            window.ethereum.on("chainChanged", (chainId) => {
                if (chainId != contractChainId) window.location.reload();
            })
        }
        else {
            console.log("Install Metamask");
        }
    }, [])

    return (
        <metamaskContext.Provider value={{ provider, account, connected, connecting, connect }}>
            {children}
        </metamaskContext.Provider>
    );
}