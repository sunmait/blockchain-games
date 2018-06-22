import gameResults from './gameResults';

const gameSettings = (context) => {
  context.props.getHostedGames();
  context.props.getUserGames();

  const gameHostedEvent = context.props.contractInstance.GameHosted();

  gameHostedEvent.watch((error, result) => {
    if (result) {
      const hostedGame = {
        id: Number(result.args.gameId),
        player1: result.args.player1,
        player1TotalBet: Number(result.args.betAmount),
      };
      context.props.handleGameHostedEvent(hostedGame);
    }
  });

  const GameJoinedEvent = context.props.contractInstance.GameJoined();

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
      };
      context.props.handleGameJoinedEvent(joinedGame);
    }
  });

  const BetRaisedEvent = context.props.contractInstance.BetRaised();

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
      context.props.handleBetRaisedEvent(betRaisedParams);
    }
  });

  const GameEndedEvent = context.props.contractInstance.GameEnded();

  GameEndedEvent.watch((error, result) => {
    if (result) {
      const endedGame = {
        id: Number(result.args.gameId),
        gameResult: gameResults[Number(result.args.result)],
      };
      context.props.handleGameEndedEvent(endedGame);
    }
  });
};

export default gameSettings;