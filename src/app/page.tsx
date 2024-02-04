'use client'
import ProductGrid from "@/components/product-grid";
import { productDetail } from "@/components/product-grid-member";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<productDetail[]>([]);

  useEffect(() => {
    fetch("https://decentral-goods-backend.vercel.app/listings?limit=25").then(async (res) => {
      const data = (await res.json()).message;
      for (const index in data) {
        const product = data[index];
        data[index] = {
          sellerAddress: product.sellerAddress,
          title: product.title,
          imgUrl: product.imageUrl,
          linkUrl: "/product/" + product.ListingId
        }
        data[index].price = 0;
      }
      setProducts(data);
    });
  }, [])


  return (
    <main className="">
      <ProductGrid products={products} />
    </main>
  );
}