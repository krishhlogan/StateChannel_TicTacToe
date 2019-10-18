const byteCode={
	"linkReferences": {},
	"object": "60806040526000341161007a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f56616c75652063616e6e6f74206265206c657373207468616e207a65726f000081525060200191505060405180910390fd5b6000662386f26fc10000348161008c57fe5b06146100e3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f81526020018061048e602f913960400191505060405180910390fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600a348161012d57fe5b0460028190555061034b806101436000396000f3fe60806040526004361061004a5760003560e01c80632c0054911461004f578063396a963c1461007a57806359a5f12d146100a557806367bf5954146100fc578063d30895e414610106575b600080fd5b34801561005b57600080fd5b5061006461015d565b6040518082815260200191505060405180910390f35b34801561008657600080fd5b5061008f610163565b6040518082815260200191505060405180910390f35b3480156100b157600080fd5b506100ba610169565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61010461018f565b005b34801561011257600080fd5b5061011b6102c2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60035481565b60025481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003411610205576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f56616c75652063616e6e6f74206265206c657373207468616e207a65726f000081525060200191505060405180910390fd5b6000662386f26fc10000348161021757fe5b061461026e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001806102e8602f913960400191505060405180910390fd5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600a34816102b957fe5b04600381905550565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fe506c65617365207472616e7366657220616d6f756e74206173206d756c7469706c65206f662031302066696e6e6579a265627a7a723158200bf50db2e3145c62a77a341b8398404354f4d13ab99a52af3e7cf1260faf9d0f64736f6c634300050b0032506c65617365207472616e7366657220616d6f756e74206173206d756c7469706c65206f662031302066696e6e6579",
	"opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x0 CALLVALUE GT PUSH2 0x7A JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1E DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x56616C75652063616E6E6F74206265206C657373207468616E207A65726F0000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH7 0x2386F26FC10000 CALLVALUE DUP2 PUSH2 0x8C JUMPI INVALID JUMPDEST MOD EQ PUSH2 0xE3 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x2F DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x48E PUSH1 0x2F SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH1 0x0 DUP1 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP PUSH1 0xA CALLVALUE DUP2 PUSH2 0x12D JUMPI INVALID JUMPDEST DIV PUSH1 0x2 DUP2 SWAP1 SSTORE POP PUSH2 0x34B DUP1 PUSH2 0x143 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x4A JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x2C005491 EQ PUSH2 0x4F JUMPI DUP1 PUSH4 0x396A963C EQ PUSH2 0x7A JUMPI DUP1 PUSH4 0x59A5F12D EQ PUSH2 0xA5 JUMPI DUP1 PUSH4 0x67BF5954 EQ PUSH2 0xFC JUMPI DUP1 PUSH4 0xD30895E4 EQ PUSH2 0x106 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x5B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x64 PUSH2 0x15D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x86 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x8F PUSH2 0x163 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xB1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xBA PUSH2 0x169 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x104 PUSH2 0x18F JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x112 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x11B PUSH2 0x2C2 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x3 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x2 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP JUMPDEST PUSH1 0x0 CALLVALUE GT PUSH2 0x205 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x1E DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x56616C75652063616E6E6F74206265206C657373207468616E207A65726F0000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH7 0x2386F26FC10000 CALLVALUE DUP2 PUSH2 0x217 JUMPI INVALID JUMPDEST MOD EQ PUSH2 0x26E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x2F DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH2 0x2E8 PUSH1 0x2F SWAP2 CODECOPY PUSH1 0x40 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH1 0x1 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP PUSH1 0xA CALLVALUE DUP2 PUSH2 0x2B9 JUMPI INVALID JUMPDEST DIV PUSH1 0x3 DUP2 SWAP1 SSTORE POP JUMP JUMPDEST PUSH1 0x0 DUP1 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP INVALID POP PUSH13 0x65617365207472616E73666572 KECCAK256 PUSH2 0x6D6F PUSH22 0x6E74206173206D756C7469706C65206F662031302066 PUSH10 0x6E6E6579A265627A7A72 BALANCE PC KECCAK256 SIGNEXTEND CREATE2 0xd 0xb2 0xe3 EQ 0x5c PUSH3 0xA77A34 SHL DUP4 SWAP9 BLOCKHASH NUMBER SLOAD DELEGATECALL 0xd1 GASPRICE 0xb9 SWAP11 MSTORE 0xaf RETURNDATACOPY PUSH29 0xF1260FAF9D0F64736F6C634300050B0032506C65617365207472616E73 PUSH7 0x657220616D6F75 PUSH15 0x74206173206D756C7469706C65206F PUSH7 0x2031302066696E PUSH15 0x657900000000000000000000000000 ",
	"sourceMap": "34:694:0:-;;;237:1;225:9;:13;217:55;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;315:1;302:9;290;:21;;;;;;:26;282:85;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;387:10;377:7;;:20;;;;;;;;;;;;;;;;;;435:2;423:9;:14;;;;;;407:13;:30;;;;34:694;;;;;;"
}

const abi=[
	{
		"constant": false,
		"inputs": [],
		"name": "setupPlayer2",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "player1",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "player1Tokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "player2",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "player2Tokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

module.exports.byteCode= byteCode;
module.exports.abi=abi;
