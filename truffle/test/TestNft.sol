pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract TestNft is ERC721Token {

    constructor() ERC721Token("Test", "TST") {

    }

    function mint() public {
        _mint(msg.sender, allTokens.length);
    }

}
