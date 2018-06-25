const Game = artifacts.require('GameOfMadness');

contract('GameOfMadness tests', async accounts => {
  let instance;

  const player1 = accounts[1];
  const player2 = accounts[2];

  const State = {
    Unrealized: 0,
    Hosted: 1,
    Joined: 2,
    Ended: 3,
  };

  const Result = {
    Unfinished: 0,
    Win: 1,
    Loss: 2,
  };

  beforeEach('setup contract for each test', async () => {
    instance = await Game.new({ from: accounts[0]});
  });

  describe('constructor initialization', () => {
    it('should set contract owner correct', async () => {
      const expectedOwnerAddress = accounts[0];
      const actualOwnerAddress = await instance.owner.call();

      assert.strictEqual(actualOwnerAddress, expectedOwnerAddress, 'Incorrect contract owner');
    });
  });

  describe('hostGame function', () => {
    it('should add correct game instance to Games array', async () => {
      const betAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const expectedPlayer2Address = '0x0000000000000000000000000000000000000000';
      const expectedPlayer2TotalBet = 0;
      const expectedLastRaiseTime = 0;

      const transactionParams = {
        from: player1,
        value: betAmount,
      };
      await instance.hostGame(transactionParams);

      const gameId = 0;
      const hostedGame = await instance.games.call(gameId);

      const actualPlayer1Address = hostedGame[0];
      const actualPlayer2Address = hostedGame[1];
      const actualPlayer1TotalBet = hostedGame[2].toNumber();
      const actualPlayer2TotalBet = hostedGame[3].toNumber();
      const actualPlayerWhoBetLast = hostedGame[4];
      const actualState = hostedGame[5].toNumber();
      const actualResult = hostedGame[6].toNumber();
      const actualLastRaiseTime = hostedGame[7].toNumber();
      // TODO: betsHistory(aka game[8]) is undefined
      // const actualBetsHistory = game[8].map(item => item.toNumber());

      assert.strictEqual(actualPlayer1Address, player1, 'Incorrect player1 address');
      assert.strictEqual(actualPlayer2Address, expectedPlayer2Address, 'Incorrect player2 address');
      assert.strictEqual(actualPlayer1TotalBet, betAmount, 'Incorrect player1TotalBet field');
      assert.strictEqual(actualPlayer2TotalBet, expectedPlayer2TotalBet, 'Incorrect player2TotalBet field');
      assert.strictEqual(actualPlayerWhoBetLast, player1, 'Incorrect playerWhoBetLast address');
      assert.strictEqual(actualState, State.Hosted, 'Incorrect game state');
      assert.strictEqual(actualResult, Result.Unfinished, 'Incorrect game result');
      assert.strictEqual(actualLastRaiseTime, expectedLastRaiseTime, 'Incorrect lastRaiseTime field');
      // assert.strictEqual(actualBetsHistory, [betAmount], 'Incorrect bets hostory');
    });
  });

  describe('joinGame function', () => {
    it('should join player to the game correct', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      await instance.hostGame(hostGameTransactionParams);

      const gameId = 0;
      const hostedGame = await instance.games.call(gameId);
      const hostedGameLastRaiseTime = hostedGame[7].toNumber();

      const joinGameTransactionParams = {
        from: player2,
        value: player2BetAmount,
      };
      await instance.joinGame(gameId, joinGameTransactionParams);

      const joinedGame = await instance.games.call(gameId);

      const actualPlayer2Address = joinedGame[1];
      const actualPlayer2TotalBet = joinedGame[3].toNumber();
      const actualPlayerWhoBetLast = joinedGame[4];
      const actualState = joinedGame[5].toNumber();
      const actualLastRaiseTime = joinedGame[7].toNumber();

      assert.strictEqual(actualPlayer2Address, player2, 'Incorrect player2 address');
      assert.strictEqual(actualPlayer2TotalBet, player2BetAmount, 'Incorrect player2 total bet');
      assert.strictEqual(actualPlayerWhoBetLast, player2, 'Incorrect playerPlayerWhoBetLast address');
      assert.strictEqual(actualState, State.Joined, 'Incorrect game state');
      assert(actualLastRaiseTime >= hostedGameLastRaiseTime, 'Joined lastRaiseTime should be greater or equal to hosted');
    });
  });

  describe('raise function', () => {
    it('should raise player1 bet correct', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);
      const player1RaiseValue = Number.parseInt(web3.toWei(0.000002), 10);

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      await instance.hostGame(hostGameTransactionParams);

      const gameId = 0;
      const joinGameTransactionParams = {
        from: player2,
        value: player2BetAmount,
      };
      await instance.joinGame(gameId, joinGameTransactionParams);

      const joinedGame = await instance.games.call(gameId);
      const joinedGameLastRaiseTime = joinedGame[7].toNumber();

      const raiseTransactionParams = {
        from: player1,
        value: player1RaiseValue,
      };
      await instance.raise(gameId, raiseTransactionParams);

      const raisedGame = await instance.games.call(gameId);

      const actualPlayer1TotalBet = raisedGame[2].toNumber();
      const actualPlayerWhoBetLast = raisedGame[4];
      const actualLastRaiseTime = raisedGame[7].toNumber();

      assert.strictEqual(actualPlayer1TotalBet, player1BetAmount + player1RaiseValue, 'Incorrect player1TotalBet value after raise');
      assert.strictEqual(actualPlayerWhoBetLast, player1, 'Incorrect playerWhoBetLast address');
      assert(actualLastRaiseTime >= joinedGameLastRaiseTime, 'Raised lastRaiseTime should be greater or equal to joined');
    });
  });
});