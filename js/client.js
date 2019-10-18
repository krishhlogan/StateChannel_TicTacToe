var socket = require('socket.io-client')('http://localhost:8000',{ transports: ['websocket'] });
// var socket = io({transports: ['websocket']});
let client="";
let gameAddress=""
let username=process.argv[2];
function getInput(message){
    var input="";
    const readlineSync = require('readline-sync');
    input = readlineSync.question(message);
    return input.toLowerCase();    
}


  socket.on('disconnect', function() {
      socket.emit('disconnect',{"username":username})
  });
  function askChoice(){
    console.log("ask choice is called\n")
    var choice=getInput("1)Start New Game\n2)Join New Game\n3)Create Player\n4)Load Player\n5)Change Account\n");
    console.log("choice is ",choice);
    if(choice=="1"){
        console.log("your account is ",client);
        let rounds=getInput("\nNumber of Rounds\n");
        let tokens=getInput("\n Number of tokens you would want to buy\n");
        socket.emit('startNewGame',{"account":client,"rounds":rounds,"tokens":tokens});
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
      console.log("connected ",{"username":username});
      askChoice();
  })
  socket.on('message', (data) => {
      const { cmd, username } = data
      console.log(chalk.green(username + ': ' + cmd.split('\n')[0]));
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
    console.log("Game room is full",data);
})

socket.on('error',function(data){
    console.log("Error occured ",data);
    askChoice();
})

  