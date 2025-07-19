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
  mapping(address => uint256) public balanceOf;
  
  constructor(uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSuply = _initialSupply;
    //prebaci sve tokene adminu

  }
 
}
