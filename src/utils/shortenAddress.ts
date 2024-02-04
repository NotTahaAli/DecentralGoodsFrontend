export default function shortenAddress(address: string): string {
    return address.substring(0, 8) + "..." + address.substring(address.length - 4);
}