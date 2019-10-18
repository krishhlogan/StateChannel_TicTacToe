const http=require('http').createServer()
const contractSource=require("./contract")
const io=require('socket.io')(http)
// io.set('transports', ['websocket']);
const Web3= require('web3');
const port=8000
let game={
player1Address:"",
player2Address:"",
player1BalanceToken:0,
player2BalanceToken:0,
gameAddress:"",
totalRounds:0,
currentRound:-1,
player1TotalWins:-1,
player2TotalWins:-1,
drawRounds:-1,
}
let gameBoard;

// function createConnection(){
// }

// function initializeGameBoard(){
    
// }
io.on('connection', function(socket) {
    console.log('A user connected');
    let createConnection=function(){
        return new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

    let initializeGameBoard=function(){
        gameBoard=Array.from(" ".repeat(9));
    }
 
    socket.on('disconnect', function (data) {
       console.log('A user disconnected',data);
    });

    socket.on('startNewGame', function (data) {
        console.log('Start-a-new-Game event',data.account);
        let web3=createConnection();
        web3.eth.defaultAccount =data.account;
        var Contract = web3.eth.contract(contractSource.abi)
        var block = web3.eth.getBlock("latest");
        tokens=parseInt(data.tokens) * 10;
        contractInstance = Contract.new({
            value: web3.toWei(String(tokens),"finney"),
            data: contractSource.byteCode.object,
            gas: block.gasLimit
        }, (err, result) => {
            // This callback will be called twice, the second time includes the contract address
            // console.log(result)
            console.log(err)
            if(!result.address) {
                console.log('wait until the block is mined with the contract creation transaction')
            } else {
                console.log("here's the contract address just deployed", result.address)
                game.gameAddress=result.address;
                game.player1Address=data.account;
                game.totalRounds=data.rounds;
                game.player1BalanceToken=parseInt(data.tokens);
                socket.emit("gameCreated",game);
            }
        });
     },function(err){
        console.log("error occured try again",err);
        socket.emit("error",{"error":"error creating new game"});
    });

     socket.on('joinGame', function (data) {
        console.log('Join a game event',data);
        let web3=createConnection();
        web3.eth.defaultAccount = data.account;
        var Contract = web3.eth.contract(contractSource.abi)
        contractInstance = Contract.at(data.gameAddress);
        let tokens=parseInt(data.tokens) * 10;
        console.log("\n Trying to connect to join game at ",data.gameAddress);
        contractInstance.setupPlayer2({
                    value: web3.toWei(String(tokens),"finney"),
                    gas: 4e6
                }, (err, result) => {
                    interval = setInterval(() => {
                        web3.eth.getTransaction(result, (err, result) => {
                            if(result.blockNumber != null) {
                                console.log('Game ready');
                                game.player2Address=data.account;
                                game.player2BalanceToken=parseInt(data.tokens);
                                socket.emit("gameRoomFull",game);
                                clearInterval(interval)
                            }
                        })
                    }, 1e3)
                })
     },function(err){
        console.log("error occured try again",err);
        socket.emit("error",{"error":"error joining new game"});
    });

     socket.on('createPlayerAccount', function () {
        console.log('Create a player account event');
        let conn=createConnection();
        let account=conn.personal.newAccount();
        console.log(account)
        socket.emit("accountCreated",{"account":account});
     },function(err){
        console.log("error occured try again",err);
        socket.emit("error",{"error":"error creating new account"});
    });

     socket.on('loadFromPrivateKey', function (data) {
        let conn=createConnection();
        console.log(data)
        let account=conn.personal.importRawKey(data.privateKey,data.passphrase);
        console.log("\n Loaded player Account from private Key ",account);
        socket.emit("accountLoaded",{"account":account});
     },function(err){
        console.log("error occured try again",err);
        socket.emit("error",{"error":"error loading account"});
    });
 });

http.listen(port, () => {
    console.log('Server started on port ',port);
});