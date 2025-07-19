const Perper = artifacts.require("./Perper.sol");

module.exports = function(deployer) {
  deployer.deploy(Perper);
};
