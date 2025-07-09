export const dwelpContractConfig = {
    address: '0x7ca3d511A851a375f8f5e828B5094AcCcC5E587C',
    chainId: 80002,
    abi: [{ "type": "constructor", "inputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "addFile", "inputs": [{ "name": "_hash", "type": "bytes32", "internalType": "bytes32" }, { "name": "signature", "type": "string", "internalType": "string" }, { "name": "ipfs", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "admin", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }],
} as const