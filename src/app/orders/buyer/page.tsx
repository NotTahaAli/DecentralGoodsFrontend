'use client'

import { BuyerOrder } from "@/components/buyerOrder";
import { orderDetail } from "@/components/sellerOrder";
import { metamaskContext } from "@/providers/metamask";
import { useContext, useEffect, useState } from "react";

export default function BuyerOrdersPage() {

    const [orders, setOrders] = useState<orderDetail[]>([]);
    const {connected, account} = useContext(metamaskContext);

    useEffect(() => {
        if (!connected || !account) {
            setOrders([]);
            return;
        }
        fetch("https://decentral-goods-backend.vercel.app/orders/buyer/"+account).then(async (res) => {
            if (!res.ok) {
                setOrders([]);
                return;
            }
            const data = (await res.json()).message;
            setOrders(data);
        });
    }, [connected, account]);

    return (
        <main className="bg-gray-900 text-white">
            {orders.length == 0 && <h1 className="text-3xl py-5 body-font text-center">{ !connected ? "Connect your Wallet First" : "No Orders as of yet."}</h1>}
            {orders.map((order, index) => {
                return (<BuyerOrder key={index} {...order} />);
            })
            }
        </main>
    );
}