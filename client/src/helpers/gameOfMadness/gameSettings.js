const gameSettings = (context) => {
  context.props.getHostedGames();
  context.props.getUserGames();
};

export default gameSettings;