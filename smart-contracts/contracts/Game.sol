pragma solidity ^0.4.23;

contract GuessNumberGame {
  enum Result { Unfinished, Win, Loss }
  enum State { Unrealized, Hosted, Joined, Ended }
  enum NumberState { Even, Odd, Undefined }

  struct Game {
    address player1;
    address player2;
    uint value;
    bytes32 player1NumberHidden;
    uint8 player1Number;
    NumberState player2Answer;
    State state;
    Result result;
  }

  address public owner;
  uint gameIdCounter;
  Game[] public games;

  event Deposit(address indexed player, uint amount);
  event GameHosted(address player1, bytes32 player1NumberHidden, uint indexed gameId);
  event GameJoined(address player2, NumberState player2Answer);
  event GameEnded(address player1, address player2, Result result);

  mapping(address => uint) public balances;

  modifier onlyOwner {require(msg.sender == owner); _;}

  constructor() public {
    owner = msg.sender;
  }

  function getGames() view public returns (uint[]) {
    uint[] memory ids = new uint[](games.length);
    for (uint i = 0; i < games.length; i++) {
      ids[i] = i;
    }
    return ids;
  }

  function hostGame(bytes32 player1NumberHidden, uint val) public payable returns (bool) {
    deposit();
    require(balances[msg.sender] >= val);
    balances[msg.sender] -= val;

    games.push(Game(msg.sender, address(0), val, player1NumberHidden, 0, NumberState(2), State.Hosted, Result(0)));
    uint gameId = gameIdCounter;

    emit GameHosted(msg.sender, player1NumberHidden, gameId);

    gameIdCounter++;

    return true;
  }

  function joinGame(uint gameId, uint8 player2Answer) public payable returns (bool) {
    Game storage thisGame = games[gameId];
    require(thisGame.state == State.Hosted);
    require(thisGame.value == msg.value);
    thisGame.player2 = msg.sender;
    thisGame.player2Answer = NumberState(player2Answer);
    thisGame.state = State.Joined;

    emit GameJoined(msg.sender, NumberState(player2Answer));

    return true;
  }

  function revealHiddenNumber(uint gameId, uint8 player1Number, string secret) public returns (Result result) {
    Game storage thisGame = games[gameId];

    require(thisGame.state == State.Joined);
    require(thisGame.player1 == msg.sender);
    require(player1Number > 0 && player1Number <= 10);
    require(thisGame.player1NumberHidden == keccak256(abi.encodePacked(player1Number, secret)));
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

    emit GameEnded(thisGame.player1, thisGame.player2, thisGame.result);
    winner.transfer(thisGame.value*2);

  }

  function setOwner(address newOwner) public {
    require(msg.sender == owner);
    owner = newOwner;
  }

  function deposit() public payable returns (bool success) {
    require(msg.value != 0);
    balances[msg.sender] += msg.value;

    emit Deposit(msg.sender, msg.value);

    return true;
  }

  function getGameById(uint id) view public returns (address, address, uint8, NumberState, State, Result) {
    return (games[id].player1, games[id].player2, games[id].player1Number, games[id].player2Answer, games[id].state, games[id].result);
  }
}
