// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Perper {

  uint256 public totalSuply;
  //ime
  string public name = "Perper";
  //simbol
  string public symbol = "PRP";
  //standard
  string public standard = "Perper v1.0";

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;
  
  constructor(uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSuply = _initialSupply;
    //prebaci sve tokene adminu

  }

  function transfer(address _to, uint256 _value)  public returns (bool success){

    require(balanceOf[msg.sender] >= _value, "nema dovoljno na racunu");

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;

  }
 
}
