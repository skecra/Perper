//test

var Perper = artifacts.require("./Perper.sol")

contract('Perper', function(accounts) {
    var tokenInstance;

    it('pokrece se pametni ugovor sa tacnim vrijednostima', function(){
        return Perper.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, 'Perper', 'tacno ime')
            return tokenInstance.symbol()
        }).then(function(symbol){
            assert.equal(symbol, 'PRP', 'tacan simbol')
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, 'Perper v1.0', 'ima tacnu verziju(standard)')
        })
    })

    it('sets total suply', function(){
        return Perper.deployed().then(function(instance){
            tokenInstance = instance
            return tokenInstance.totalSuply();
        }).then(function(totalSuply){
            assert.equal(totalSuply.toNumber(), 1000000, 'da li je totalSuply 1 milion')
            return tokenInstance.balanceOf(accounts[0])
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'da li je ukupan broj tokena na adminovom nalogu')
        })
    })
})