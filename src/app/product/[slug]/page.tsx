'use client'
import { contractContext } from "@/providers/contract";
import { metamaskContext } from "@/providers/metamask";
import { getEncryptedMessage } from "@/utils/encryptMessage";
import shortenAddress from "@/utils/shortenAddress";
import { ContractTransactionResponse, EventLog, parseUnits } from "ethers";
import { formatUnits } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductPage({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const [product, setProduct] = useState({ sellerAddress: "0xABCDEF123456789", title: "Loading Product...", description: "Lorem Ipsum...", price: "0", imgUrl: "/img/test.jpeg", quantity: 0 });
    const [update, setUpdate] = useState(0);
    const { contract, provider, signer } = useContext(contractContext);
    const { connected, account } = useContext(metamaskContext);

    const [buying, setBuying] = useState(false);

    function buyItem(quantity: number, data: string = "") {
        setBuying(true);
        (async () => {
            if (!connected || !account || !provider) {
                alert("Connect Wallet to Continue");
                return;
            }
            if (product.quantity == 0) {
                alert("Item is out of stock");
                return;
            }
            if (product.sellerAddress == "0xABCDEF123456789") {
                alert("Invalid Product");
                return;
            };
            try {
                if (await (provider?.getBalance(account)) < BigInt(product.price) * BigInt(quantity)) {
                    alert("Insufficient Balance");
                    return;
                }
                const res = await fetch("https://decentral-goods-backend.vercel.app/publicKey/" + product.sellerAddress);
                if (!res.ok) {
                    console.error("Failed to get Public Key of Seller", res);
                    alert("Failed to get Public Key of Seller");
                    return;
                }
                const sellerPublicKey = (await res.json()).message;
                const encryptedData = getEncryptedMessage(data, sellerPublicKey);
                console.log(encryptedData);
                let tx: ContractTransactionResponse;
                try {
                    tx = await contract?.buyItem(params.slug, quantity, { value: BigInt(product.price) * BigInt(quantity) });
                } catch (err: any) {
                    console.error("Failed to buy product", err);
                    if (err?.code === 'CALL_EXCEPTION' && err?.reason) {
                        alert(err.reason);
                    } else {
                        alert("Failed to buy product");
                    }
                    return;
                }
                const resp = await tx.wait();
                if (resp == null) {
                    console.error("Failed to buy product");
                    return;
                }
                const event = resp.logs[0];
                if (!(event instanceof EventLog)) {
                    console.error("Failed to buy product", resp);
                    return;
                }
                console.log(event.args[0]);
                const orderId = event.args[0].toString();
                const curTime = Date.now();
                const signature = await signer?.signMessage(JSON.stringify({ buyerInfo: encryptedData.toLowerCase(), orderId }, ["orderId", "buyerInfo"]) + " " + curTime);
                const response = await fetch("https://decentral-goods-backend.vercel.app/orders/" + orderId, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        address: account,
                        timestamp: curTime,
                        signature,
                        buyerInfo: encryptedData
                    })
                });
                if (!response.ok) {
                    console.error("Failed to send order info to Seller", response);
                    alert("Failed to send order info to Seller");
                    return;
                }
                alert("Order Placed Successfully");
            } catch (err) {
                console.error("Failed to buy product", err);
                alert("Failed to buy product");
            }
        })().then(() => { router.refresh() });
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
    }, [params.slug, contract, update]);

    function buyItemPopup() {
        Swal.fire({
            title: 'Buy Item',
            html: '<div class="flex w-full items-center justify-between">Quantity <input id="quantity" class="swal2-input w-3/5" placeholder="Quantity" type="number" value="1" required min="1"></div>' +
                '<div class="flex w-full items-center justify-between">Address <input id="data" class="swal2-input w-3/5" placeholder="Address" type="text" required></div>',
            showCancelButton: true,
            confirmButtonText: 'Buy',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const quantity = (document.getElementById('quantity') as HTMLInputElement).value;
                const data = (document.getElementById('data') as HTMLInputElement).value;
                if (quantity == "" || data == "") {
                    Swal.showValidationMessage("Quantity and Address are required");
                    return;
                }
                if (quantity != parseInt(quantity).toString()) {
                    Swal.showValidationMessage("Quantity should be an integer");
                    return;
                }
                if (parseInt(quantity) < 1) {
                    Swal.showValidationMessage("Quantity should be greater than 0");
                    return;
                }
                return buyItem(parseInt(quantity), data);
            }
        });
    }

    function editItemPopup() {
        Swal.fire({
            title: 'Edit Item',
            html: '<div class="flex w-full items-center justify-between">Quantity <input id="quantity" class="swal2-input w-3/5" placeholder="Quantity" type="number" value="' + product.quantity + '" required min="0"></div>' +
                '<div class="flex w-full items-center justify-between"><br> Price <input id="price" class="swal2-input w-3/5" placeholder="Price" type="number" value="' + formatUnits(product.price, 18) + '" required min="0.000000001" step="0.000000001"></div>',
            showCancelButton: true,
            confirmButtonText: 'Edit',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const quantity = (document.getElementById('quantity') as HTMLInputElement).value;
                const price = (document.getElementById('price') as HTMLInputElement).value;
                if (quantity == "" || price == "") {
                    Swal.showValidationMessage("Quantity and Price are required");
                    return;
                }
                if (quantity != parseInt(quantity).toString()) {
                    Swal.showValidationMessage("Quantity should be an integer");
                    return;
                }
                if (parseInt(quantity) < 0) {
                    Swal.showValidationMessage("Quantity should be greater than or equal to 0");
                    return;
                }
                if (price != parseFloat(price).toString()) {
                    Swal.showValidationMessage("Price should be a number");
                    return;
                }
                if (parseFloat(price) <= 0) {
                    Swal.showValidationMessage("Price should be greater than 0");
                    return;
                }
                return (async () => {
                    Swal.fire("Please wait");
                    Swal.showLoading();
                    if (parseUnits(price, 18) != BigInt(product.price)) {
                        try {
                            const tx = await contract?.changePrice(params.slug, parseUnits(price, 18));
                            const resp = await tx.wait();
                        } catch (err: any) {
                            console.error("Failed to change price", err);
                            if (err?.code === 'CALL_EXCEPTION' && err?.reason) {
                                alert(err.reason);
                            } else {
                                alert("Failed to change price");
                            }
                            return;
                        }
                    }
                    if (parseInt(quantity) != product.quantity) {
                        try {
                            const tx = await contract?.changeStock(params.slug, quantity);
                            const resp = await tx.wait();
                        } catch (err: any) {
                            console.error("Failed to change quantity", err);
                            if (err?.code === 'CALL_EXCEPTION' && err?.reason) {
                                alert(err.reason);
                            } else {
                                alert("Failed to change quantity");
                            }
                            return;
                        }
                    }
                })().then(() => { setUpdate(update+1); Swal.close(); });
            }
        });
    }

    return (
        <main>
            <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded relative">
                            <Image alt="ecommerce" fill={true} src={product.imgUrl} style={{ objectFit: "contain" }} />
                        </div>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <Link href={"/seller/" + product.sellerAddress} className="text-sm title-font text-gray-500 tracking-widest hover:underline">{shortenAddress(product.sellerAddress)}</Link>
                            <h1 className="text-white text-3xl title-font font-medium mb-1">{product.title}</h1>
                            <p className="leading-relaxed">{product.description}</p>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="flex">
                                <span className="title-font font-medium text-2xl text-white">{formatUnits(product.price, 18)} ETH</span>
                                <button disabled={!connected || (product.quantity == 0 && product.sellerAddress.toLowerCase() != account?.toLowerCase())} className="flex ml-auto disabled:cursor-not-allowed disabled:bg-blue-300 bg-blue-600 text-white border-0 py-2 px-6 focus:outline-none hover:bg-blue-800 rounded" onClick={() => { if (product.sellerAddress.toLowerCase() == account?.toLowerCase()) { editItemPopup() } else { buyItemPopup() } }}>{product.sellerAddress.toLowerCase() == account?.toLowerCase() ? "Edit Item" : "Buy Item"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}