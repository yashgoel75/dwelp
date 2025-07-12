export const dwelpContractConfig = {
    address: '0x7ca3d511a851a375f8f5e828b5094acccc5e587c',
    chainId: 11155111,
    abi: [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "signature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfs",
				"type": "string"
			}
		],
		"name": "addFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getFile",
		"outputs": [
			{
				"internalType": "string",
				"name": "signature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfs",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFiles",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "signature",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ipfs",
						"type": "string"
					}
				],
				"internalType": "struct Dwelp.metaData[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
],
} as const