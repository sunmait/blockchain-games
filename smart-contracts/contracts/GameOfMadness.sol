pragma solidity ^0.4.23;

contract GameOfMadness {
  constructor() public {
    owner = msg.sender;
  }

  enum State { Unrealized, Hosted, Joined, Ended }
  enum Result { Unfinished, Win, Loss }

  struct Game {
    address player1;
    address player2;
    uint player1TotalBet;
    uint player2TotalBet;
    address playerWhoBetLast;
    State state;
    Result result;
    uint lastRaiseTime;
  }

  address public owner;
  uint constant turnMaxDuration = 1 days;
  uint gameIdCounter;
  Game[] public games;

  event GameHosted();
  event GameJoined();
  event TurnPassed();
  event GameEnded();

  function hostGame() public payable {
    require(msg.value > 0);
    games.push(Game(msg.sender, address(0), msg.value, 0, msg.sender, State.Hosted, Result.Unfinished, 0));
    gameIdCounter++;

    emit GameHosted();
  }

  function joinGame(uint gameId) public payable {
    Game storage thisGame = games[gameId];

    require(thisGame.player1 != msg.sender);
    require(thisGame.state == State.Hosted);
    require(msg.value > thisGame.player1TotalBet);

    thisGame.player2 = msg.sender;
    thisGame.player2TotalBet += msg.value;
    thisGame.playerWhoBetLast = msg.sender;
    thisGame.lastRaiseTime = now;
    thisGame.state = State.Joined;

    emit GameJoined();
  }

  function raise(uint gameId) public payable {
    Game storage thisGame = games[gameId];

    require(thisGame.state == State.Joined);
    require(thisGame.player1 == msg.sender || thisGame.player2 == msg.sender);
    require(thisGame.playerWhoBetLast != msg.sender);

    if (thisGame.player1 == msg.sender) {
      require(thisGame.player1TotalBet + msg.value > thisGame.player2TotalBet);
      thisGame.player1TotalBet += msg.value;
    } else if (thisGame.player2 == msg.sender) {
      require(thisGame.player2TotalBet + msg.value > thisGame.player2TotalBet);
      thisGame.player2TotalBet += msg.value;
    }
    thisGame.playerWhoBetLast = msg.sender;

    emit TurnPassed();
  }

  function windrawal(uint gameId) public {
    Game storage thisGame = games[gameId];

    require(thisGame.playerWhoBetLast == msg.sender);
    require(thisGame.lastRaiseTime + turnMaxDuration < now);
    require(thisGame.state == State.Joined);

    thisGame.state = State.Ended;
    if (thisGame.player1 == msg.sender) {
      thisGame.result = Result.Win;
    } else if (thisGame.player2 == msg.sender) {
      thisGame.result = Result.Loss;
    }

    msg.sender.transfer(thisGame.player1TotalBet + thisGame.player2TotalBet);

    emit GameEnded();
  }

}