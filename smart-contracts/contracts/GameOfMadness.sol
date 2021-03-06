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
    uint[] betsHistory;
  }

  address public owner;
  uint constant turnMaxDuration = 1 days;
  uint gameIdCounter;
  Game[] public games;

  event GameHosted(uint indexed gameId, address player1, uint betAmount);
  event GameJoined(
    uint indexed gameId,
    address player1, address player2,
    uint player1TotalBet, uint player2TotalBet,
    uint lastRaiseTime, address playerWhoBetLast,
    uint[] betsHistory
  );
  event BetRaised(
    uint indexed gameId, uint player1TotalBet, uint player2TotalBet,
    uint lastRaiseTime, address playerWhoBetLast, uint[] betsHistory
  );
  event GameEnded(uint indexed gameId, Result result);

  function hostGame() public payable {
    require(msg.value > 0);
    uint[] memory betsHistory;
    games.push(Game(msg.sender, address(0), msg.value, 0, msg.sender, State.Hosted, Result.Unfinished, 0, betsHistory));
    games[gameIdCounter].betsHistory.push(msg.value);

    emit GameHosted(gameIdCounter, msg.sender, msg.value);

    gameIdCounter++;
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
    thisGame.betsHistory.push(thisGame.player2TotalBet);

    emit GameJoined(
      gameId,
      thisGame.player1, thisGame.player2,
      thisGame.player1TotalBet, msg.value,
      thisGame.lastRaiseTime, thisGame.playerWhoBetLast,
      thisGame.betsHistory
    );
  }

  function raise(uint gameId) public payable {
    Game storage thisGame = games[gameId];

    require(thisGame.state == State.Joined);
    require(thisGame.player1 == msg.sender || thisGame.player2 == msg.sender);
    require(thisGame.playerWhoBetLast != msg.sender);

    if (thisGame.player1 == msg.sender) {
      require(thisGame.player1TotalBet + msg.value > thisGame.player2TotalBet);
      thisGame.player1TotalBet += msg.value;
      thisGame.betsHistory.push(thisGame.player1TotalBet);
    } else if (thisGame.player2 == msg.sender) {
      require(thisGame.player2TotalBet + msg.value > thisGame.player2TotalBet);
      thisGame.player2TotalBet += msg.value;
      thisGame.betsHistory.push(thisGame.player2TotalBet);
    }
    thisGame.lastRaiseTime = now;
    thisGame.playerWhoBetLast = msg.sender;

    emit BetRaised(
      gameId, thisGame.player1TotalBet, thisGame.player2TotalBet,
      thisGame.lastRaiseTime, thisGame.playerWhoBetLast, thisGame.betsHistory
    );
  }

  function withdrawal(uint gameId) public {
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

    emit GameEnded(gameId, thisGame.result);
  }

  function getHostedGamesIds() view public returns (uint[]) {
    uint hostedGamesCounter = 0;
    for (uint i = 0; i < games.length; i++) {
      if (games[i].state == State.Hosted) {
        hostedGamesCounter++;
      }
    }
    uint idIndex = 0;
    uint[] memory ids = new uint[](hostedGamesCounter);
    for (uint j = 0; j < games.length; j++) {
      if (games[j].state == State.Hosted) {
        ids[idIndex++] = j;
      }
    }
    return ids;
  }

  function getHostedGameFieldsById(uint id) view public returns (address, uint) {
    return (
      games[id].player1, games[id].player1TotalBet
    );
  }

  function getUserGamesIds() view public returns (uint[]) {
    uint userGamesCounter = 0;
    for (uint i = 0; i < games.length; i++) {
      if (games[i].player1 == msg.sender || games[i].player2 == msg.sender) {
        userGamesCounter++;
      }
    }
    uint idIndex = 0;
    uint[] memory ids = new uint[](userGamesCounter);
    for (uint j = 0; j < games.length; j++) {
      if (games[j].player1 == msg.sender || games[j].player2 == msg.sender) {
        ids[idIndex++] = j;
      }
    }
    return ids;
  }

  function getGamePlayersById(uint id) view public returns (address, address) {
    return (
      games[id].player1, games[id].player2
    );
  }

  function getUserGameFieldsById(uint id) view public returns (uint, uint, State, Result, uint, address, uint[]) {
    return (
      games[id].player1TotalBet, games[id].player2TotalBet,
      games[id].state, games[id].result,
      games[id].lastRaiseTime, games[id].playerWhoBetLast,
      games[id].betsHistory
    );
  }

}