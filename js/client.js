
var socket = require('socket.io-client')('http://localhost:8000', {reconnect: true,transports: ['websocket']});
let gameStarted=false;
let client="";
let game={};

function isYourTurn(data){
    console.log(client,data);
    if(client==data){
        return true;
    }
    else{
        return false;
    }
}

function getInput(message){
    var input="";
    const readlineSync = require('readline-sync');
    input = readlineSync.question(message);
    return input.toLowerCase();    
}

function newGameDetails(){
    let tokens=getInput("\n Number of tokens you would want to use for the game\n");
    let rounds=getInput("\nNumber of Rounds\n");
    let roundsBet={}
    count=0
    while(true){
    for(var i=1;i<=parseInt(rounds);i++){    
        let bet=getInput("\nEnter Bet amount for Round "+i+"\t")
        roundsBet["round"+i]=parseInt(bet);
        count+=parseInt(bet)
    }
    if(count<=parseInt(tokens)){
        break;
    }
    else{
        count=0;
        console.log("\nYou dont have sufficient balance\n");
    }
}
return {"account":client,"rounds":rounds,"tokens":tokens,"roundsBet":roundsBet,"total":count};
}


function joinGameDetails(){
    let gameAddress=getInput("\n Enter Game Address you want to join\n");
    let tokens="";
    tokens=getInput("\n Enter the amount of tokens\n");
    return {"gameAddress":gameAddress,"account":client,"tokens":tokens}
}

function loadPlayerDetails(){
    if(!client){
        let privateKey=getInput("\nEnter your privatekey\n");
        // let passphrase=getInput("\nEnter your password\n");
        let passphrase="password";
        if(passphrase && privateKey){
        // socket.emit("loadFromPrivateKey",{"privateKey":privateKey,"passphrase":passphrase});
        return {"privateKey":privateKey,"passphrase":passphrase};
        }
        
        }
        else{
            return null
        }
}

function printGameDetails(game){
    console.clear()
    console.log("\nPlayer 1 : ",game.player1Address);
    console.log("\nPlayer 2 : ",game.player2Address);
    console.log("\nTotal Number Of Rounds : ",game.totalRounds);
    console.log("\nCurrent Round : ",game.currentRound);
    console.log("\nGame Address ",game.gameAddress);
    console.log("\nDraw Rounds: ",game.drawRounds);
    console.log("\nPlayer 1 Total Wins: ",game.player1TotalWins);
    console.log("\nPlayer 2 Total Wins: ",game.player2TotalWins);
    if(client==game.player1Address){
        console.log("\n Your token balance: ",game.player1BalanceToken);
        console.log("==========You are Player 1=======");
    }
    else if(client==game.player2Address){
        console.log("\n Your token balance: ",game.player2BalanceToken);
        console.log("==========You are Player 2=======");
    }
}

function printBoard(board) {
    console.log('\n' +
        ' ' + board[1] + ' | ' + board[2] + ' | ' + board[3] + '\n' +
        ' ---------\n' +
        ' ' + board[4] + ' | ' + board[5] + ' | ' + board[6] + '\n' +
        ' ---------\n' +
        ' ' + board[7] + ' | ' + board[8] + ' | ' + board[9] + '\n');
}

function askChoice(){
    console.log("ask choice is called\n")
    var choice=getInput("1)Start New Game\n2)Join New Game\n3)Create Player\n4)Load Player\n5)Change Account\n");
    console.log("choice is ",choice);
    switch(choice){
        case "1": 
                console.log("\nStart new game choice");
                data=newGameDetails();
                socket.emit("createGame",data);
                break;
        case "2":
                console.log("\nJoin New Game");
                data=joinGameDetails();
                socket.emit("joinGame",data);
                break;
        case "3":
                console.log("\n Create New player");
                if(!client){
                    socket.emit("createPlayer");
                }
                else{
                    console.log("\nYou already have an account\nPlease select some other choice");
                    askChoice();
                }
                break;
        case "4":
                console.log("\n Load Player");
                data=loadPlayerDetails();
                if(data){
                socket.emit("loadPlayer",data);
                }
                else{
                console.log("\nYou already have an account\nPlease select some other choice");
                }
                break;
        case "5":
                console.clear();
                console.log("\nPlayer Account is reset\n");
                client="";
                askChoice();
                console.log("\nChange Account");
        default:
                console.clear();
                console.log("\nkindly enter valid keys\n");
                askChoice();
    }

}
socket.on('connect', function (socket) {
    console.log('Connected!');
    if(!gameStarted){
    askChoice();
    }
});

