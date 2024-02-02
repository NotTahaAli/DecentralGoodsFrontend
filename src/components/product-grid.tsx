import ProductGridMember from "./product-grid-member";

export default function ProductGrid() {
    return (
        <section className="text-gray-400 bg-gray-900 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    <ProductGridMember sellerAddress="0x6Eda56336bd0654d1Dd88A825Bf236eD62E3b3b3" title="Shooting Stars" price="5 ETH" imgUrl="/img/test.jpeg" linkUrl="/" />
                    <ProductGridMember sellerAddress="0x6Eda56336bd0654d1Dd88A825Bf236eD62E3b3b3" title="Shooting Stars" price="0.3 ETH" imgUrl="/img/test.jpeg" linkUrl="/" />
                    <ProductGridMember sellerAddress="0x6Eda56336bd0654d1Dd88A825Bf236eD62E3b3b3" title="Shooting Stars" price="0.0012 ETH" imgUrl="/img/test.jpeg" linkUrl="/" />
                    <ProductGridMember sellerAddress="0x6Eda56336bd0654d1Dd88A825Bf236eD62E3b3b3" title="Shooting Stars" price="0.00004 ETH" imgUrl="/img/test.jpeg" linkUrl="/" />
                    <ProductGridMember sellerAddress="0x6Eda56336bd0654d1Dd88A825Bf236eD62E3b3b3" title="Shooting Stars" price="123 ETH" imgUrl="/img/test.jpeg" linkUrl="/" />
                </div>
            </div>
        </section>
    );
}