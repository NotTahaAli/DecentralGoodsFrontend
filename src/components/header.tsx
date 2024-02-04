'use client'
import { metamaskContext } from "@/app/layout";
import hexer from "@/utils/hexer";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Header() {
    const [account, setAccount] = useState<undefined | string>(undefined);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const provider = useContext(metamaskContext);

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
        const signature = await (provider?.request({
            "method": "personal_sign",
            "params": [
                hexer(publicKey + " " + curTime),
                account
            ]
        }))
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
        const accounts: any = await provider?.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const account = accounts[0];
        await setPublicKey(account);
        setConnecting(false);
    }

    useEffect(() => {
        provider?.on("accountsChanged", async (accounts: any) => {
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
    }, [])

    return (
        <header className="text-gray-400 bg-gray-900 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href="/" className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                    <div className="w-10 h-10 relative">
                        <Image
                            src="/img/logo.svg"
                            alt="DecentralGoods"
                            fill={true}
                        />
                    </div>
                    <span className="ml-3 text-xl">DecentralGoods</span>
                </Link>
                {connected ?
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <button className="mr-5 hover:text-white">{account} Disconnect</button>
                    </nav>
                    :
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <button disabled={connecting} onClick={connect} className="inline-flex items-center disabled:cursor-not-allowed disabled:bg-blue-300 bg-blue-600 text-white border-0 py-1 px-3 focus:outline-none hover:bg-blue-800 rounded text-base mt-4 md:mt-0">
                            {connecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                    </nav>
                }
            </div>
        </header>
    );
}