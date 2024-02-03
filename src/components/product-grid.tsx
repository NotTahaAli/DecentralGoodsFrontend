import ProductGridMember, { productDetail } from "./product-grid-member";

export default function ProductGrid(props: { products: productDetail[] }) {
    const { products } = props;
    return (
        <section className="text-gray-400 bg-gray-900 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {products.map((product, index) => {
                        return <ProductGridMember key={index} sellerAddress={product.sellerAddress} title={product.title} price={product.price} imgUrl={product.imgUrl} linkUrl={product.linkUrl} />
                    })}
                </div>
            </div>
        </section>
    );
}