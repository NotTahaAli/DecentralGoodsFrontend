import { contractContext } from "@/providers/contract";
import { metamaskContext } from "@/providers/metamask";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export function BuyerOrder(props: { listingId: string, orderId: string }) {
    const { listingId, orderId } = props;
    const [recieving, setRecieving] = useState(false);
    const [edit, setEdit] = useState(0);

    const [orderStatus, setOrderStatus] = useState(-1);
    const [quantity, setQuantity] = useState("0");
    const { contract } = useContext(contractContext);

    useEffect(() => {
        contract?.getOrderInfo(orderId).then(([status, _amount, _listingId, order_quantity]) => {
            setOrderStatus(Number(status));
            setQuantity(order_quantity.toString());

            console.log(status, order_quantity);
        });
    }, [contract, orderId, edit]);

    function receiveOrder() {
        setRecieving(true);
        contract?.itemRecieved(orderId).then(async (tx) => {
            await tx.wait();
            setRecieving(false);
            setEdit(edit + 1);
        }).catch((err) => {
            console.error("Failed to Mark as Recieved", err);
            Swal.fire({
                title: "Marking as Recieved Failed",
                text: "Failed to Mark as Recieved",
                icon: "error"
            })
            setRecieving(false);
        });
    }

    return (
        <div className="p-4 w-full">
            <div className="mt-4">
                <h2 className="text-white title-font text-lg font-medium">Order ID: {orderId}</h2>
                <h2 className="text-white title-font text-lg font-medium">Order Status: {orderStatus == -1 ? "Loading Status" : orderStatus == 0 ? "Pending Order" : orderStatus == 1 ? "Refunded" : "Completed"}</h2>
                <h2 className="text-white title-font text-lg font-medium">Quantity: {quantity}</h2>
                <Link href={"/product/" + listingId} className="text-white title-font text-lg font-medium underline">Product ID: {listingId}</Link>
                <div className="flex gap-3">
                    {orderStatus == 0 && <button disabled={recieving} className="disabled:cursor-not-allowed disabled:bg-red-300 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={receiveOrder}>Mark As Recieved</button>}
                </div>
            </div>
        </div>
    )
}