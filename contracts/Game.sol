pragma solidity >=0.4.21 <0.6.0;

contract Game {
    address public player1;
    address public player2;
    uint256 public player1Tokens;
    uint256 public player2Tokens;
    constructor() public payable {
        require(msg.value > 0,"Value cannot be less than zero");
        require(msg.value % 10 finney == 0,"Please transfer amount as multiple of 10 finney");
        player1 = msg.sender;
        player1Tokens = msg.value % 10;
    }
    function setupPlayer2() public payable {
        require(msg.value > 0,"Value cannot be less than zero");
        require(msg.value % 10 finney == 0,"Please transfer amount as multiple of 10 finney");
        player2 = msg.sender;
        player2Tokens = msg.value % 10;
    }
    function getPlayer1TokensCount() public view returns(uint256){
        return player1Tokens;
    }
    function getPlayer2TokensCount() public view returns(uint256){
        return player2Tokens;
    }
}