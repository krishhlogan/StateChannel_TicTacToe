
const Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('ropsten.infura.io/v3/8979bc45e8b346dd9eeb5d22644ab90d'));
web3.eth.defaultAccount = '0xCb0F294b4DEaE52D22fA7c11f581318FA79341D2';
var contractAddress="0xcbbfbafedb0eb83016d2a96a4e80d30b20fa3e30"
var abi=[{"constant": false,"inputs": [{"name": "hash","type": "bytes32"}],"name": "apply","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "email","type": "string"}],"name": "getApplicationID","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}]
var Contract = new web3.eth.contract(abi,contractAddress);
