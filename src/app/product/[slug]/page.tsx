'use client'
import { contractContext } from "@/providers/contract";
import { metamaskContext } from "@/providers/metamask";
import shortenAddress from "@/utils/shortenAddress";
import { formatUnits } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState({ sellerAddress: "0xABCDEF123456789", title: "Loading Product...", description: "Lorem Ipsum...", price: "0", imgUrl: "/img/test.jpeg", quantity: 0 });
    const { contract } = useContext(contractContext);
    const { connected } = useContext(metamaskContext);

    function buyItem() {
        if (!connected) {
            alert("Connect Wallet to Continue");
            return;
        }
        alert("This feature is not yet implemented");
    };

    useEffect(() => {
        fetch("https://decentral-goods-backend.vercel.app/listings/" + params.slug).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                const productData = {
                    sellerAddress: data.message.sellerAddress,
                    title: data.message.title,
                    description: data.message.description,
                    price: "0",
                    imgUrl: data.message.imageUrl,
                    quantity: 0
                }
                try {
                    let resp = await contract?.getListingInfo(params.slug);
                    productData.price = resp[0];
                    productData.quantity = resp[1];
                } catch (err) {
                    console.log("Problem in Blockchain Connection", err);
                }
                setProduct(productData);
            } else {
                console.error("Failed to get Listing", res);
                setProduct({ sellerAddress: "0xABCDEF123456789", title: "Failed to Load Product", description: (res.status == 404) ? "Product does not exist" : (await res.json()).message.toString(), price: "0", imgUrl: "/img/test.jpeg", quantity: 0 });
            }
        }).catch((err) => {
            console.error("Failed to Fetch", err);
            setProduct({ sellerAddress: "0xABCDEF123456789", title: "Failed to Load Product", description: err instanceof Error ? err.message : err, price: "0", imgUrl: "/img/test.jpeg", quantity: 0 });
        });
    }, [params.slug, contract]);

    return (
        <main>
            <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded relative">
                            <Image alt="ecommerce" fill={true} src={product.imgUrl} style={{ objectFit: "contain" }} />
                        </div>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <Link href={"/seller/"+product.sellerAddress} className="text-sm title-font text-gray-500 tracking-widest hover:underline">{shortenAddress(product.sellerAddress)}</Link>
                            <h1 className="text-white text-3xl title-font font-medium mb-1">{product.title}</h1>
                            <p className="leading-relaxed">{product.description}</p>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-white">{formatUnits(product.price, 18)} ETH</span>
                                <button disabled={!connected || product.quantity == 0} className="flex ml-auto disabled:cursor-not-allowed disabled:bg-blue-300 bg-blue-600 text-white border-0 py-2 px-6 focus:outline-none hover:bg-blue-800 rounded" onClick={buyItem}>Buy Item</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}