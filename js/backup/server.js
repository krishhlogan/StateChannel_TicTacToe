const http=require('http').createServer()
const contractSource=require("./contract")
const io=require('socket.io')(http)
io.set('transports', ['websocket']);
const Web3= require('web3');
const port=8000
const WON="won"
const DRAW="draw"
const CONTINUE="continue"
const winCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
[2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

let marks={};
let game={
    player1Address:"",
    player2Address:"",
    player1BalanceToken:0,
    player2BalanceToken:0,
    gameAddress:"",
    totalRounds:0,
    completedRounds:0,
    player1TotalWins:0,
    player2TotalWins:0,
    drawRounds:0,
    player1Ready:false,
    player2Ready:false,
    move:0,
    roundsBet:{},
    totalBet:0,
    playerTurn:"",
    roundOver:false,
    gameOver:false,
    player1SocketAddress:'',
    player2SocketAddress:'',
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

    function checkWin(player) {
        var i, j, markCount;
        for (i = 0; i < winCombinations.length; i++) {
            markCount = 0;
            for (j = 0; j < winCombinations[i].length; j++) {
                if (gameBoard[winCombinations[i][j]] === marks[player]) {
                    markCount++;
                }
                if (markCount === 3) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkTie() {
        for (var i = 1; i <= Object.keys(gameBoard).length; i++) {
            if (gameBoard[i] === ' ') {
                return false;
            }
        }
        return true;
    }

function getWinner(){
    if(game.completedRounds==game.totalRounds){
        if(game.player1TotalWins > game.player2TotalWins){
            return game.player1Address;
            // io.sockets.in('Game_'+game.player1Address).emit("gameOver",{"message":"player 1 has won"});      
        }
        else if(game.player1TotalWins < game.player2TotalWins){
            // io.sockets.in('Game_'+game.player1Address).emit("gameOver",{"message":"player 2 has won"});
            return game.player2Address;
        }
        else{
            // io.sockets.in('Game_'+game.player1Address).emit("gameOver",{"message":"The game has tied"});
            return null;
        }
    }
    else{
        return " ";
    }
}
    
function gameEnded(){
    if(game.completedRounds==game.totalRounds){
        return true;
    }
    else{
        return false;
    }

}

function validateBoard(data){
        if(checkTie()){
            game.drawRounds+=1;
            game.completedRounds+=1;
            return {"result":DRAW,"winner":" "};
        }
        else if(checkWin(data.client)){
            if(isPlayer1(data.client)){
                game.player1TotalWins+=1;
                game.completedRounds+=1;
                return {"result":WON,"winner":game.player1Address};
            }
            else{
                game.player2TotalWins+=1;
                game.completedRounds+=1;
                return {"result":WON,"winner":game.player2Address};
            }
                       
        }
        else{
            return {"result":CONTINUE};
        }
}




io.on('connection', function(socket) {
    console.log('A user connected');
    
 
    socket.on('disconnect', function () {
    console.log('A user disconnected');
    
    })

    socket.on("createPlayer",function(){
        console.log("createPlayer event\n");
        let conn=createConnection();
        let account=conn.personal.newAccount();
        socket.emit("accountCreated",{"account":account});
     })

    socket.on('loadPlayer',function(data){
        console.log("Load player event\n");
        let conn=createConnection();
        console.log(data)
        let account=conn.personal.importRawKey(data.privateKey,data.passphrase);
        console.log("\n Loaded player Account from private Key ",account);
        socket.emit("accountLoaded",{"account":account});
     })

    socket.on('createGame',function(data){
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
                game.player1SocketAddress=socket.id;
                marks[game.player1Address]="X";
                socket.join("Game_"+data.account);
                // socket.emit("gameCreated",game);
                // console.log(io.sockets.sockets);
                // console.log(io.sockets.adapter.rooms) //Returns {room_1_id: {}, room_2_id: {}}
                // console.log(io.sockets.server.eio.clients) //Return client sockets
                socket.emit("gameCreated",game);
            }
        });
     })


     socket.on('joinGame',function(data){
        let web3=createConnection();
        console.log(data)
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
                                
                                if(parseInt(data.tokens)<game.player1BalanceToken){
                                    console.log("\n Insufficient balance\n")
                                    socket.emit("insufficientBalance",{"message":"you do not have enough tokens","tokens":game.player1BalanceToken,"gameAddress":game.gameAddress});
                                }
                                else{
                                    game.player2Address=data.account;
                                    game.player2BalanceToken=parseInt(data.tokens);
                                    socket.join("Game_"+game.player1Address);
                                    game.playerTurn=game.player1Address;
                                    game.player2SocketAddress=socket.id;
                                    marks[game.player2Address]="O";
                                    io.sockets.in("Game_"+game.player1Address).emit('gameRoomFull',game);
                                    // console.log(io.sockets.adapter.rooms) //Returns {room_1_id: {}, room_2_id: {}}
                                    // console.log(io.sockets.server.eio.clients)
                                    clearInterval(interval)
                                }
                                
                            }
                        })
                    }, 1e3)
                })
         
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

    socket.on('gameInitialised',function(){
        console.log("\n Game is Initialised successfully");
        socket.broadcast.to("Game_"+game.player1Address).emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nFirst time\n\n","turn":game.playerTurn});
    })

    socket.on('moveMade',function(data){
        console.log("\n Sending a message from server on making a move \n")
        console.log("\nMove Made by\n",game.playerTurn,"\n\n",data);
        console.log(isPlayer1(data.client))
        // if(!checkWin(data.client)){
        
        if(gameBoard[data.move]==" "){
            if(isPlayer1(data.client)){
                gameBoard[data.move]="X";
                console.log("was Player 1 ");
                game.playerTurn=game.player2Address;
                socket.broadcast.to("Game_"+game.player1Address).emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nData changed in game \n\n","turn":game.playerTurn});
            }
            else{
                gameBoard[data.move]="O"
                console.log("was Player 2 ");
                game.playerTurn=game.player1Address;
                socket.broadcast.to("Game_"+game.player1Address).emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nData changed in game \n\n","turn":game.playerTurn});
            }
            console.log("=====================Game data inside if================ \n",game)
            // socket.emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nData changed in game \n\n","turn":game.playerTurn});
            
        }
        else{
            console.log("\Inside Else Invalid move");
            // socket.emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nNot changed\n\n","turn":game.playerTurn});
            socket.broadcast.to("Game_"+game.player1Address).emit('makeAMove',{"game":game,"board":gameBoard,"message":"\n\nNot changed\n\n","turn":game.playerTurn});
        }
     
        let result=validateBoard(data);
        switch(result.result){
            case WON:
                console.log("\n Game has a result ");
                console.log(getWinner());
                gameState=gameEnded();
                if(gameState){
                    winner=getWinner();
                
                }
                
                
                break;
            case DRAW:
                console.log("\nGame has ended in a draw");
                
                break;
            case CONTINUE:
                console.log("\n Game is not over continue");
            default:
                console.log("\n Never gonna happen ;) ");
        }
    
    })

    socket.on('nextRound',function(){
        initializeGameBoard();
        game.playerTurn=game.player1Address;
        game.roundOver=false;
        game.gameOver=false;
        game.player1Ready=false
        game.player2Ready=false
        io.sockets.in("Game_"+game.player1Address).emit('gameRoomFull',{"game":game,"gameboard":gameBoard,"turn":game.playerTurn});
    })
    
})


http.listen(port, () => {
    console.log('Server started on port ',port);
});