var GuessNumberGame = artifacts.require("GuessNumberGame");
var GameOfMadness = artifacts.require("GameOfMadness");

module.exports = function(deployer) {
  deployer.deploy(GuessNumberGame).then(() => deployer.deploy(GameOfMadness));
};
