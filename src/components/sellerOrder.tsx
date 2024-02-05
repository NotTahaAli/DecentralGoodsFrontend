import { contractContext } from "@/providers/contract";
import { metamaskContext } from "@/providers/metamask";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export type orderDetail = { buyerAddress: string, listingId: string, orderId: string, buyerInfo: string };

export function SellerOrder(props: orderDetail) {
    const { buyerAddress, listingId, orderId, buyerInfo } = props;
    const [decoding, setDecoding] = useState(false);
    const [refunding, setRefunding] = useState(false);
    const [edit, setEdit] = useState(0);

    const [orderStatus, setOrderStatus] = useState(-1);
    const [quantity, setQuantity] = useState("0");
    const { contract } = useContext(contractContext);
    const { provider, account } = useContext(metamaskContext);

    useEffect(() => {
        contract?.getOrderInfo(orderId).then(([status, _amount, _listingId, order_quantity]) => {
            setOrderStatus(Number(status));
            setQuantity(order_quantity.toString());

            console.log(status, order_quantity);
        });
    }, [contract, orderId, edit]);

    function decodeInfo() {
        setDecoding(true);
        provider?.request({
            method: "eth_decrypt",
            params: [buyerInfo, account]
        }).then((res) => {
            console.log(res);
            if (typeof (res) !== "string") {
                Swal.fire({
                    title: "Buyer Information",
                    text: "Failed to Decrypt",
                    icon: "error"
                });
                setDecoding(false);
                return;
            }
            if (res == "") {
                Swal.fire({
                    title: "Buyer Information",
                    text: "No Information Provided",
                    icon: "info"
                });
                setDecoding(false);
                return;
            }
            Swal.fire({
                title: "Buyer Information",
                text: res,
                icon: "info"
            });
            setDecoding(false);
        }).catch((err) => {
            console.error("Failed to Decrypt", err);
            setDecoding(false);
        });
    }

    function refundOrder() {
        setRefunding(true);
        contract?.refund(orderId).then(async (tx) => {
            await tx.wait();
            setRefunding(false);
            setEdit(edit + 1);
        }).catch((err) => {
            console.error("Failed to Refund", err);
            Swal.fire({
                title: "Refund Failed",
                text: "Failed to Refund",
                icon: "error"
            })
            setRefunding(false);
        });
    }

    return (
        <div className="p-4 w-full">
            <div className="mt-4">
                <h2 className="text-white title-font text-lg font-medium">Order ID: {orderId}</h2>
                <h2 className="text-white title-font text-lg font-medium">Buyer: {buyerAddress}</h2>
                <h2 className="text-white title-font text-lg font-medium">Order Status: {orderStatus == -1 ? "Loading Status" : orderStatus == 0 ? "Pending Order" : orderStatus == 1 ? "Refunded" : "Completed"}</h2>
                <h2 className="text-white title-font text-lg font-medium">Quantity: {quantity}</h2>
                <Link href={"/product/"+listingId} className="text-white title-font text-lg font-medium underline">Product ID: {listingId}</Link>
                <div className="flex gap-3">
                    {orderStatus == 0 && <button disabled={decoding} className="disabled:cursor-not-allowed disabled:bg-blue-300 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-10" onClick={decodeInfo}>Decrypt Address</button>}
                    {orderStatus == 0 && <button disabled={refunding} className="disabled:cursor-not-allowed disabled:bg-red-300 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={refundOrder}>Refund</button>}
                </div>
            </div>
        </div>
    )
}