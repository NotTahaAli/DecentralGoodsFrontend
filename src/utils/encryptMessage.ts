import { encrypt } from "@metamask/eth-sig-util";

function hex(arrayBuffer: ArrayBuffer) {
    return Array.prototype.map.call(
        new Uint8Array(arrayBuffer),
        n => n.toString(16).padStart(2, "0")
    ).join("");
}

export function getEncryptedMessage(data: string, publicKey: string): string {
    const encrypted = encrypt({
        publicKey,
        data,
        version: 'x25519-xsalsa20-poly1305',
    })

    const encoder = new TextEncoder()
    const encryptedMessage = hex(
        encoder.encode(
            JSON.stringify(encrypted)
        )
    )

    return encryptedMessage;
}