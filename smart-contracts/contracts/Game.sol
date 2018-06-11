pragma solidity ^0.4.23;

contract GuessNumberGame {
  enum Result { Unfinished, Win, Loss }
  enum State { Unrealized, Hosted, Joined, Ended }
  enum NumberState { Even, Odd, Undefined }

  struct Game {
    address player1;
    address player2;
    uint betAmount;
    bytes32 player1NumberHidden;
    uint player1Number;
    NumberState player2Answer;
    uint gameJoinTime;
    State state;
    Result result;
  }

  uint constant revertTime = 7 days;
  address public owner;
  uint gameIdCounter;
  Game[] public games;

  event Deposit(address indexed player, uint amount);
  event GameHosted(address player1, bytes32 player1NumberHidden, uint indexed gameId, uint betAmount);
  event GameJoined(address player1, address player2, NumberState player2Answer, uint indexed gameId, uint betAmount);
  event GameEnded(address player1, address player2, Result result, uint indexed gameId);

  mapping(address => uint) public balances;

  modifier onlyOwner {require(msg.sender == owner); _;}

  constructor() public {
    owner = msg.sender;
  }

  function getGamesIds() view public returns (uint[]) {
    uint[] memory ids = new uint[](games.length);
    for (uint i = 0; i < games.length; i++) {
      ids[i] = i;
    }
    return ids;
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

  function getUserLastBets(uint gameId) view public returns (uint[]) {
    uint userGamesCounter = 0;
    for (uint i = games.length; i > 0 && userGamesCounter <= 5; i--) {
      if (games[i-1].player1 == games[gameId].player1 && games[i-1].state == State.Ended) {
        userGamesCounter++;
      }
    }
    uint[] memory lastBets = new uint[](userGamesCounter);
    for (uint j = games.length; j > 0 && userGamesCounter > 0; j--) {
      if (games[j-1].player1 == games[gameId].player1 && games[j-1].state == State.Ended) {
        lastBets[--userGamesCounter] = games[j-1].player1Number;
      }
    }
    return lastBets;
  }

  function getGameById(uint id) view public returns (address, address, uint, uint, NumberState, State, Result) {
    return (games[id].player1, games[id].player2, games[id].betAmount, games[id].player1Number, games[id].player2Answer, games[id].state, games[id].result);
  }

  function hostGame(bytes32 player1NumberHidden, uint val) public payable returns (bool) {
    deposit();
    require(balances[msg.sender] >= val);
    balances[msg.sender] -= val;

    games.push(Game(msg.sender, address(0), val, player1NumberHidden, 0, NumberState(2), 0, State.Hosted, Result(0)));
    uint gameId = gameIdCounter;

    emit GameHosted(msg.sender, player1NumberHidden, gameId, val);

    gameIdCounter++;

    return true;
  }

  function joinGame(uint gameId, uint8 player2Answer) public payable returns (bool) {
    Game storage thisGame = games[gameId];
    require(thisGame.state == State.Hosted);
    require(thisGame.betAmount == msg.value);
    thisGame.player2 = msg.sender;
    thisGame.player2Answer = NumberState(player2Answer);
    thisGame.state = State.Joined;
    thisGame.gameJoinTime = now;

    emit GameJoined(thisGame.player1, msg.sender, NumberState(player2Answer), gameId, thisGame.betAmount);

    return true;
  }

  function withdrawal(uint gameId) public returns (bool) {
    Game storage thisGame = games[gameId];
    require(thisGame.player2 == msg.sender);
    require(thisGame.state == State.Joined);
    require(thisGame.gameJoinTime + revertTime < now);

    thisGame.state = State.Ended;
    msg.sender.transfer(thisGame.betAmount);
    balances[owner] += thisGame.betAmount;

    return true;
  }

  function uint2str(uint i) internal pure returns (string){
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
      length++;
      j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
      bstr[k--] = byte(48 + i % 10);
      i /= 10;
    }
    return string(bstr);
  }

  function revealHiddenNumber(uint gameId, uint player1Number, string secret) public returns (Result result) {
    Game storage thisGame = games[gameId];
    require(thisGame.state == State.Joined);
    require(thisGame.player1 == msg.sender);
    require(player1Number > 0 && player1Number <= 10);
    string memory player1NumberBytes = uint2str(player1Number);
    require(thisGame.player1NumberHidden == keccak256(abi.encodePacked("0x", player1NumberBytes, secret)));
    address winner;
    thisGame.player1Number = player1Number;

    if (NumberState(player1Number % 2) == thisGame.player2Answer) {
      result = Result.Loss;
      winner = thisGame.player2;
    } else {
      result = Result.Win;
      winner = thisGame.player1;
    }

    thisGame.result = result;
    thisGame.state = State.Ended;

    emit GameEnded(thisGame.player1, thisGame.player2, thisGame.result, gameId);
    winner.transfer(thisGame.betAmount*2);
  }

  function changeOwner(address newOwner) public onlyOwner {
    owner = newOwner;
  }

  function deposit() public payable returns (bool success) {
    require(msg.value != 0);
    balances[msg.sender] += msg.value;

    emit Deposit(msg.sender, msg.value);

    return true;
  }
}
