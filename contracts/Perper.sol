// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Perper {
    // Osnovne karakteristike tokena
    string public name = "Perper";
    string public symbol = "PRP";
    uint8 public decimals = 18; // Standard za ERC-20
    uint256 public totalSupply;

    address public owner;

    // Cijena tokena u WEI (1 ETH = 10^18 wei)
    uint256 public tokenPrice = 0.0001 ether; // 1 PRP = 0.01 ETH

    // Balansi korisnika
    mapping(address => uint256) public balanceOf;
    // Dozvole (allowance)
    mapping(address => mapping(address => uint256)) public allowance;

    // Eventi
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensPurchased(address indexed buyer, uint256 amountPRP, uint256 costETH);

    // Konstruktor
    constructor(uint256 _initialSupply) public {
        owner = msg.sender;
        totalSupply = _initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // Transfer funkcija
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Invalid recipient address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Dozvola za trošenje tokena
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer tokena preko dozvole
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Invalid recipient address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // Mint (kreiranje novih tokena)
    function mint(address _to, uint256 _value) public returns (bool success) {
        require(msg.sender == owner, "Only owner can mint tokens");

        balanceOf[_to] += _value;
        totalSupply += _value;

        emit Transfer(address(0), _to, _value);
        return true;
    }

    // Burn (uništavanje tokena)
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance to burn");

        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;

        emit Transfer(msg.sender, address(0), _value);
        return true;
    }

    // Funkcija za kupovinu tokena
    function buyTokens() public payable returns (bool success) {
        require(msg.value > 0, "Send ETH to buy tokens");

        // Izračun koliko PRP kupac dobija
        uint256 amountToBuy = (msg.value * 10**uint256(decimals)) / tokenPrice;
        require(balanceOf[owner] >= amountToBuy, "Not enough tokens in reserve");

        // Prebaci tokene sa ownera na kupca
        balanceOf[owner] -= amountToBuy;
        balanceOf[msg.sender] += amountToBuy;

        emit Transfer(owner, msg.sender, amountToBuy);
        emit TokensPurchased(msg.sender, amountToBuy, msg.value);
        return true;
    }

    // Promjena cijene tokena (samo owner)
    function setTokenPrice(uint256 _newPriceWei) public {
        require(msg.sender == owner, "Only owner can set price");
        tokenPrice = _newPriceWei;
    }

    function withdrawETH(uint256 _amountWei) public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance >= _amountWei, "Not enough ETH in contract");
        address(uint160(owner)).transfer(_amountWei);
    }


    // Fallback funkcija da se ne izgubi ETH ako neko pošalje direktno
    function() external payable {
        buyTokens();
    }
}
