export const dwelpContractConfig = {
    address: '0x7ca3d511A851a375f8f5e828B5094AcCcC5E587C',
    chainId: 80002,
    abi: [
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor"
        },
        {
            inputs: [],
            name: "admin",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address"
                }
            ],
            stateMutability: "view",
            type: "function"
        }
    ],
} as const