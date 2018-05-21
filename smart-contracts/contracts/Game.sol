pragma solidity ^0.4.23;

contract GuessNumberGame {
    struct Game {
        address player1;
        address player2;
        uint8 player1Number;
        uint8 player2Number;
        uint8 result;
    }

    address public owner;
    uint gameIdCounter;
    Game[] public games;

    event GameHosted(address player1, uint8 player1Number);
    event GameJoined(address player2, uint8 player2Number);
    event GameEnded(address player1, address player2, uint result);

    constructor() public {
        owner = msg.sender;
    }

    function getGames() public view returns (uint[]) {
        uint[] memory ids = new uint[](games.length);
        for (uint i = 0; i < games.length; i++) {
            ids[i] = i;
        }
        return ids;
    }

    function hostGame(uint8 move) public returns (bool success) {
        require(move > 0 && move < 3);
        Game memory game = Game(msg.sender, address(0), move, 0, 0);
        games.push(game);

        emit GameHosted(msg.sender, move);

        gameIdCounter++;

        return true;
    }

    function joinGame(uint gameId, uint8 move) public returns (bool success) {
        Game storage thisGame = games[gameId];
        require(move > 0 && move < 3);
        thisGame.player2 = msg.sender;
        thisGame.player2Number = move;

        emit GameJoined(msg.sender, move);

        return true;
    }

    function revealMove(uint gameId) public returns (bool success) {
        Game storage thisGame = games[gameId];

        if (thisGame.player1Number == thisGame.player2Number) {
            thisGame.result = 1;
        } else {
            thisGame.result = 2;
        }

        emit GameEnded(thisGame.player1, thisGame.player2, thisGame.result);

        return true;
    }

    function getResult(uint gameId) public view returns (uint8) {
        Game storage thisGame = games[gameId];
        return thisGame.result;
    }

    function getHostValue(uint gameId) public view returns(uint) {
        Game storage thisGame = games[gameId];
        return thisGame.player1Number;
    }

    function getJoinedValue(uint gameId) public view returns(uint) {
        Game storage thisGame = games[gameId];
        return thisGame.player2Number;
    }
}