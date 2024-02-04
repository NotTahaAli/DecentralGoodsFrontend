import shortenAddress from "@/utils/shortenAddress";
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
            <Link href={linkUrl} target="_blank" className="block relative h-48 rounded overflow-hidden">
                <div className="relative object-cover object-center w-full h-full block">
                    <Image alt="ecommerce" fill={true} src={imgUrl} />
                </div>
            </Link>
            <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{shortenedSellerAddress}</h3>
                <h2 className="text-white title-font text-lg font-medium">{title}</h2>
                <p className="mt-1">{price}</p>
            </div>
        </div>
    )
}