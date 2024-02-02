import Image from "next/image";
import Link from "next/link";

export default function ProductGridMember(props: { sellerAddress: string, title: string, price: string, imgUrl: string, linkUrl: string }) {
    const { sellerAddress, title, price, imgUrl, linkUrl } = props;
    let shortenedSellerAddress = sellerAddress.substring(0, 8) + "..." + sellerAddress.substring(sellerAddress.length - 4);
    return (
        <div className="lg:w-1/4 md:w-1/2 p-4 w-full">
            <Link href={linkUrl} className="block relative h-48 rounded overflow-hidden">
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