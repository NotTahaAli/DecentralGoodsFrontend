import ProductGrid from "@/components/product-grid";

export default function Home() {
  return (
    <main className="">
      <ProductGrid products={[
        {sellerAddress: "0x1234567890", title: "Product 1", price: "0.1 ETH", imgUrl: "/img/test.jpeg", linkUrl: "/product/1"},
        {sellerAddress: "0x1234567890", title: "Product 2", price: "0.2 ETH", imgUrl: "/img/test.jpeg", linkUrl: "/product/2"},
        {sellerAddress: "0x1234567890", title: "Product 3", price: "0.3 ETH", imgUrl: "/img/test.jpeg", linkUrl: "/product/3"},
        {sellerAddress: "0x1234567890", title: "Product 4", price: "0.4 ETH", imgUrl: "/img/test.jpeg", linkUrl: "/product/4"},
        {sellerAddress: "0x1234567890", title: "Product 5", price: "0.5 ETH", imgUrl: "/img/test.jpeg", linkUrl: "/product/5"},
      ]} />
    </main>
  );
}