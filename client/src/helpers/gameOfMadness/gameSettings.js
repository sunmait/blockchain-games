import gameResults from './gameResults';
import store from '../../redux/store';
import { getHostedGames, getUserGames, handleGameHostedEvent, handleGameJoinedEvent, handleBetRaisedEvent, handleGameEndedEvent }
  from '../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';

const gameSettings = () => {
  store.dispatch(getHostedGames());
  store.dispatch(getUserGames());

  const gameHostedEvent = store.getState().gameOfMadness.contractInstance.GameHosted();

  gameHostedEvent.watch((error, result) => {
    if (result) {
      const hostedGame = {
        id: Number(result.args.gameId),
        player1: result.args.player1,
        player1TotalBet: Number(result.args.betAmount),
      };
      store.dispatch(handleGameHostedEvent(hostedGame));
    }
  });

  const GameJoinedEvent = store.getState().gameOfMadness.contractInstance.GameJoined();

  GameJoinedEvent.watch((error, result) => {
    if (result) {
      const joinedGame = {
        id: Number(result.args.gameId),
        player1: result.args.player1,
        player2: result.args.player2,
        player1TotalBet: Number(result.args.player1TotalBet),
        player2TotalBet: Number(result.args.player2TotalBet),
        lastRaiseTime: Number(result.args.lastRaiseTime),
        playerWhoBetLast: result.args.playerWhoBetLast,
        betsHistory: result.args.betsHistory.map(item => Number(item)),
      };
      store.dispatch(handleGameJoinedEvent(joinedGame));
    }
  });

  const BetRaisedEvent = store.getState().gameOfMadness.contractInstance.BetRaised();

  BetRaisedEvent.watch((error, result) => {
    if (result) {
      const betRaisedParams = {
        id: Number(result.args.gameId),
        player1TotalBet: Number(result.args.player1TotalBet),
        player2TotalBet: Number(result.args.player2TotalBet),
        lastRaiseTime: Number(result.args.lastRaiseTime),
        playerWhoBetLast: result.args.playerWhoBetLast,
        betsHistory: result.args.betsHistory.map(item => Number(item)),
      };
      store.dispatch(handleBetRaisedEvent(betRaisedParams));
    }
  });

  const GameEndedEvent = store.getState().gameOfMadness.contractInstance.GameEnded();

  GameEndedEvent.watch((error, result) => {
    if (result) {
      const endedGame = {
        id: Number(result.args.gameId),
        gameResult: gameResults[Number(result.args.result)],
      };
      store.dispatch(handleGameEndedEvent(endedGame));
    }
  });
};

export default gameSettings;