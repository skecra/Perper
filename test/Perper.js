//test

var Perper = artifacts.require("./Perper.sol")

contract('Perper', function(accounts) {
    it('sets total suply', function(){
        return Perper.deployed().then(function(instance){
            tokenInstance = instance
            return tokenInstance.totalSuply();
        }).then(function(totalSuply){
            assert.equal(totalSuply.toNumber(), 1000000, 'da li je totalSuply 1 milion')
        })
    })
})