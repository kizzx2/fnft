pragma ^0.4.25;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FungibleNonFungibleToken is ERC20 {
  using SafeMath for uint;

  // TODO make this parameterizable
  string public constant name = "ERC20_NAME";
  string public constant symbol = "ERC20_SYMBOL";

  uint public constant decimals = 18;

}
