import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="text-gray-400 bg-gray-900 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href="/" className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                    <div className="w-10 h-10 relative">
                        <Image
                            src="/vercel.svg"
                            alt="DecentralGoods"
                            fill={true}
                        />
                    </div>
                    <span className="ml-3 text-xl">DecentralGoods</span>
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link href="#" className="mr-5 hover:text-white">Link</Link>
                </nav>
                <button className="inline-flex items-center bg-blue-600 text-white border-0 py-1 px-3 focus:outline-none hover:bg-blue-800 rounded text-base mt-4 md:mt-0">
                    Connect Wallet
                </button>
            </div>
        </header>
    );
}