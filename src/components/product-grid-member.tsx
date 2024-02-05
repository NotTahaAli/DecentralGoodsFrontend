import shortenAddress from "@/utils/shortenAddress";
import { formatUnits } from "ethers";
import Image from "next/image";
import Link from "next/link";

export type productDetail = {
    sellerAddress: string,
    title: string,
    price: string,
    imgUrl: string,
    linkUrl: string
}

export default function ProductGridMember(props: productDetail) {
    const { sellerAddress, title, price, imgUrl, linkUrl } = props;
    let shortenedSellerAddress = shortenAddress(sellerAddress);
    return (
        <div className="lg:w-1/4 md:w-1/2 p-4 w-full">
            <Link href={linkUrl} className="block relative h-48 rounded overflow-hidden">
                <div className="relative object-cover object-center w-full h-full block">
                    <Image alt="ecommerce" fill={true} src={imgUrl} style={{ objectFit: "contain" }} />
                </div>
            </Link>
            <div className="mt-4">
                <Link href={"/seller/"+sellerAddress} className="text-gray-500 text-xs tracking-widest title-font mb-1 hover:underline">{shortenedSellerAddress}</Link>
                <h2 className="text-white title-font text-lg font-medium">{title}</h2>
                <p className="mt-1">{formatUnits(price, 18)} ETH</p>
            </div>
        </div>
    )
}