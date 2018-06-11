const Game = artifacts.require('GuessNumberGame');

const expectRevert = require('./helpers/expectRevert');
const increaseTime = require('./helpers/increaseTime');

contract('Game test', async accounts => {
  let instance;

  const player1 = accounts[1];
  const player2 = accounts[2];

  const State = {
    Unrealized: 0,
    Hosted: 1,
    Joined: 2,
    Ended: 3,
  };

  const NumberState = {
    Even: 0,
    Odd: 1,
    Undefined: 2,
  };

  const Result = {
    Unfinished: 0,
    Win: 1,
    Loss: 2,
  };

  beforeEach('setup contract for each test', async () => {
    instance = await Game.new({ from: accounts[0] });
  });

  describe('constructor', () => {
    it('should set owner correct', async () => {
      const expectedOwnerAddress = accounts[0];
      const actualOwnerAddress = await instance.owner.call();

      assert.strictEqual(actualOwnerAddress, expectedOwnerAddress, 'Incorrect contract owner');
    });
  });

  describe('getGameById', () => {
    it('should get game by id correct', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const expectedPlayer2Addess = '0x0000000000000000000000000000000000000000';
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      const game = await instance.getGameById(gameId, { from: player1 });

      const actualPlayer1Address = game[0];
      const actualPlayer2Address = game[1];
      const actualBetAmount = game[2].toNumber();
      const actualPlayer1Number = game[3].toNumber();
      const actualPlayer2Answer = game[4].toNumber();
      const actualGameState = game[5].toNumber();
      const actualGameResult = game[6].toNumber();

      assert.strictEqual(actualPlayer1Address, player1, 'Incorreсt player1 address');
      assert.strictEqual(actualPlayer2Address, expectedPlayer2Addess, 'Incorreсt player2 address');
      assert.strictEqual(actualBetAmount, betAmount, 'Incorreсt game bet amount');
      assert.strictEqual(actualPlayer1Number, 0, 'Incorrect player1 number');
      assert.strictEqual(actualPlayer2Answer, NumberState.Undefined, 'Incorrect player2 answer');
      assert.strictEqual(actualGameState, State.Hosted, 'Incorrect game state');
      assert.strictEqual(actualGameResult, Result.Unfinished, 'Incorrect game result');
    });
  });

  describe('getGamesIds', () => {
    it('should return games ids correct', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      for (let i = 0; i < 4; i++) {
        await instance.hostGame(player1NumberHidden, betAmount, {
          from: player1,
          value: betAmount,
        });
      }

      const expectedGamesIds = [0, 1, 2, 3];
      const actualGamesIds = (await instance.getGamesIds({ from: player1 })).map(ids => ids.toNumber());

      assert.deepEqual(actualGamesIds, expectedGamesIds, 'Incorrect game ids returned');
    });
  });

  describe('getHostedGamesIds', () => {
    it('should return hosted games ids correct', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);
      const player2Answer = NumberState.Even;

      for (let i = 0; i < 4; i++) {
        await instance.hostGame(player1NumberHidden, betAmount, {
          from: player1,
          value: betAmount,
        });
      }
      await instance.joinGame(2, player2Answer, { from: player2, value: betAmount });

      const expectedGamesIds = [0, 1, 3];
      const actualGamesIds = (await instance.getHostedGamesIds({ from: player1 })).map(ids => ids.toNumber());

      assert.deepEqual(actualGamesIds, expectedGamesIds, 'Incorreсt hosted games ids returned');
    });
  });

  describe('getUserGamesIds', () => {
    it('should return user games ids correct', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);
      const player2Answer = NumberState.Even;

      for (let i = 0; i < 4; i++) {
        await instance.hostGame(player1NumberHidden, betAmount, {
          from: player1,
          value: betAmount,
        });
      }
      await instance.joinGame(2, player2Answer, { from: player2, value: betAmount });

      const expectedPlayer1GamesIds = [0, 1, 2, 3];
      const actualPlayer1GamesIds = (await instance.getUserGamesIds({ from: player1 })).map(ids => ids.toNumber());

      const expectedPlayer2GamesIds = [2];
      const actualPlayer2GamesIds = (await instance.getUserGamesIds({ from: player2 })).map(ids => ids.toNumber());

      assert.deepEqual(actualPlayer1GamesIds, expectedPlayer1GamesIds, 'Incorreсt player1 games ids returned');
      assert.deepEqual(actualPlayer2GamesIds, expectedPlayer2GamesIds, 'Incorreсt player2 games ids returned');
    });
  });

  describe('hostGame', () => {
    it('should add correct Game instance to games array', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const expectedPlayer2Addess = '0x0000000000000000000000000000000000000000';
      const expectedGameJoinTime = 0;
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);


      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const game = await instance.games.call(0);

      const actualPlayer1Address = game[0];
      const actualPlayer2Address = game[1];
      const actualBetAmount = game[2].toNumber();
      const actualPlayer1NumberHidden = game[3];
      const actualPlayer1Number = game[4].toNumber();
      const actualPlayer2Answer = game[5].toNumber();
      const actualGameJoinTime = game[6].toNumber();
      const actualGameState = game[7].toNumber();
      const actualGameResult = game[8].toNumber();



      assert.strictEqual(actualPlayer1Address, player1, 'Incorreсt player1 address');
      assert.strictEqual(actualPlayer2Address, expectedPlayer2Addess, 'Incorreсt player2 address');
      assert.strictEqual(actualBetAmount, betAmount, 'Incorreсt game bet amount');
      assert.strictEqual(actualPlayer1NumberHidden, player1NumberHidden, 'Incorreсt hidden number of player1');
      assert.strictEqual(actualPlayer1Number, 0, 'Incorrect player1 number');
      assert.strictEqual(actualPlayer2Answer, NumberState.Undefined, 'Incorrect player2 answer');
      assert.strictEqual(actualGameJoinTime, expectedGameJoinTime, 'Incorrect time of join to game');
      assert.strictEqual(actualGameState, State.Hosted, 'Incorrect game state');
      assert.strictEqual(actualGameResult, Result.Unfinished, 'Incorrect game result');
    });

    it('call should be permitted only if player1 has bet amount on the balance', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      const promise = instance.hostGame(player1NumberHidden, betAmount + 100, {
        from: player1,
        value: betAmount,
      });

      await expectRevert(promise, 'hostGame call permitted when player1 has no bet amount on the balance');
    });

    it('should host game and adjust player balance correct', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      await instance.deposit({ from: player1, value: betAmount / 2 });

      const balanceBeforeHost = (await instance.balances.call(player1)).toNumber();

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount / 2,
      });

      const balanceAfterHost = (await instance.balances.call(player1)).toNumber();
      const expectedBalanceAfterHost = balanceBeforeHost + betAmount / 2 - betAmount;

      assert.strictEqual(balanceAfterHost, expectedBalanceAfterHost, 'Incorrect player balance');
    });
  });

  describe('joinGame', () => {
    it('should join player to game correct', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);
      const player2Answer = NumberState.Even;

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, { from: player2, value: betAmount });

      const game = await instance.games.call(gameId);

      const actualPlayer2Address = game[1];
      const actualPlayer2Answer = game[5].toNumber();
      const actualGameState = game[6].toNumber();

      assert.strictEqual(actualPlayer2Address, player2, 'Incorreсt player2 address');
      assert.strictEqual(actualPlayer2Answer, player2Answer, 'Incorrect player2 answer');
      assert.strictEqual(actualGameState, State.Joined, 'Incorrect game state');
    });

    it('call should be permitted only if game state is hosted', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);
      const player2Answer = NumberState.Even;

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;- 

      await instance.joinGame(gameId, player2Answer, { from: player2, value: betAmount });

      const promise = instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      await expectRevert(promise, 'joinGame call is permitted when game state is not hosted');
    });

    it('call should be permitted only if player2 bet amount is equal to game bet amount', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);
      const player2Answer = NumberState.Even;

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      const promise = instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount - 100,
      });

      await expectRevert(promise, 'joinGame call is permitted when player2 bet amount is not equal to game bet amount');
    });
  });

  describe('revealHiddenNumber', () => {
    it('should reveal hidden number and change game state (player1 win)', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Even;
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      await instance.revealHiddenNumber(gameId, player1Number, player1Secret, {
        from: player1,
      });

      const game = await instance.games.call(gameId);

      const actualPlayer1Number = game[4].toNumber();
      const actualGameState = game[6].toNumber();
      const actualGameResult = game[7].toNumber();

      assert.strictEqual(actualPlayer1Number, player1Number, 'Incorrect player1 number');
      assert.strictEqual(actualGameState, State.Ended, 'Incorrect game state');
      assert.strictEqual(actualGameResult, Result.Win, 'Incorrect game result');
      //TODO: check player balance after game
    });

    it('should reveal hidden number and change game state (player1 loss)', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Odd;
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      await instance.revealHiddenNumber(gameId, player1Number, player1Secret, {
        from: player1,
      });

      const game = await instance.games.call(gameId);

      const actualPlayer1Number = game[4].toNumber();
      const actualGameState = game[6].toNumber();
      const actualGameResult = game[7].toNumber();

      assert.strictEqual(actualPlayer1Number, player1Number, 'Incorrect player1 number');
      assert.strictEqual(actualGameState, State.Ended, 'Incorrect game state');
      assert.strictEqual(actualGameResult, Result.Loss, 'Incorrect game result');
    });

    it('call should be permitted only if game state is joined', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Odd;
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      const promise = instance.revealHiddenNumber(gameId, player1Number, player1Secret, {
        from: player1,
      });

      await expectRevert(promise, 'Call reveal hidden number permitted even if game state is not joined');
    });

    it('call should be permitted only for user who host game', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Odd;
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      const promise = instance.revealHiddenNumber(gameId, player1Number, player1Secret, {
        from: accounts[3],
      });

      await expectRevert(promise, 'revealHiddenNumbe is permitted for player who is not host');
    });

    it('player1 number should be from 1 until 10', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Odd;
      const player1Number = 3;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + player1Number + player1Secret);
      const incorrectPlayer1Number = 11;

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      const promise = instance.revealHiddenNumber(gameId, incorrectPlayer1Number, player1Secret, {
        from: player1,
      });

      await expectRevert(promise, 'player1 number less than 0 or more than 10');
    });

    it('call should be permitted only with player1 number and secret that was used on host game stage', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Odd;
      const correctPlayer1Number = 3;
      const incorrectPlayer1Number = 8;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + correctPlayer1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      const promise = instance.revealHiddenNumber(gameId, incorrectPlayer1Number, 'Secret', {
        from: player1,
      });

      await expectRevert(
        promise,
        'Call reveal hidden number permitted even if player1 number and secret are changed from host game'
      );
    });
  });

  describe('deposit', () => {
    it('should add correct value on the player balance', async () => {
      const depositValue = Number.parseInt(web3.toWei(1), 10);

      const balanceBeforeDeposit = (await instance.balances.call(player1)).toNumber();

      await instance.deposit({
        from: player1,
        value: depositValue,
      });

      const balanceAfterDeposit = (await instance.balances.call(player1)).toNumber();
      const expectedBalanceAfterDeposit = balanceBeforeDeposit + depositValue;

      assert.strictEqual(balanceAfterDeposit, expectedBalanceAfterDeposit, 'Incorrect player balance');
    });

    it('call should be permitted only if deposit value is not equal 0', async () => {
      const depositValue = 0;

      const promise = instance.deposit({
        from: player1,
        value: depositValue,
      });

      await expectRevert(promise, 'Call deposit permitted even if deposit value is equal 0');
    });
  });

  describe('withdrawal', () => {
    it('should withdrawal correct value on the player balance', async () => {
      const betAmount = Number.parseInt(web3.toWei(1), 10);
      const player2Answer = NumberState.Odd;
      const correctPlayer1Number = 3;
      const incorrectPlayer1Number = 8;
      const player1Secret = 'secret-key';
      const player1NumberHidden = web3.sha3('0x' + correctPlayer1Number + player1Secret);

      await instance.hostGame(player1NumberHidden, betAmount, {
        from: player1,
        value: betAmount,
      });
    before + gas*gasPrice === after

      const gameId = 0;

      await instance.joinGame(gameId, player2Answer, {
        from: player2,
        value: betAmount,
      });

      const revertTime = await instance.revertTime.call();
      await increaseTime(revertTime.toNumber() + (8 * 24 * 60 * 60));
    });
  });

  describe('changeOwner', () => {
    it('should change owner correct', async () => {
      const newOwner = accounts[1];

      const ownerBefore = await instance.owner.call();

      await instance.changeOwner(newOwner, {
        from: ownerBefore,
      });

      const ownerAfter = await instance.owner.call();

      assert.notEqual(ownerBefore, ownerAfter, 'Contract owner has not changed');
      assert.strictEqual(ownerAfter, newOwner, 'Incorrect contract owner');
    });

    it('call should be permitted only for contract owner', async () => {
      const incorrectOwnerAddress = accounts[1];
      const newOwner = accounts[1];

      const promise = instance.changeOwner(newOwner, {
        from: incorrectOwnerAddress,
      });

      await expectRevert(promise, 'Call changeOwner permitted even for another users');
    });
  });
});
