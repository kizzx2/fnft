pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract TestKitty is ERC721Token {
  constructor() ERC721Token("MyKitty", "MYKT") {}
  function mint(uint tid) public { _mint(msg.sender, tid); }
}
