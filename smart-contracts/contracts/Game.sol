pragma solidity ^0.4.23;

contract GuessNumberGame {
    enum Result { Unfinished, Win, Loss }
    enum State { Unrealized, Hosted, Joined, Ended }

    struct Game {
        address player1;
        address player2;
        bytes32 player1NumberHidden;
        uint8 player1Number;
        uint8 player2Number;
        State state;
        Result result;
    }

    address public owner;
    uint gameIdCounter;
    Game[] public games;

    event GameHosted(address player1, bytes32 player1Number, uint indexed gameId);
    event GameJoined(address player2, uint8 player2Number);
    event GameEnded(address player1, address player2, Result result);

    modifier onlyOwner {require(msg.sender == owner); _;}

    constructor() public {
        owner = msg.sender;
    }

    function getGames() view internal returns (Game[]) {
        return games;
    }

    function hostGame(bytes32 move) public returns (uint gameId) {
        games.push(Game(msg.sender, address(0), move, 0, 0, State.Hosted, Result(0)));
        gameId = gameIdCounter;

        emit GameHosted(msg.sender, move, gameId);

        gameIdCounter++;
    }

    function joinGame(uint gameId, uint8 move) public returns (bool success) {
        Game storage thisGame = games[gameId];
        require(thisGame.state == State.Hosted);
        require(move > 0 && move <= 10);
        thisGame.player2 = msg.sender;
        thisGame.player2Number = move;
        thisGame.state = State.Joined;

        emit GameJoined(msg.sender, move);

        return true;
    }

    function revealMove(uint gameId, uint8 move, string secret) public returns (Result result) {
        Game storage thisGame = games[gameId];

        require(thisGame.state == State.Joined);
        require(thisGame.player1 == msg.sender);
        require(thisGame.player1NumberHidden == keccak256(uint(move), secret));
        thisGame.player1Number = move;

        if (move % 2 == thisGame.player2Number % 2) {
            result = Result.Loss;
        } else {
            result = Result.Win;
        }


        thisGame.result = result;

        emit GameEnded(thisGame.player1, thisGame.player2, thisGame.result);

    }

    function setOwner(address newOwner) public {
        require(msg.sender == owner);
        owner = newOwner;
    }
}