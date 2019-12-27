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

io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('disconnect', function () {
        console.log('A user disconnected');    
        })
    
    
    
});    

http.listen(port, () => {
    console.log('Server started on port ',port);
});