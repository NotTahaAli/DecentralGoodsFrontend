'use client'
import { metamaskContext } from "@/providers/metamask";
import ProductGrid from "@/components/product-grid";
import { productDetail } from "@/components/product-grid-member";
import { useContext, useEffect, useState } from "react";
import { contractContext } from "@/providers/contract";
export default function ProductPage({ params }: { params: { slug: string } }) {
    const [products, setProducts] = useState<productDetail[]>([]);

    const { connected } = useContext(metamaskContext);
    const { contract } = useContext(contractContext);

    useEffect(() => {
        if (!connected) {
            setProducts([]);
            return;
        }
        fetch("https://decentral-goods-backend.vercel.app/listings/seller/"+params.slug).then(async (res) => {
            if (!res.ok) {
                console.error("Failed to get Listings", res);
                setProducts([]);
                return;
            }
            const data = (await res.json()).message;
            for (const index in data) {
                const product = data[index];
                data[index] = {
                    sellerAddress: product.sellerAddress,
                    title: product.title,
                    imgUrl: product.imageUrl,
                    linkUrl: "/product/" + product.ListingId
                }
                try {
                    data[index].price = (await contract?.getListingInfo(product.ListingId))[0];
                } catch (err) {
                    console.log("Problem in Blockchain Connection", err);
                    data[index].price = 0;
                }
            }
            setProducts(data);
        }).catch((err) => {
            console.error("Failed to Fetch", err);
            setProducts([]);
        });
    }, [connected, contract])


    return (
        <main className="">
            {products.length == 0 && <h1 className="text-3xl py-5 text-white bg-gray-900 body-font text-center">{connected ? "No Listings as of yet." : "Connect Wallet to Continue"}</h1>}
            <ProductGrid products={products} />
        </main>
    );
}