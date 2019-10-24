var socket = require('socket.io-client')('http://localhost:8000',{ transports: ['websocket'] });
// var socket = io({transports: ['websocket']});
let client="";
let gameAddress=""
// let game={
//     player1Address:"",
//     player2Address:"",
//     player1BalanceToken:0,
//     player2BalanceToken:0,
//     gameAddress:"",
//     totalRounds:0,
//     currentRound:0,
//     player1TotalWins:0,
//     player2TotalWins:0,
//     drawRounds:0,
//     player1Ready:false,
//     player2Ready:false
//     }

function getInput(message){
    var input="";
    const readlineSync = require('readline-sync');
    input = readlineSync.question(message);
    return input.toLowerCase();    
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
    }
    else if(client==game.player2Address){
        console.log("\n Your token balance: ",game.player2BalanceToken);
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


  socket.on('disconnect', function() {
      socket.emit('disconnect')
  });
  function askChoice(){
    console.log("ask choice is called\n")
    var choice=getInput("1)Start New Game\n2)Join New Game\n3)Create Player\n4)Load Player\n5)Change Account\n");
    console.log("choice is ",choice);
    if(choice=="1"){
        console.log("your account is ",client);
        let tokens=getInput("\n Number of tokens you would want to buy\n");
        let rounds=getInput("\nNumber of Rounds\n");
        let roundsBet={}
        count=0
        for(var i=1;i<=parseInt(rounds);i++){
            
            let bet=getInput("\nEnter Bet amount for Round "+i+"\t")
            roundsBet["round"+i]=parseInt(bet);
            count+=parseInt(bet)
            
        }
        socket.emit('startNewGame',{"account":client,"rounds":rounds,"tokens":tokens,"roundsBet":roundsBet,"total":count});
    }
    else if(choice=="2"){
      let gameAddress=getInput("\n Enter Game Address you want to join\n");
      let tokens=getInput("\n Enter the amount of tokens\n");
      socket.emit('joinGame',{"gameAddress":gameAddress,"account":client,"tokens":tokens});
    }
    else if(choice=="3"){
        if(!client){
        socket.emit('createPlayerAccount');
        }
        else{
            console.log("\nYou already have an account\nPlease select some other choice");
            askChoice();
        }
    }
    else if(choice=="4"){
        if(!client){
        let privateKey=getInput("\nEnter your privatekey\n");
        let passphrase=getInput("\nEnter your password\n");
        if(passphrase && privateKey){
        socket.emit("loadFromPrivateKey",{"privateKey":privateKey,"passphrase":passphrase});
        }
        
        }
        else{
            console.log("\nYou already have an account\nPlease select some other choice");
            askChoice();
        }
    }
    else if(choice=="5"){
        console.log("\nPlayer Account is reset\n");
        client="";
        askChoice();
    }
        else{
            console.log("\nkindly enter valid keys\n");
            askChoice();
        }
    }
  
  socket.on('connect', () => {
      askChoice();
  })
  
  socket.on('accountCreated',function(data){
      console.log("Your new Account is ",data.account);
      let choice=getInput("\nDo you want to use this as your account?\t Yes or No\t")
      if(choice.toLocaleLowerCase()=="yes"){
          console.log("\nThe account "+data.account+" will be used as your account \n");
          client=data.account;
      }
      askChoice();
  })

  socket.on('accountLoaded',function(data){
    console.log("Your loaded Account is ",data.account);
    let choice=getInput("\nDo you want to use this as your account?\t Yes or No\t")
    if(choice.toLocaleLowerCase()=="yes"){
        console.log("\nThe account "+data.account+" will be used as your account \n");
        client=data.account;
    }
    askChoice();
})

socket.on('gameCreated',function(data){
    console.log("A new game is created ",data);
})

socket.on('gameRoomFull',function(data){
    console.clear()
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
        console.log("\nPlease enter a valid choice \n")
    }
}
})
socket.on("message",function(data){
    console.log("\n\nMessage Received from ",data.client);
    console.log("\n",data.message);
})
socket.on("gameReady",function(data){
    console.clear();
    console.log("===============Game is Rady================\n");
    printGameDetails(data.game);
    printBoard(data.gameboard);
    
})
socket.on('error',function(data){
    console.log("Error occured ",data);
    askChoice();
})

socket.on('insufficientBalance',function(data){
    console.log("\n",data.message);
})
  