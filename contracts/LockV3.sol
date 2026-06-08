// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract LockV3 is Initializable, ERC20Upgradeable {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }

    function initialize(uint _unlockTime) public payable initializer {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function initializeV3(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) public reinitializer(2) {
        __ERC20_init(_name, _symbol);
        _mint(owner, _initialSupply);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    // nouvelle fonction
    function changeOwner(address _newOwner) public onlyOwner {
        owner = payable(_newOwner);
    }
}
