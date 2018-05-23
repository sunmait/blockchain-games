var Migrations = artifacts.require("GuessNumberGame");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
