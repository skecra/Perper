// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Perper {
    // Osnovne karakteristike tokena
    string public name = "Perper";
    string public symbol = "PRP";
    uint8 public decimals = 18; // Standard za ERC-20
    uint256 public totalSupply;

    address public owner;

    // Balansi korisnika
    mapping(address => uint256) public balanceOf;
    // Dozvole (allowance)
    mapping(address => mapping(address => uint256)) public allowance;

    // Eventi
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

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
}
