import store from '../../redux/store';
import { getHostedGames, getUserGames, handleGameHostedEvent, handleGameJoinedEvent, handleGameEndedEvent }
  from '../../redux/modules/guess-number-game-page/guessNumberGamePageActions';

const gameSettings = () => {
  store.dispatch(getHostedGames());
  store.dispatch(getUserGames());

  const gameHostedEvent = store.getState().guessNumberGame.contractInstance.GameHosted();

  gameHostedEvent.watch((error, result) => {
    if (result) {
      const hostedGame = {
        id: Number(result.args.gameId),
        price: Number(result.args.betAmount),
        player1: result.args.player1,
      };
      store.dispatch(handleGameHostedEvent(hostedGame));
    }
  });

  const GameJoinedEvent = store.getState().guessNumberGame.contractInstance.GameJoined();

  GameJoinedEvent.watch((error, result) => {
    if (result) {
      const joinedGame = {
        id: Number(result.args.gameId),
        price: Number(result.args.betAmount),
        player1: result.args.player1,
        player2: result.args.player2,
      };
      store.dispatch(handleGameJoinedEvent(joinedGame));
    }
  });

  const GameEndedEvent = store.getState().guessNumberGame.contractInstance.GameEnded();

  GameEndedEvent.watch((error, result) => {
    if (result) {
      const endedGame = {
        id: Number(result.args.gameId),
        gameResult: Number(result.args.result)
      };
      store.dispatch(handleGameEndedEvent(endedGame));
    }
  });
};

export default gameSettings;