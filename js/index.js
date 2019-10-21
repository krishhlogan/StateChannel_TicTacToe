const contractSource=require("./contract")
const Web3 = require('web3');

function getInput(message){
    var input="";
    const readlineSync = require('readline-sync');
    input = readlineSync.question(message);
    return input.toLowerCase();    
}
function getHiddenInput(message){
    var hiddenInput="";
    const readlineSync = require('readline-sync');
    hiddenInput=readlineSync.question(message, {
        hideEchoBack: true // The typed text on screen is hidden by `*` (default).
      });
    return hiddenInput;
}
function startGame(){
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
web3.eth.defaultAccount = web3.eth.accounts[0];
var Contract = web3.eth.contract(contractSource.abi)
var block = web3.eth.getBlock("latest");
contractInstance = Contract.new({
    value: web3.toWei("300","finney"),
    data: contractSource.byteCode.object,
    gas: block.gasLimit
}, (err, result) => {
    // This callback will be called twice, the second time includes the contract address
    // console.log(result)
    if(!result.address) {
        console.log('wait until the block is mined with the contract creation transaction')
    } else {
        console.log("here's the contract address just deployed", result.address)
    }
})
return contractInstance
}

function printChoice(){
console.log("Enter Your choice\n");
}

function joinGame(gameAddress){
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaultAccount = web3.eth.accounts[1];
    var Contract = web3.eth.contract(contractSource.abi)
    contractInstance = Contract.at(gameAddress);
    console.log("\n Trying to connect to join game at ",gameAddress);
    contractInstance.setupPlayer2({
                value: web3.toWei("300","finney"),
                gas: 4e6
            }, (err, result) => {
                interval = setInterval(() => {
                    web3.eth.getTransaction(result, (err, result) => {
                        if(result.blockNumber != null) {
                            console.log('Game ready');
                            clearInterval(interval)
                        }
                    })
                }, 1e3)
            })

}

printChoice();

var choice=getInput("1)Start New Game\n2)Join New Game\n");
console.log(choice)
if(choice=="1"){
console.log("You have decided to start a new Game");
contractInstance=startGame()
console.log(contractInstance.address)
}
else if(choice=="2"){
    var gameAddress=getInput("\n Enter the address of game you wish to join\n");
    gameInstance=joinGame(gameAddress);
}
