import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="text-gray-400 bg-gray-900 body-font">
            <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                    <div className="w-10 h-10 relative">
                        <Image
                            src="/vercel.svg"
                            alt="DecentralGoods"
                            fill={true}
                        />
                    </div>
                    <span className="ml-3 text-xl">DecentralGoods</span>
                </a>
                <span className="text-sm text-gray-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-800 sm:py-2 sm:mt-0 mt-4">© 2024 Muhammad Taha Ali —
                    <Link href="https://www.linkedin.com/in/mtaha-ali/" className="text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">@mtaha-ali</Link>
                </span>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                    <Link href="https://www.instagram.com/m_taha.ali/" className="ml-3 text-gray-400">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                        </svg>
                    </Link>
                    <Link href="https://www.linkedin.com/in/mtaha-ali/" className="ml-3 text-gray-400">
                        <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                            <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                            <circle cx="4" cy="4" r="2" stroke="none"></circle>
                        </svg>
                    </Link>
                </span>
            </div>
        </footer>);
}