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


    it('transfer tokena', function(){
        return Perper.deployed().then(function(instance){
            tokenInstance = instance;
//test slanja veceg broja tokenea nego sto korisnik posjeduje
            return tokenInstance.transfer.call(accounts[1], 999999999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'error message mora imati revert');
            return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
        }).then(function(success){
            assert.equal(success, true, 'returns true')
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);

        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'dodaje tokene');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, 'oduzeo poslate tokene');
        })
    })

    it('approves tokens for transfer', function(){
        return Perper.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100)
        }).then(function(success) {
            assert.equal(success, true, 'returns true')
            return tokenInstance.approve(accounts[1], 100)
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are aprovedred from');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are aprovedred to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the aproved amount');
            return tokenInstance.allowance(accounts[0], accounts[1])
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'store allowance adrese')
        })
    })

    it('handles token transfers', function(){
        return Perper.deployed().then(function(instance){
        tokenInstance = instance;    
        fromAccount = accounts[2]
        toAccount = accounts[3]
        spendingAccount = accounts[4]
        //transfer tokens
        return tokenInstance.transfer(fromAccount, 100, { from: accounts[0]})
    }).then(function(receipt){
        //approve spending account
        return tokenInstance.approve(spendingAccount, 10, {from: fromAccount})
    }).then(function(receipt){
        //try transfer more than account have
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount})
    }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert') >= 0), 'cant transfer more than you have'
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount})
    }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert') >= 0, 'canot transfer more than approved ammount of tokens')
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount})
    }).then(function(success){
        assert.equal(success, true)
        return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount})
    }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are aprovedred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are aprovedred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the aproved amount');
            return tokenInstance.balanceOf(fromAccount)
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'deducts amout from sender')
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'add amout to reciever')
            return tokenInstance.allowance(fromAccount, spendingAccount)
        }).then(function(allowance){
            assert.equal(allowance, 0, 'deducts the amount from allowance')
        })
})

})