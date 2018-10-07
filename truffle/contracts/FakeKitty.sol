pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "./strings.sol";

// kities have same images as CryptoKitty ... coincidence?
contract FakeKitty is ERC721Token {
    using strings for *;

    constructor() ERC721Token("FakeKitty", "FKT") {}

    function mint(uint id) public {
        _mint(msg.sender, id);
        tokenURIs[id] = "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/".toSlice()
            .concat(int2string(id).toSlice())
            .toSlice()
            .concat(".svg".toSlice());
    }

    function int2string(uint i) internal pure returns (string){
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }
}
