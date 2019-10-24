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

function isPlayer1(data){
    if(data==game.player1Address){
    return true;
    }
    else{
        return false;
    }
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
                    socket.join("Game_"+data.account);
                    // socket.emit("gameCreated",game);
                    // console.log(io.sockets.sockets);
                    // console.log(io.sockets.adapter.rooms) //Returns {room_1_id: {}, room_2_id: {}}
                    // console.log(io.sockets.server.eio.clients) //Return client sockets
                    socket.emit("gameCreated",game);
            // }
                
            }
        });
     },function(err){
        console.log("error occured try again",err);
        socket.emit("error",{"error":"error creating new game"});
    });

     socket.on('joinGame', function (data) {
        // socket.emit("gameCreated",game);
        let web3=createConnection();
        web3.eth.defaultAccount = data.account;
        var Contract = web3.eth.contract(contractSource.abi)
        contractInstance = Contract.at(data.gameAddress);
        let tokens=parseInt(data.tokens) * 10;
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
                                    socket.join("Game_"+game.player1Address);
                                    game.playerTurn=game.player1Address;
                                    io.sockets.in("Game_"+game.player1Address).emit('gameRoomFull',game);
                                    // console.log(io.sockets.adapter.rooms) //Returns {room_1_id: {}, room_2_id: {}}
                                    // console.log(io.sockets.server.eio.clients)
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
            console.log("Both players are ready");
            game.playerTurn=game.player1Address;
            io.sockets.in("Game_"+game.player1Address).emit('gameReady',{"game":game,"gameboard":gameBoard,"turn":game.playerTurn});
        }
    })

    socket.on('sendMsg',function(data){
        io.sockets.in("Game_"+game.player1Address).emit('message',data);
    })

    socket.on('gameInitialised',function(){
        io.sockets.in("Game_"+game.player1Address).emit('message',{"game":game,"board":gameBoard,"message":"\n\nFirst time\n\n","turn":game.playerTurn});
    })

    socket.on('moveMade',function(data){
        console.log("\n Sending a message from server on making a move \n")
        console.log("\nMove Made by\n",game.playerTurn,"\n\n",data);
        console.log(isPlayer1(data.client))
        if(gameBoard[data.move]==" "){
            if(isPlayer1(data.client)){
                gameBoard[data.move]="X";
                console.log("was Player 1 ");
                game.playerTurn=game.player2Address;
                io.in("Game_"+game.player1Address).emit('message',{"game":game,"board":gameBoard,"message":"\n\nData changed in game \n\n","turn":game.playerTurn});
            }
            else{
                gameBoard[data.move]="O"
                console.log("was Player 2 ");
                game.playerTurn=game.player1Address;
                io.in("Game_"+game.player1Address).emit('message',{"game":game,"board":gameBoard,"message":"\n\nData changed in game \n\n","turn":game.playerTurn});
            }
            console.log("=====================Game data inside if================ \n",game)
            // socket.emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nData changed in game \n\n","turn":game.playerTurn});
            
        }
        else{
            console.log("\Inside Else Invalid move");
            // socket.emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nNot changed\n\n","turn":game.playerTurn});
            io.sockets.in("Game_"+game.player1Address).emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nNot changed\n\n","turn":game.playerTurn});
        }
        
       
        

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