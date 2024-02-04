import isValidAddress from "@/utils/isValidAddress";
import { config } from "dotenv";
config();

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || !isValidAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)) {
    console.log("Contract Address not Configured correctly.");
    process.exit(1);
}

export const contractAddress: string = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export const contractChainId = "0xaa36a7"

import ABI from "./abi.json";
if (!ABI) {
    console.log("Contract ABI not Configured correctly.");
    process.exit(1);
}

export const contractAbi = ABI;