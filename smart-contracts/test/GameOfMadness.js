const Game = artifacts.require('GameOfMadness');

const increaseTime = require('./helpers/increaseTime');
const expectRevert = require('./helpers/expectRevert');

contract('GameOfMadness tests', async accounts => {
  let instance;

  const player1 = accounts[1];
  const player2 = accounts[2];
  const player3 = accounts[3];

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

    it('should raise \'VM transaction revert\' because player1 and player2 cann\'t be the same person', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      await instance.hostGame(hostGameTransactionParams);

      const gameId = 0;
      const joinGameTransactionParams = {
        from: player1,
        value: player2BetAmount,
      };
      const promise = instance.joinGame(gameId, joinGameTransactionParams);
      await expectRevert(promise, 'Incorrect player2 address');
    });

    it('should raise \'VM transaction revert\' because player2 bet amount not greater than player1\'s', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000045), 10);

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
      const promise = instance.joinGame(gameId, joinGameTransactionParams);
      await expectRevert(promise, 'Incorrect player2 bet amount');
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

    it('should raise \'VM transaction revert\' if game state is Hosted', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      await instance.hostGame(hostGameTransactionParams);

      const gameId = 0;
      const raiseHostedGameTransactionParams = {
        from: player2,
        value: player2BetAmount,
      };
      const promise = instance.raise(gameId, raiseHostedGameTransactionParams);

      await expectRevert(promise, 'Raise func call is permitted when game state is not Hosted');
    });

    it('should raise \'VM transaction revert\' if game state is Ended', async () => {
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
      const lastRaiseTime = joinedGame[7].toNumber();
      await increaseTime(lastRaiseTime + 3); // TODO: change turn duration time in prod

      const withdrawalTransactionParams = {
        from: player2,
      };
      await instance.withdrawal(gameId, withdrawalTransactionParams);

      const raiseEndedGameTransactionParams = {
        from: player1,
        value: player1RaiseValue,
      };
      const promise = instance.raise(gameId, raiseEndedGameTransactionParams);

      await expectRevert(promise, 'Raise func call is permitted when game state is Ended')
    });

    it('should raise \'VM transaction revert\' if raised not player1 or player2', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);
      const raiseValue = Number.parseInt(web3.toWei(0.000002), 10);

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

      const raiseEndedGameTransactionParams = {
        from: player3,
        value: raiseValue,
      };
      const promise = instance.raise(gameId, raiseEndedGameTransactionParams);

      await expectRevert(promise, 'Raise func call is permitted for non-player person')
    });

    it('should raise \'VM transaction revert\' if raised player and playerWhoRaisedLast are same person', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);
      const raiseValue = Number.parseInt(web3.toWei(0.000002), 10);

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

      const raiseEndedGameTransactionParams = {
        from: player2,
        value: raiseValue,
      };
      const promise = instance.raise(gameId, raiseEndedGameTransactionParams);

      await expectRevert(promise, 'Raise func call is permitted for person who raised last time')
    });

    it('should raise \'VM transaction revert\' if (raisedValue + playerTotalBet <= opponentValue)', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);
      const raiseValue = Number.parseInt(web3.toWei(0.000001), 10);

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

      const raiseEndedGameTransactionParams = {
        from: player1,
        value: raiseValue,
      };
      const promise = instance.raise(gameId, raiseEndedGameTransactionParams);

      await expectRevert(promise, 'Raise func call is permitted for executed playerTotalBet that not greater ' +
                                  'than his opponent\'s totalBet value');
    });
  });

  describe('withdrawal function', () => {
    it('should withdrawal correct value to the player balance', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);

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
      const lastRaiseTime = joinedGame[7].toNumber();
      await increaseTime(lastRaiseTime + 3); // TODO: change turn duration time in prod

      const player2BalanceBefore = web3.eth.getBalance(player2).toNumber();
      const estimatedGas = await instance.withdrawal.estimateGas(gameId, {
        from: player2,
      });

      const gasPrice = 2;
      const player2ExpectedBalance = player2BalanceBefore + player1BetAmount + player2BetAmount - estimatedGas * gasPrice;

      const withdrawalTransactionParams = {
        from: player2,
        gasLimit: estimatedGas,
        gasPrice,
      };
      await instance.withdrawal(gameId, withdrawalTransactionParams);

      const player2BalanceAfter = web3.eth.getBalance(player2).toNumber();

      assert.strictEqual(player2ExpectedBalance, player2BalanceAfter, 'Incorrect player2 result balance');
    });
  });

  describe('getHostedGamesIds function', () => {
    it('should return hosted games ids correct', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      for (let i = 0; i < 4; i++) {
        await instance.hostGame(hostGameTransactionParams);
      }

      const joinGameTransactionParams = {
        from: player2,
        value: player2BetAmount,
      };
      for (let i = 0; i < 2; i++) {
        await instance.joinGame(i, joinGameTransactionParams);
      }

      const expectedGamesIds = [2, 3];
      const actualGamesIds = (await instance.getHostedGamesIds({
        from: player1,
      })).map(id => id.toNumber());

      assert.deepEqual(expectedGamesIds, actualGamesIds, 'Incorrect hosted games ids returned');
    });
  });

  describe('getUserGamesIds function', () => {
    it('should return user games ids correct', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);

      const player1HostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      for (let i = 0; i < 4; i++) {
        await instance.hostGame(player1HostGameTransactionParams);
      }

      const player2HostGameTransactionParams = {
        from: player2,
        value: player2BetAmount,
      };
      for (let i = 0; i < 4; i++) {
        await instance.hostGame(player2HostGameTransactionParams);
      }

      const expectedGamesIds = [0, 1, 2, 3];
      const actualGamesIds = (await instance.getUserGamesIds({
        from: player1,
      })).map(id => id.toNumber());

      assert.deepEqual(expectedGamesIds, actualGamesIds, 'Incorrect hosted games ids returned');
    });
  });

  describe('getGamePlayersById function', () => {
    it('should return users connected to the game correct', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);
      const player2BetAmount = Number.parseInt(web3.toWei(0.000046), 10);
      const hostedGamePlayer2Address = '0x0000000000000000000000000000000000000000';

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      await instance.hostGame(hostGameTransactionParams);

      const gameId = 0;
      const expectedHostedGamePlayers = [player1, hostedGamePlayer2Address];
      const actualHostedGamePlayers = (await instance.getGamePlayersById(gameId, {
        from: player1,
      }));

      const joinGameTransactionParams = {
        from: player2,
        value: player2BetAmount,
      };
      await instance.joinGame(gameId, joinGameTransactionParams);

      const expectedJoinedGamePlayers = [player1, player2];
      const actualJoinedGamePlayers = await instance.getGamePlayersById(gameId, {
        from: player1,
      });

      assert.deepEqual(expectedHostedGamePlayers, actualHostedGamePlayers, 'Incorrect hosted game players addresses');
      assert.deepEqual(expectedJoinedGamePlayers, actualJoinedGamePlayers, 'Incorrect joined game players addresses');
    });
  });

  describe('getHostedGameFieldsById function', () => {
    it('should return hosted game fields correct', async () => {
      const player1BetAmount = Number.parseInt(web3.toWei(0.000045), 10);

      const hostGameTransactionParams = {
        from: player1,
        value: player1BetAmount,
      };
      await instance.hostGame(hostGameTransactionParams);

      const gameId = 0;
      const expectedHostedGameFields = [player1, player1BetAmount];
      const actualHostedGameFields = (await instance.getHostedGameFieldsById(gameId, {
        from: player1,
      }));
      actualHostedGameFields[1] = actualHostedGameFields[1].toNumber();

      assert.deepEqual(expectedHostedGameFields, actualHostedGameFields, 'Incorrect hosted game fields');
    });
  });

});