socket.on('disconnect', function() {
    socket.emit('disconnect');
});

socket.on('accountCreated',function(data){
    console.clear();
    console.log("Your new Account is ",data.account);
      let choice=getInput("\nDo you want to use this as your account?\t Yes or No\t")
      if(choice.toLocaleLowerCase()=="yes"){
          console.log("\nThe account "+data.account+" will be used as your account \n");
          client=data.account;
      }
      askChoice();
})

socket.on('accountLoaded',function(data){
    console.clear();
    console.log("Your loaded Account is ",data.account);
    let choice=getInput("\nDo you want to use this as your account?\t Yes or No\t")
    if(choice.toLocaleLowerCase()=="yes"){
        console.log("\nThe account "+data.account+" will be used as your account \n");
        client=data.account;
    }
    askChoice();
})

socket.on('gameCreated',function(data){
    game=data;
    console.log("A new game is created ",game);
    console.log("\n Waiting for other player to join the game......")
})

socket.on('insufficientBalance',function(data){
    console.clear();
    console.log("\n",data.message);
    console.log("\nGame Address: ",data.gameAddress);
    console.log("\n Required Tokens ",data.tokens);
    console.log("\n Kindly join the game again with sufficient tokens \n");
    askChoice();
})

socket.on('gameRoomFull',function(data){
    // console.clear()
    console.log("Game room is full\n",data);
    let readiness="";
    while(true){
    readiness=getInput("\n Are you ready to start the game?\t Yes or no\n");
    if(readiness.toLowerCase()=="yes"){
        socket.emit("playerReady",{"player":client});
        break
    }
    else if (readiness.toLowerCase()=="no"){
        console.log("\nWaiting for player to join ",client)
        socket.emit("sendMsg",{"message":"player two not joined yet","client":client})
    }
    else{
        console.log("\nPlease enter a valid choice \n");
    }
}
})

socket.on("gameReady",function(data){
    console.clear();
    console.log("===============Game is Rady================\n");
    printGameDetails(data.game);
    printBoard(data.gameboard);
    game=data.game;
    console.log("Mark your position using any of the below position numbers\n")
    console.log('\n' +
        ' ' + 1 + ' | ' + 2 + ' | ' + 3 + '\n' +
        ' ---------\n' +
        ' ' + 4 + ' | ' + 5 + ' | ' + 6 + '\n' +
        ' ---------\n' +
        ' ' + 7 + ' | ' + 8 + ' | ' + 9 + '\n');
    socket.emit("gameInitialised");
})

socket.on('makeAMove',function(data){
    console.clear();
    console.log("Got event ",client);
    var move="";
    game=data.game;
    console.log(isYourTurn(data.turn),data.turn);
    if(isYourTurn(data.turn)){
        console.log("your turn ");
    printBoard(data.board);
        while(true){
        console.log("stuck in while ",move,data.board)
        move=getInput("\nEnter the position you want to mark\n")
        if(parseInt(move) in [1,2,3,4,5,6,7,8,9,10]){
            if(data.board[move]==" "){
                break;
            }
            else{
                console.log("\n That position is already taken\nChoose a new One\n");
            }
        }
        else{
            console.log("\nPlease enter a valid position to mark \n")
        }
        }
        if(move!=" "){
            if(game.player1Address==client){
                data.board[move]="X";
            }
            else{
                data.board[move]="O";
            }
            console.clear();
            printBoard(data.board);
            console.log("\n Not your turn");
            socket.emit("moveMade",{"move":move,"client":client});
        }
    }
    else{
        console.clear();
        printBoard(data.board);
        
        console.log("Not your turn ");
    }
})
