// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Ethpins is ERC20, ERC20Burnable, ERC20Permit {
    constructor() ERC20("Ethpins", "PINO") ERC20Permit("Ethpins") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}