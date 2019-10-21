const http=require('http').createServer()
const contractSource=require("./contract")
const io=require('socket.io')(http)
io.set('transports', ['websocket']);
const Web3= require('web3');
const port=8000
let playerTurn="";


let game={
player1Address:"",
player2Address:"",
player1BalanceToken:0,
player2BalanceToken:0,
gameAddress:"",
totalRounds:0,
currentRound:0,
player1TotalWins:0,
player2TotalWins:0,
drawRounds:0,
player1Ready:false,
player2Ready:false,
move:0,
roundsBet:{},
totalBet:0,
playerTurn:""
}

let gameBoard;
let createConnection=function(){
    return new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

let initializeGameBoard=function(){
    gameBoard={
        1: ' ',
        2: ' ',
        3: ' ',
        4: ' ',
        5: ' ',
        6: ' ',
        7: ' ',
        8: ' ',
        9: ' '
    };
}

io.on('connection', function(socket) {
    console.log('A user connected');
    
 
    socket.on('disconnect', function () {
    console.log('A user disconnected');
    
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
                game.roundsBet=data.roundsBet;
                game.player1BalanceToken=parseInt(data.tokens);
                game.totalBet=parseInt(data.total);
                // if(game.player1BalanceToken<parseInt(data.total)){
                //     console.log("\n Insufficient balance\n");
                //     socket.emit("insufficientBalance",{"message":"you do not have enough tokens","balance":game.player1BalanceToken})
                // }
                // else{
                    console.log("If failed, u have sufficient balance",game.player1BalanceToken,data.total);
                    socket.join(data.account);
                    // socket.emit("gameCreated",game);
                    socket.emit("gameCreated",game);
            // }
                
            }
        });
     },function(err){
        console.log("error occured try again",err);
        socket.emit("error",{"error":"error creating new game"});
    });

     socket.on('joinGame', function (data) {
        console.log('Join a game event',data);
        // socket.emit("gameCreated",game);
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
                                // if(game.player2BalanceToken<parseInt(data.total)){
                                //     console.log("\n Insufficient balance\n")
                                //     socket.emit("insufficientBalance",{"message":"you do not have enough tokens","balance":game.player2BalanceToken})
                                // }
                                // else{
                                    console.log("If failed, u have sufficient balance",game.player2BalanceToken,data.total);
                                    socket.join(game.player1Address);
                                    io.sockets.in(game.player1Address).emit('gameRoomFull',game);
                                    clearInterval(interval)
                                // }
                                
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
    socket.on('totalBet',function(){
        console.log("totalbet is triggered");
        socket.emit("bets",game);
    })
    socket.on("playerReady",function(data){
        if(game.player1Address==data.player){
            game.player1Ready=true;
        }
        if(game.player2Address==data.player){
            game.player2Ready=true;
        }
        if(game.player2Ready && game.player1Ready){
            initializeGameBoard();
            game.playerTurn=game.player1Address;
            io.sockets.in(game.player1Address).emit('gameReady',{"game":game,"gameboard":gameBoard});
        }
    })

    socket.on('sendMsg',function(data){
        io.sockets.in(game.player1Address).emit('message',data);
    })

    socket.on('gameInitialised',function(){
        console.log("Game is successfully initalised...");
        io.sockets.in(game.player1Address).emit('makeAMove',game);
    })
    
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