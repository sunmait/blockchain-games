const gameSettings = (context) => {
  context.props.getHostedGames();
  context.props.getUserGames();

  const gameHostedEvent = context.props.contractInstance.GameHosted({});

  gameHostedEvent.watch((error, result) => {
    if (result) {
      const hostedGame = {
        id: Number(result.args.gameId),
        price: Number(result.args.betAmount),
        player1: result.args.player1,
      };
      context.props.handleGameHostedEvent(hostedGame);
    }
  });

  const GameJoinedEvent = context.props.contractInstance.GameJoined({});

  GameJoinedEvent.watch((error, result) => {
    if (result) {
      const joinedGame = {
        id: Number(result.args.gameId),
        price: Number(result.args.betAmount),
        player1: result.args.player1,
        player2: result.args.player2,
      };
      context.props.handleGameJoinedEvent(joinedGame);
    }
  });

  const GameEndedEvent = context.props.contractInstance.GameEnded({});

  GameEndedEvent.watch((error, result) => {
    if (result) {
      const endedGame = {
        id: Number(result.args.gameId),
        gameResult: Number(result.args.result)
      };
      context.props.handleGameEndedEvent(endedGame);
    }
  });
};

export default gameSettings;