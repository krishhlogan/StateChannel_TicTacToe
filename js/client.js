
var socket = require('socket.io-client')('http://localhost:8000', {reconnect: true,transports: ['websocket']});
let gameStarted=false;
let client="";
let game={};

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

socket.on('connect', function () {
    console.log("connected ",socket.id)
    if(!gameStarted){
    askChoice();
    }
});

socket.on('disconnect', function() {
    socket.emit('disconnect');
});