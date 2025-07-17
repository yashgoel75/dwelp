export const dwelpContractConfig = {
	address: '0xc48BBE43b1FBDFeEeEc7F6E32740DB9DadCa29e9',
	chainId: 80002,
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