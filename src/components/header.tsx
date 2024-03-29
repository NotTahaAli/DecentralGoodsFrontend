'use client'
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { metamaskContext } from "../providers/metamask";
import shortenAddress from "@/utils/shortenAddress";

export default function Header() {
    const { account, connected, connecting, connect } = useContext(metamaskContext);

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
                {(connected && account) ?
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <Link href={"/orders/buyer"} className="mr-5 hover:text-white">My Buyer Orders</Link>
                        <Link href={"/orders/seller"} className="mr-5 hover:text-white">My Seller Orders</Link>
                        <Link href={"/product/new"} className="inline-flex items-center disabled:cursor-not-allowed disabled:bg-blue-300 bg-blue-600 text-white border-0 py-1 px-3 focus:outline-none hover:bg-blue-800 rounded text-base mt-4 md:mt-0">
                            New Listing
                        </Link>
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