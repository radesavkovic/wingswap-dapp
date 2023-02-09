// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IReferral {
    event SetReferral(address indexed addr, address referralAddr);
    event SetRefFee(uint256 indexed percent, uint256 divisor);
    
    function setReferral(address _referralAddr) external;
    function getReferral(address _addr) external view returns (address);
    function setRefFee(uint256 _percent, uint256 _divisor) external;
    function getRefFee() external view returns (uint256 _percent, uint256 _divisor);
    function setMarketingAddress(address _newAddress) external;
}

contract Referral is IReferral{
    address public owner;

    struct RefFee {
        uint256 percent;
        uint256 divisor;
    }

    RefFee public refFee;

    address public marketingWallet = 0xb34DE4Fe762bce6e7B53570aC02609aAAD539350;
    mapping(address => address) public refInfo;

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    event SetMarketingAddress(
        address markeingAddress
    );

    constructor() {
        owner = msg.sender;

        refFee.percent = 2;
        refFee.divisor = 1000;
    }

    function setReferral(address _referralAddr) external {
        require(refInfo[msg.sender] != _referralAddr, "err: can't set equal referral address");

        refInfo[msg.sender] = _referralAddr;

        emit SetReferral(msg.sender, _referralAddr);
    }

    function getReferral(address _addr) external view returns (address refAddr) {
        refAddr = refInfo[_addr];
    }

    function setRefFee(uint256 _percent, uint256 _divisor) external onlyOwner {
        require(_percent > 0, "err: percent must be greater than zero");
        require(_divisor > 1, "err: divisor must be greater than 1");

        refFee.percent = _percent;
        refFee.divisor = _divisor;

        emit SetRefFee(_percent, _divisor);
    }

    function getRefFee() external view returns (uint256 _percent, uint256 _divisor) {
        _percent = refFee.percent;
        _divisor = refFee.divisor;
    }

    function setMarketingAddress(address _newAddress) external onlyOwner {
        require(marketingWallet != _newAddress, "err: can not set equal addr");
        marketingWallet = _newAddress;

        emit SetMarketingAddress(_newAddress);
    }

    function getMarketingAddress() external view returns (address _marketingAddr) {
        _marketingAddr = marketingWallet;
    }
}