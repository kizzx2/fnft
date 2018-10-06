pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract FungibleNonFungibleToken is StandardToken {
    using SafeMath for uint;

    uint public constant decimals = 18;
    string public name;
    string public symbol;

    ERC721 public asset;
    uint public assetId;

    mapping (address => bool) public approved;
    uint public supplyApproved;

    bool public sold = false;
    bool public deposited = false;

    // TODO  Events

    constructor(
        string _name,
        string _symbol,
        address[] _owners,
        uint[] _stakes,
        address _assetAddress,
        uint _assetId
    ) public {
        name = _name;
        symbol = _symbol;
        assetId = _assetId;
        asset = ERC721(_assetAddress);
        require(asset.exists(assetId), "asset doesn't exist");
        for (uint i = 0; i < _owners.length; i++) {
            totalSupply_ = totalSupply_.add(_stakes[i]);
            balances[_owners[i]] = balances[_owners[i]].add(_stakes[i]);
        }
    }

    // sender has to approve transfer first, mby use 0x for this as well?
    function depositAsset() public {
        require(!deposited, "NFT already deposited");
        msg.sender.transfer(address(this).balance);
        asset.transferFrom(msg.sender, address(this), assetId);
        deposited = true;
    }

    function isSaleApproved() public view returns (bool) {
        return totalSupply_.div(2) < supplyApproved;
    }

    function approveSale() public {
        require(deposited, "nothing deposited yet");
        require(!approved[msg.sender], "sale already approved");
        approved[msg.sender] = true;
        supplyApproved = supplyApproved.add(balances[msg.sender]);
        if (isSaleApproved()) {
            fillBuyOrder(""); // 0x magic
        }
    }

    function disapproveSale() public {
        require(deposited, "nothing deposited yet");
        require(approved[msg.sender], "sale already disapproved");
        approved[msg.sender] = false;
        supplyApproved = supplyApproved.sub(balances[msg.sender]);
    }

    function () public payable {
        require(!deposited || isSaleApproved());
        // accept ether for
    }

    function isValidSignature(
        bytes32 hash,
        address signerAddress,
        bytes signature
    ) public view returns (bool) {
        // mby some 0x stuff?
        return isSaleApproved();
    }

    function fillBuyOrder(string hashor_signautre_or_0x_id) private {
        // 0x magic
        sold = true;
    }

    function shareInEth() public view returns (uint) {
        return this.balance / (totalSupply_ / balances[msg.sender]);
    }

    function withdraw() public {
        require(sold, "asset not sold");
        uint share = balances[msg.sender];
        require(share > 0, "has to have a share");
        balances[msg.sender] = 0;
        totalSupply_ = totalSupply_.sub(share);
        msg.sender.transfer(shareInEth());
    }

    modifier isTransferable(address _from, address _to) {
        require(asset.ownerOf(assetId) == address(this), "asset not owned");
        require(!approved[_from], "transfer from account that approved the sale");
        require(!approved[_to], "transfer to account that approved the sale");
        require(!sold, "asset already sold"); // can we allow token transfer after the sale?
        _;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public isTransferable(msg.sender, _to) returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public isTransferable(_from, _to) returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(
        address _spender,
        uint256 _value
    ) public isTransferable(msg.sender, _spender) returns (bool) {
        return super.approve(_spender, _value);
    }

    function increaseApproval(
        address _spender,
        uint _addedValue
    ) public isTransferable(msg.sender, _spender) returns (bool) {
        return super.increaseApproval(_spender, _addedValue);
    }

    function decreaseApproval(
        address _spender,
        uint _subtractedValue
    ) public isTransferable(msg.sender, _spender) returns (bool) {
        return super.decreaseApproval(_spender, _subtractedValue);
    }
}
