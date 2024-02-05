'use client'
import { contractContext } from "@/providers/contract";
import { metamaskContext } from "@/providers/metamask";
import fileUploadToBase64 from "@/utils/fileUploadToBase64";
import { EventLog } from "ethers";
import { ContractTransactionResponse } from "ethers";
import { parseUnits } from "ethers";
import Image from "next/image";
import { ChangeEvent, useContext, useEffect, useState } from "react"

export default function NewProduct() {

    const { connected, account, provider } = useContext(metamaskContext);
    const [creating, setCreating] = useState(false);
    const [fileBase64, setFileBase64] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const { contract, signer } = useContext(contractContext);

    useEffect(() => {
        if (!connected) {
            console.error("Not connected to wallet");
        }
    }, [connected]);

    function makeProduct(formData: FormData) {
        setCreating(true);
        const imageInfo = formData.get('imageFile');
        if (imageInfo == null || !(imageInfo instanceof File) || imageInfo.size == 0) {
            setFileBase64(null);
            setFileError("File not found");
            setCreating(false);
            return;
        }
        if (imageInfo.size > Math.pow(2, 20)) {
            setFileBase64(null);
            setFileError("File too large");
            setCreating(false);
            return;
        }
        const title = formData.get('title');
        const description = formData.get('description');
        const price = formData.get('price');
        const quantity = formData.get('quantity');
        if (title == null || description == null || price == null || (price instanceof File) || quantity == null || (quantity instanceof File)) {
            setCreating(false);
            return;
        }
        const priceNum = parseUnits(price, 18);
        const quantityNum = parseInt(quantity);
        if (isNaN(quantityNum)) {
            setCreating(false);
            return;
        };
        (async () => {
            try {
                const tx: ContractTransactionResponse = await contract?.listItem(priceNum, quantityNum);
                console.log(tx);
                const resp = await tx.wait();
                if (resp == null) {
                    console.error("Failed to create product");
                    setCreating(false);
                    return;
                }
                const event = resp.logs[0];
                if (!(event instanceof EventLog)) {
                    console.error("Failed to create product", resp);
                    setCreating(false);
                    return;
                }
                console.log(event.args[0]);
                const listingId = event.args[0].toString();
                const imageBase64 = await fileUploadToBase64(imageInfo);
                const curTime = Date.now();
                const signature = await signer?.signMessage(JSON.stringify({ title, description, imageUrl: imageBase64, listingId }, ["listingId", "title", "description", "imageUrl"]) + " " + curTime)
                const reqData = {
                    address: account,
                    title: title,
                    description: description,
                    imageUrl: imageBase64,
                    timestamp: curTime,
                    signature: signature
                }
                try {
                    const res = await fetch("https://decentral-goods-backend.vercel.app/listings/" + listingId, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(reqData)
                    });
                    if (!res.ok) {
                        console.error("Failed to create product", res);
                        return;
                    }
                    window.location.href = "/product/" + listingId;
                } catch (err) {
                    console.error("Failed to create product", err);
                }
            } catch (err) {
                console.error("Error in creating product", err);
            }
        })().then(()=>{
            setFileError(null);
            setCreating(false);
        });
    }

    async function fileChanged(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file == null) {
            setFileBase64(null);
            return;
        }
        setFileError(null);
        const base64 = await fileUploadToBase64(file);
        setFileBase64(base64);
        console.log(base64);
    }

    return (
        <main>
            <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <form className="lg:w-4/5 mx-auto flex flex-wrap" action={makeProduct}>
                        <div className="flex lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded relative">
                            <label htmlFor="imageFile" className="flex flex-col items-center justify-center w-full lg:h-auto h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                {fileBase64 ? <div className="relative w-full h-full">
                                    <Image alt="" fill={true} src={fileBase64} style={{ objectFit: "contain" }} />
                                </div> :
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 1 MB)</p>
                                        {fileError && <p className="text-sm text-red-500 dark:text-red-400">{fileError}</p>}
                                    </div>}
                                <input id="imageFile" name="imageFile" type="file" className="hidden" accept="image/*" onChange={fileChanged} />
                            </label>
                        </div>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <div className="relative mb-4">
                                <label htmlFor="title" className="leading-7 text-sm text-gray-400">Name</label>
                                <input type="text" id="title" name="title" className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required />
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="description" className="leading-7 text-sm text-gray-400">Description</label>
                                <textarea id="description" name="description" className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required></textarea>
                            </div>
                            <div className="flex">
                                <div className="p-2 w-1/2">
                                    <div className="relative">
                                        <label htmlFor="price" className="leading-7 text-sm text-gray-400">Price</label>
                                        <input type="number" id="price" name="price" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" min='0' required />
                                    </div>
                                </div>
                                <div className="p-2 w-1/2">
                                    <div className="relative">
                                        <label htmlFor="quantity" className="leading-7 text-sm text-gray-400">Quantity</label>
                                        <input type="number" id="quantity" name="quantity" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" min='0' step='1' required />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <button disabled={creating || !connected} className="flex ml-auto disabled:cursor-not-allowed disabled:bg-blue-300 bg-blue-600 text-white border-0 py-2 px-6 focus:outline-none hover:bg-blue-800 rounded">{creating ? "Creating..." : "Create Listing"}</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}